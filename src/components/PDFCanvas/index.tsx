import { useRef, useEffect } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import { usePdfDownloader } from '@/hooks/usePdfDownloader';
import { useImageDownloader } from '@/hooks/useImageDownloader';
import { useCanvasInitializer } from '@/hooks/useCanvasInitializer';
import { useStampAdder } from '@/hooks/useStampAdder';

const PDFCanvas = () => {
  const { file, currentPage, totalPages, pageStamps } = useStore();
  const { isGeneratingPdf, downloadWithStamp } = usePdfDownloader();
  const { isGeneratingImage, downloadAsImage } = useImageDownloader();
  const { initializeCanvas } = useCanvasInitializer();
  const { applyStampToCurrentPage } = useStampAdder();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current);
    }
  }, [initializeCanvas]);

  const isDownloading = isGeneratingPdf || isGeneratingImage;
  const isDisabled = !file || isDownloading;
  const hasStamps = pageStamps.length > 0;

  // 현재 페이지에 도장 적용
  const handleApplyStamp = () => {
    applyStampToCurrentPage();
  };

  // PDF 다운로드 (현재 적용된 모든 도장 포함)
  const handleDownloadPDF = () => {
    if (hasStamps) {
      downloadWithStamp('all');
    } else {
      downloadWithStamp('current');
    }
  };

  return (
    <S.Container>
      <canvas ref={canvasRef} />

      <S.PageIndicator>
        {file && totalPages > 0 ? (
          <span>
            현재 페이지: {currentPage} / {totalPages}
          </span>
        ) : null}
      </S.PageIndicator>

      <S.ButtonContainer>
        <S.DownloadButton type="button" onClick={handleApplyStamp} disabled={isDisabled}>
          현재 페이지에 도장 적용
        </S.DownloadButton>

        <S.DownloadButton type="button" onClick={handleDownloadPDF} disabled={isDisabled}>
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
