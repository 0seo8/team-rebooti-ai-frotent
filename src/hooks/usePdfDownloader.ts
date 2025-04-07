import { useState } from 'react';
import { useStore } from '@/store';
import { addStampToPDF } from '@/utils/pdf';
import { toast } from 'sonner';

/**
 * PDF 다운로드 관련 기능을 제공하는 훅
 */
export const usePdfDownloader = () => {
  const { file, selectedStamp, canvas } = useStore();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  /**
   * PDF에 도장을 적용하고 다운로드
   */
  const downloadWithStamp = async () => {
    if (!canvas || !file || !selectedStamp) {
      toast.error('PDF와 도장이 모두 있어야 다운로드할 수 있습니다.');
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // 도장 위치 정보 가져오기
      const activeObject = canvas.getActiveObject();
      let stampPosition: { x: number; y: number; width: number; height: number } | undefined;

      if (activeObject) {
        stampPosition = {
          x: activeObject.left || 0,
          y: activeObject.top || 0,
          width: (activeObject.width || 100) * (activeObject.scaleX || 1),
          height: (activeObject.height || 100) * (activeObject.scaleY || 1),
        };
      }

      // PDF에 도장 적용하기
      const pdfBytes = await addStampToPDF(file, selectedStamp.src, stampPosition);

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
    downloadWithStamp,
  };
};
