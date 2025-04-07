import { useState } from 'react';
import { useStore } from '@/store';
import { addStampToPDF, addStampToAllPDFPages } from '@/utils/pdf';
import { toast } from 'sonner';

/**
 * PDF 다운로드 관련 기능을 제공하는 훅
 */
export const usePdfDownloader = () => {
  const { file, selectedStamp, canvas, currentPage, pageStamps, stamps } = useStore();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  /**
   * 현재 캔버스에 표시된 도장의 위치 정보를 가져옴
   */
  const getCurrentStampPosition = () => {
    if (!canvas) return undefined;

    // 캔버스에서 활성화된 객체 가져오기
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return undefined;

    // 도장 위치 및 크기 정보 생성
    return {
      x: activeObject.left || 0,
      y: activeObject.top || 0,
      width: (activeObject.width || 100) * (activeObject.scaleX || 1),
      height: (activeObject.height || 100) * (activeObject.scaleY || 1),
    };
  };

  /**
   * 저장된 모든 도장을 PDF에 적용하고 다운로드
   */
  const downloadWithSavedStamps = async () => {
    if (!file || pageStamps.length === 0) {
      toast.error('PDF에 적용된 도장이 없습니다.');
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // PDF 파일을 ArrayBuffer로 읽기
      const pdfArrayBuffer = await file.arrayBuffer();
      // ArrayBuffer를 Uint8Array로 변환
      let modifiedPdfBytes = new Uint8Array(pdfArrayBuffer);

      // 모든 저장된 도장을 PDF에 적용
      for (const pageStamp of pageStamps) {
        // 해당 도장 찾기
        const stamp = stamps.find((s) => s.id === pageStamp.stampId);
        if (!stamp) continue;

        // 각 페이지에 도장 적용
        modifiedPdfBytes = await addStampToPDF(
          new File([modifiedPdfBytes], file.name, { type: file.type }),
          stamp.src,
          pageStamp.position,
          pageStamp.pageNumber,
        );
      }

      // Blob 생성
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

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

  /**
   * PDF에 도장을 적용하고 다운로드
   * @param mode 도장 적용 모드 ('current', 'all')
   */
  const downloadWithStamp = async (mode: 'current' | 'all' = 'current') => {
    if (!file) {
      toast.error('PDF 파일이 필요합니다.');
      return;
    }

    // 저장된 도장이 있을 경우, 그 정보를 사용하여 PDF 다운로드
    if (mode === 'all' && pageStamps.length > 0) {
      await downloadWithSavedStamps();
      return;
    }

    // 현재 캔버스에 활성화된 도장이 없고 현재 페이지에 저장된 도장도 없으면 오류 메시지
    if (!selectedStamp && !canvas?.getActiveObject()) {
      toast.error('도장을 먼저 배치해주세요.');
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // 도장 위치 정보 가져오기
      const stampPosition = getCurrentStampPosition();

      // PDF에 도장 적용하기
      let pdfBytes;
      let prefix = '';

      if (mode === 'current') {
        pdfBytes = await addStampToPDF(file, selectedStamp!.src, stampPosition, currentPage);
        toast.success(`${currentPage}페이지에 도장이 적용되었습니다.`);
        prefix = `stamped_p${currentPage}_`;
      } else {
        pdfBytes = await addStampToAllPDFPages(file, selectedStamp!.src, stampPosition);
        toast.success('모든 페이지에 도장이 적용되었습니다.');
        prefix = 'stamped_all_';
      }

      // Blob 생성
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${prefix}${file.name}`;
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
