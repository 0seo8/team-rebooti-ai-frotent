import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';
import { PDFDocument } from 'pdf-lib';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * PDF 파일을 이미지로 변환합니다.
 * @param file PDF 파일
 * @returns 이미지 데이터 URL, 에러 메시지, 파일 이름을 포함한 객체
 */
export const pdfFileToImage = async (
  file: File,
): Promise<{
  image: string;
  error: string | null;
  fileName: string;
}> => {
  const pdfUrl = URL.createObjectURL(file);

  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    const renderPageToImage = async (): Promise<string> => {
      const page = await pdf.getPage(1); // 페이지 번호는 1부터 시작
      const viewport = page.getViewport({ scale: 5 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context!, viewport }).promise;

      return canvas.toDataURL('image/png');
    };

    return {
      image: await renderPageToImage(),
      error: null,
      fileName: file.name,
    };
  } catch (error) {
    console.error('PDF 변환 중 오류 발생:', error);
    return {
      image: '',
      error: 'PDF 파일을 처리하는 중 오류가 발생했습니다.',
      fileName: file.name,
    };
  } finally {
    // 메모리 누수 방지를 위해 URL 객체 해제
    URL.revokeObjectURL(pdfUrl);
  }
};

/**
 * 파일로부터 이미지 데이터 URL을 가져옵니다.
 * @param file PDF 파일
 * @returns 이미지 데이터 URL
 */
export const getImageByFile = async (file: File): Promise<string | undefined> => {
  const result = await pdfFileToImage(file);
  return result.image;
};

/**
 * Base64 데이터 URL에서 바이너리 데이터를 추출합니다.
 * @param dataUrl Base64 이미지 데이터 URL
 * @returns 바이너리 데이터
 */
export const dataURLToBytes = (dataUrl: string): Uint8Array => {
  const base64 = dataUrl.split(',')[1];
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

/**
 * PDF 파일에 도장 이미지를 추가하는 함수
 * @param pdfFile PDF 파일
 * @param stampImage 도장 이미지 (dataURL 형식)
 * @param position 도장 위치 정보 (선택 사항)
 * @param pageNumber 도장을 추가할 페이지 번호 (1부터 시작, 기본값 1)
 * @returns 도장이 추가된 PDF의 Uint8Array
 */
export const addStampToPDF = async (
  pdfFile: File,
  stampImage: string,
  position?: { x: number; y: number; width: number; height: number },
  pageNumber: number = 1,
): Promise<Uint8Array> => {
  try {
    // PDF 파일을 ArrayBuffer로 읽기
    const pdfBytes = await pdfFile.arrayBuffer();

    // PDF 문서 로드
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // 도장 이미지가 데이터 URL 형식인지 확인
    let imageData;
    if (stampImage.startsWith('data:')) {
      // 도장 이미지를 추가하기 위해 base64 문자열에서 데이터 추출
      imageData = dataURLToBytes(stampImage);
    } else {
      throw new Error('도장 이미지는 유효한 데이터 URL 형식이어야 합니다.');
    }

    // 도장 이미지가 PNG 형식인지 확인하고 임베딩
    let stampPng;
    if (stampImage.includes('image/png')) {
      stampPng = await pdfDoc.embedPng(imageData);
    } else {
      // 다른 형식의 이미지인 경우 대체 처리
      throw new Error('도장 이미지는 PNG 형식이어야 합니다.');
    }

    // PDF 페이지 가져오기 (페이지 번호는 0부터 시작하므로 -1)
    const pages = pdfDoc.getPages();

    // 페이지 번호 유효성 검사
    if (pageNumber < 1 || pageNumber > pages.length) {
      throw new Error(
        `유효하지 않은 페이지 번호입니다. 1부터 ${pages.length}까지의 값을 사용하세요.`,
      );
    }

    const page = pages[pageNumber - 1];

    // 페이지 크기 가져오기
    const { width, height } = page.getSize();

    // 도장 이미지 크기 및 위치 계산
    let stampX, stampY, stampWidth, stampHeight;

    if (position) {
      // 상대적 위치를 절대 위치로 변환 (fabric.js 캔버스 좌표계 -> PDF 좌표계)
      stampX = position.x;
      stampY = position.y;
      stampWidth = position.width;
      stampHeight = position.height;

      // fabric.js 캔버스 좌표계 사용 시 추가 변환 적용
      if (stampX <= FABRIC_CANVAS_WIDTH && stampY <= FABRIC_CANVAS_HEIGHT) {
        stampX = position.x * (width / FABRIC_CANVAS_WIDTH);
        stampY = height - position.y * (height / FABRIC_CANVAS_HEIGHT);
        stampWidth = position.width * (width / FABRIC_CANVAS_WIDTH);
        stampHeight = position.height * (height / FABRIC_CANVAS_HEIGHT);
      }
    } else {
      // 기본 크기 및 중앙 위치 설정
      stampWidth = 100;
      stampHeight = 100;
      stampX = width / 2 - stampWidth / 2;
      stampY = height / 2 - stampHeight / 2;
    }

    // 도장 이미지 추가
    page.drawImage(stampPng, {
      x: stampX,
      y: stampY,
      width: stampWidth,
      height: stampHeight,
    });

    // 수정된 PDF를 바이너리 형식으로 저장
    const modifiedPdfBytes = await pdfDoc.save();

    return modifiedPdfBytes;
  } catch (error) {
    console.error('PDF에 도장 추가 중 오류:', error);
    throw new Error('PDF에 도장을 추가하는 중 오류가 발생했습니다.');
  }
};

/**
 * PDF 파일의 페이지 수를 가져옵니다.
 * @param file PDF 파일
 * @returns 페이지 수
 */
export const getPdfPageCount = async (file: File): Promise<number> => {
  const pdfUrl = URL.createObjectURL(file);

  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    return pdf.numPages;
  } catch (error) {
    console.error('PDF 페이지 수 확인 중 오류:', error);
    throw new Error('PDF 파일의 페이지 수를 확인하는 중 오류가 발생했습니다.');
  } finally {
    URL.revokeObjectURL(pdfUrl);
  }
};

// 캔버스 상수 (PDFCanvas 컴포넌트와 동일하게 유지)
export const FABRIC_CANVAS_WIDTH = 500;
export const FABRIC_CANVAS_HEIGHT = parseFloat((FABRIC_CANVAS_WIDTH * Math.sqrt(2)).toFixed(2));
