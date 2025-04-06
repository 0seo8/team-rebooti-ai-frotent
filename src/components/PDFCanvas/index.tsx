import { useEffect, useRef } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import { Canvas, Image as FabricImage } from 'fabric';
import { getImageByFile } from '@/utils/pdf';
import { toast } from 'sonner';
import { usePdfDownload } from '@/hooks/usePdfDownload';

const FABRIC_CANVAS_WIDTH = 500;
const FABRIC_CANVAS_HEIGHT = parseFloat((FABRIC_CANVAS_WIDTH * Math.sqrt(2)).toFixed(2));

const PDFCanvas = () => {
  const { file, selectedStamp } = useStore();
  const { isGeneratingPdf, downloadAsImage, downloadWithStamp } = usePdfDownload();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const stampImageRef = useRef<FabricImage | null>(null);

  // 이미지로 다운로드
  const handleImageDownload = () => {
    if (!fabricCanvasRef.current || !file) {
      toast.error('다운로드할 PDF가 없습니다.');
      return;
    }

    downloadAsImage(fabricCanvasRef.current, file.name);
  };

  // PDF로 다운로드
  const handlePDFDownload = () => {
    if (!fabricCanvasRef.current || !file || !stampImageRef.current) {
      toast.error('다운로드할 PDF가 없거나 도장이 추가되지 않았습니다.');
      return;
    }

    // 도장 위치 및 크기 가져오기
    const stampObj = stampImageRef.current;
    const position = {
      x: stampObj.left || 0,
      y: stampObj.top || 0,
      width: (stampObj.width || 0) * (stampObj.scaleX || 1),
      height: (stampObj.height || 0) * (stampObj.scaleY || 1),
    };

    // 도장 데이터 URL 가져오기
    const stampDataUrl = selectedStamp?.src || '';

    // PDF 다운로드
    downloadWithStamp(file, stampDataUrl, position);
  };

  // PDF 파일이 변경될 때 캔버스 초기화
  useEffect(() => {
    if (!file || !canvasRef.current) return;

    // 기존 캔버스가 있으면 제거
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    // 새 캔버스 생성
    fabricCanvasRef.current = new Canvas(canvasRef.current, {
      width: FABRIC_CANVAS_WIDTH,
      height: FABRIC_CANVAS_HEIGHT,
      selection: false,
    });

    (async () => {
      try {
        const image = await getImageByFile(file);

        if (image) {
          FabricImage.fromURL(image).then((img) => {
            img.set({
              objectCaching: false,
            });

            if (fabricCanvasRef.current) {
              // 백그라운드 이미지로 설정
              fabricCanvasRef.current.backgroundImage = img;
              fabricCanvasRef.current.renderAll();
            }
          });
        }
      } catch (error) {
        console.error('PDF 이미지 로딩 실패:', error);
        toast.error('PDF 이미지 로딩 중 오류가 발생했습니다.');
      }
    })();

    // 컴포넌트가 언마운트될 때 캔버스 정리
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [file]);

  // 선택된 도장이 변경될 때 도장 이미지 추가
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    // 기존 도장 이미지 제거
    if (stampImageRef.current) {
      fabricCanvasRef.current.remove(stampImageRef.current);
      stampImageRef.current = null;
    }

    // 새 도장 이미지 추가
    if (selectedStamp) {
      FabricImage.fromURL(selectedStamp.src).then((img) => {
        // 이미지 크기 조정 (너무 크지 않게)
        const maxSize = 100;
        if (img.width && img.height) {
          if (img.width > maxSize || img.height > maxSize) {
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            img.scale(scale);
          }
        }

        // 이미지 위치 설정 (중앙)
        img.set({
          left: fabricCanvasRef.current!.width! / 2 - (img.width! * img.scaleX!) / 2,
          top: fabricCanvasRef.current!.height! / 2 - (img.height! * img.scaleY!) / 2,
          cornerSize: 8,
          transparentCorners: false,
          borderColor: '#2196F3',
          cornerColor: '#2196F3',
        });

        // 이미지를 캔버스에 추가하고 선택 상태로 설정
        fabricCanvasRef.current!.add(img);
        fabricCanvasRef.current!.setActiveObject(img);
        stampImageRef.current = img;
        fabricCanvasRef.current!.renderAll();

        toast.success('도장이 캔버스에 추가되었습니다. 드래그하여 위치를 조정할 수 있습니다.');
      });
    }
  }, [selectedStamp]);

  return (
    <S.Container>
      <canvas ref={canvasRef} />

      <S.ButtonContainer>
        <S.DownloadButton type="button" onClick={handleImageDownload} disabled={!file}>
          이미지로 다운로드
        </S.DownloadButton>

        <S.DownloadButton
          type="button"
          onClick={handlePDFDownload}
          disabled={!file || !stampImageRef.current || isGeneratingPdf}
        >
          {isGeneratingPdf ? 'PDF 생성 중...' : 'PDF로 다운로드'}
        </S.DownloadButton>
      </S.ButtonContainer>
    </S.Container>
  );
};

export default PDFCanvas;
