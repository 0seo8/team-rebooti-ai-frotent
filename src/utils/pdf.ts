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
 * PDF 파일에 도장 이미지를 추가하여 새 PDF를 생성합니다.
 * @param pdfFile 원본 PDF 파일
 * @param stampDataUrl 도장 이미지 데이터 URL
 * @param position 도장 위치 (x, y 좌표와 너비, 높이)
 * @param pageNumber 도장을 추가할 페이지 번호 (1부터 시작)
 * @returns 도장이 추가된 PDF 파일의 Uint8Array
 */
export const addStampToPdf = async (
  pdfFile: File,
  stampDataUrl: string,
  position: { x: number; y: number; width: number; height: number },
  pageNumber: number = 1,
): Promise<Uint8Array> => {
  try {
    // 파일을 ArrayBuffer로 변환
    const fileArrayBuffer = await pdfFile.arrayBuffer();

    // PDF 문서 로드
    const pdfDoc = await PDFDocument.load(fileArrayBuffer);

    // 도장 이미지를 PNG로 변환
    const stampBytes = dataURLToBytes(stampDataUrl);
    const stampImage = await pdfDoc.embedPng(stampBytes);

    // PDF 페이지 가져오기 (페이지 번호는 0부터 시작하므로 -1)
    const pages = pdfDoc.getPages();
    const page = pages[pageNumber - 1];

    // 페이지 크기
    const { width, height } = page.getSize();

    // 상대적 위치를 절대 위치로 변환 (fabric.js 캔버스 좌표계 -> PDF 좌표계)
    const pdfX = position.x * (width / 500); // 캔버스 너비가 500px라고 가정
    const pdfY = height - position.y * (height / (500 * Math.sqrt(2))); // 캔버스 높이 조정

    // 도장 크기 조정
    const scaleWidth = position.width * (width / 500);
    const scaleHeight = position.height * (height / (500 * Math.sqrt(2)));

    // 도장 이미지 추가
    page.drawImage(stampImage, {
      x: pdfX,
      y: pdfY,
      width: scaleWidth,
      height: scaleHeight,
    });

    // 변경된 PDF 저장
    const modifiedPdfBytes = await pdfDoc.save();

    return modifiedPdfBytes;
  } catch (error) {
    console.error('PDF에 도장 추가 중 오류 발생:', error);
    throw new Error('PDF에 도장을 추가하는 중 오류가 발생했습니다.');
  }
};
