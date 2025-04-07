import { useCanvasInitializer } from './useCanvasInitializer';
import { useStampAdder } from './useStampAdder';
import { usePdfDownloader } from './usePdfDownloader';

/**
 * PDF 편집 관련 기능을 통합 제공하는 훅
 */
export const usePdfEditor = () => {
  const { initializeCanvas } = useCanvasInitializer();

  const { addStampToCanvas, focusActiveStamp } = useStampAdder();

  const { isGeneratingPdf, downloadAsImage, downloadWithStamp } = usePdfDownloader();

  return {
    initializeCanvas,

    // 도장 관련
    addStampToCanvas,
    focusActiveStamp,

    // 다운로드 관련
    isGeneratingPdf,
    downloadAsImage,
    downloadWithStamp,
  };
};
