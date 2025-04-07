import { useCallback, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { useStore } from '@/store';
import { getPageImageByFile, FABRIC_CANVAS_WIDTH, FABRIC_CANVAS_HEIGHT } from '@/utils/pdf';
import { toast } from 'sonner';

/**
 * 캔버스 초기화 관련 기능을 제공하는 훅
 */
export const useCanvasInitializer = () => {
  const { file, setCanvas, currentPage } = useStore();
  const lastFileRef = useRef<File | null>(null);
  const lastPageRef = useRef<number>(1);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const initialized = useRef(false);

  /**
   * 캔버스 초기화 함수
   */
  const initializeCanvas = useCallback(
    async (canvasElement: HTMLCanvasElement | null) => {
      if (!canvasElement) return;

      // 캔버스 요소 참조 저장
      canvasElementRef.current = canvasElement;

      // 파일이 있고 캔버스 요소가 있는 경우에만 초기화 진행
      if (file && (!lastFileRef.current || lastFileRef.current !== file || !initialized.current)) {
        // 마지막으로 처리한 파일 업데이트
        lastFileRef.current = file;
        lastPageRef.current = currentPage;
        initialized.current = true;

        try {
          // 새 캔버스 생성
          const newCanvas = new fabric.Canvas(canvasElement, {
            width: FABRIC_CANVAS_WIDTH,
            height: FABRIC_CANVAS_HEIGHT,
            selection: false,
          });

          // 캔버스 참조 저장
          canvasRef.current = newCanvas;

          // 스토어에 캔버스 저장
          setCanvas(newCanvas);

          // 현재 페이지 이미지 로드
          await updateCanvasBackground(newCanvas, file, currentPage);
        } catch (error) {
          console.error('캔버스 초기화 중 오류:', error);
          toast.error('캔버스 초기화 중 오류가 발생했습니다.');
        }
      }
    },
    [file, currentPage, setCanvas],
  );

  /**
   * 캔버스 배경 업데이트 함수
   */
  const updateCanvasBackground = async (
    canvas: fabric.Canvas,
    pdfFile: File,
    pageNumber: number,
  ) => {
    try {
      const image = await getPageImageByFile(pdfFile, pageNumber);

      if (image) {
        // 이미지 로드 및 캔버스 배경으로 설정
        fabric.FabricImage.fromURL(image).then((fabricImg) => {
          fabricImg.set({
            objectCaching: false,
            scaleX: FABRIC_CANVAS_WIDTH / (fabricImg.width || 1),
            scaleY: FABRIC_CANVAS_HEIGHT / (fabricImg.height || 1),
          });

          canvas.backgroundImage = fabricImg;
          canvas.renderAll();
        });
      }
    } catch (imageError) {
      console.error(`PDF 페이지 ${pageNumber} 이미지 로딩 실패:`, imageError);
      toast.error('PDF 이미지 로딩 중 오류가 발생했습니다.');
    }
  };

  // 페이지 변경 시 캔버스 배경 업데이트
  useEffect(() => {
    // 첫 실행이 아니고, 캔버스가 존재하고, 파일이 존재하고, 현재 페이지가 마지막으로 처리한 페이지와 다른 경우
    if (initialized.current && canvasRef.current && file && currentPage !== lastPageRef.current) {
      lastPageRef.current = currentPage;
      updateCanvasBackground(canvasRef.current, file, currentPage);
    }
  }, [currentPage, file]);

  return {
    initializeCanvas,
  };
};
