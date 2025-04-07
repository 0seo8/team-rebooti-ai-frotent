import { useStore } from '@/store';
import * as S from './styles';
import { usePdfEditor } from '@/hooks/usePdfEditor';

const PDFCanvas = () => {
  const { file, selectedStamp } = useStore();
  const { isGeneratingPdf, downloadWithStamp, initializeCanvas } = usePdfEditor(
    file,
    selectedStamp,
  );

  const handleCanvasRef = (element: HTMLCanvasElement | null) => {
    if (element) {
      initializeCanvas(element);
    }
  };

  return (
    <S.Container>
      <canvas ref={handleCanvasRef} />

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
