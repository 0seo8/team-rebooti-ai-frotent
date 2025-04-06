import { useState } from 'react';
import { addStampToPdf } from '@/utils/pdf';
import { toast } from 'sonner';
import { Canvas } from 'fabric';

interface StampPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * PDF 다운로드 기능을 제공하는 훅
 */
export const usePdfDownload = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  /**
   * 캔버스를 이미지로 다운로드
   * @param canvas fabric.js 캔버스 객체
   * @param fileName 파일 이름
   */
  const downloadAsImage = async (canvas: Canvas, fileName: string) => {
    if (!canvas) {
      toast.error('캔버스가 준비되지 않았습니다.');
      return;
    }

    try {
      // 캔버스를 이미지로 변환
      const dataURL = canvas.toDataURL({
        format: 'png',
        multiplier: 1,
      });

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `preview_${fileName.replace('.pdf', '')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('이미지가 다운로드되었습니다.');
    } catch (error) {
      console.error('이미지 다운로드 중 오류:', error);
      toast.error('이미지 다운로드 중 오류가 발생했습니다.');
    }
  };

  /**
   * PDF에 도장을 적용하고 다운로드
   * @param file PDF 파일
   * @param stampDataUrl 도장 이미지 데이터 URL
   * @param position 도장 위치 및 크기
   */
  const downloadWithStamp = async (file: File, stampDataUrl: string, position: StampPosition) => {
    if (!file || !stampDataUrl) {
      toast.error('PDF 파일 또는 도장 이미지가 없습니다.');
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // PDF에 도장 적용하기
      const pdfBytes = await addStampToPdf(file, stampDataUrl, position);

      // Blob 생성
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `stamped_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Blob URL 해제
      URL.revokeObjectURL(link.href);

      toast.success('도장이 적용된 PDF가 다운로드되었습니다.');
    } catch (error) {
      console.error('PDF 다운로드 중 오류:', error);
      toast.error('PDF 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return {
    isGeneratingPdf,
    downloadAsImage,
    downloadWithStamp,
  };
};
