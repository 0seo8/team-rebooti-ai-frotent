import { useRef, useEffect } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import { usePdfDownloader } from '@/hooks/usePdfDownloader';
import { useCanvasInitializer } from '@/hooks/useCanvasInitializer';

const PDFCanvas = () => {
  const { file } = useStore();
  const { isGeneratingPdf, downloadWithStamp } = usePdfDownloader();
  const { initializeCanvas } = useCanvasInitializer();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current);
    }
  }, [initializeCanvas]);

  return (
    <S.Container>
      <canvas ref={canvasRef} />

      <S.DownloadButton
        type="button"
        onClick={downloadWithStamp}
        disabled={!file || isGeneratingPdf}
      >
        {isGeneratingPdf ? '다운로드 중...' : 'PDF 다운로드'}
      </S.DownloadButton>
    </S.Container>
  );
};

export default PDFCanvas;
