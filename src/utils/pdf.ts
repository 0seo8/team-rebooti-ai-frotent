import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';

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
