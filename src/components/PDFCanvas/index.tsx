import { useEffect, useRef } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import * as fabric from 'fabric';
import { getImageByFile } from '@/utils/pdf';

const FABRIC_CANVAS_WIDTH = 500;
const FABRIC_CANVAS_HEIGHT = parseFloat((FABRIC_CANVAS_WIDTH * Math.sqrt(2)).toFixed(2));

const PDFCanvas = () => {
  const { file } = useStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const handlePDFDownload = async () => {
    // PDF 다운로드 기능 구현 예정
  };

  useEffect(() => {
    if (!file || !canvasRef.current) return;

    // 기존 캔버스가 있으면 제거
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    // 새 캔버스 생성
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: FABRIC_CANVAS_WIDTH,
      height: FABRIC_CANVAS_HEIGHT,
      selection: false,
    });

    (async () => {
      try {
        const image = await getImageByFile(file);

        if (image) {
          const img = await fabric.FabricImage.fromURL(image);

          img.set({
            objectCaching: false,
          });

          fabricCanvasRef.current!.backgroundImage = img;
          fabricCanvasRef.current?.requestRenderAll();
        }
      } catch (error) {
        console.error('PDF 이미지 로딩 실패:', error);
      }
    })();

    // 컴포넌트가 언마운트될 때 캔버스 정리
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [file]);

  return (
    <S.Container>
      <canvas ref={canvasRef} />

      <S.DownloadButton type="button" onClick={handlePDFDownload}>
        PDF 다운로드
      </S.DownloadButton>
    </S.Container>
  );
};

export default PDFCanvas;
