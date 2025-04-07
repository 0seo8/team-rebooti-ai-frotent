import { useCallback, useRef } from 'react';
import * as fabric from 'fabric';
import { useStore } from '@/store';
import { getImageByFile, FABRIC_CANVAS_WIDTH, FABRIC_CANVAS_HEIGHT } from '@/utils/pdf';
import { toast } from 'sonner';

/**
 * 캔버스 초기화 관련 기능을 제공하는 훅
 */
export const useCanvasInitializer = () => {
  const { file, setCanvas } = useStore();
  const lastFileRef = useRef<File | null>(null);
  const initialized = useRef(false);

  /**
   * 캔버스 초기화 함수
   */
  const initializeCanvas = useCallback(
    async (canvasElement: HTMLCanvasElement | null) => {
      // 파일이 있고 캔버스 요소가 있는 경우에만 초기화 진행
      if (
        file &&
        canvasElement &&
        (!lastFileRef.current || lastFileRef.current !== file || !initialized.current)
      ) {
        lastFileRef.current = file;
        initialized.current = true;

        try {
          const newCanvas = new fabric.Canvas(canvasElement, {
            width: FABRIC_CANVAS_WIDTH,
            height: FABRIC_CANVAS_HEIGHT,
            selection: false,
          });

          setCanvas(newCanvas);

          try {
            const image = await getImageByFile(file);

            if (image) {
              fabric.FabricImage.fromURL(image).then((fabricImg) => {
                fabricImg.set({
                  objectCaching: false,
                  scaleX: FABRIC_CANVAS_WIDTH / (fabricImg.width || 1),
                  scaleY: FABRIC_CANVAS_HEIGHT / (fabricImg.height || 1),
                });

                newCanvas.backgroundImage = fabricImg;
                newCanvas.renderAll();
              });
            }
          } catch (imageError) {
            console.error('PDF 이미지 로딩 실패:', imageError);
            toast.error('PDF 이미지 로딩 중 오류가 발생했습니다.');
          }
        } catch (error) {
          console.error('캔버스 초기화 중 오류:', error);
          toast.error('캔버스 초기화 중 오류가 발생했습니다.');
        }
      }
    },
    [file, setCanvas],
  );

  return {
    initializeCanvas,
  };
};
