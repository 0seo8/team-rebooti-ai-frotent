import { useRef, useEffect } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import { usePdfDownloader } from '@/hooks/usePdfDownloader';
import { useImageDownloader } from '@/hooks/useImageDownloader';
import { useCanvasInitializer } from '@/hooks/useCanvasInitializer';

const PDFCanvas = () => {
  const { file } = useStore();
  const { isGeneratingPdf, downloadWithStamp } = usePdfDownloader();
  const { isGeneratingImage, downloadAsImage } = useImageDownloader();
  const { initializeCanvas } = useCanvasInitializer();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current);
    }
  }, [initializeCanvas]);

  const isDownloading = isGeneratingPdf || isGeneratingImage;
  const isDisabled = !file || isDownloading;

  return (
    <S.Container>
      <canvas ref={canvasRef} />

      <S.ButtonContainer>
        <S.DownloadButton type="button" onClick={downloadWithStamp} disabled={isDisabled}>
          {isGeneratingPdf ? '다운로드 중...' : 'PDF 다운로드'}
        </S.DownloadButton>

        <S.DownloadButton type="button" onClick={downloadAsImage} disabled={isDisabled}>
          {isGeneratingImage ? '다운로드 중...' : '이미지로 다운로드'}
        </S.DownloadButton>
      </S.ButtonContainer>
    </S.Container>
  );
};

export default PDFCanvas;
