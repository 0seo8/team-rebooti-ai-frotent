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
    (canvasElement: HTMLCanvasElement | null) => {
      // 파일이 있고 캔버스 요소가 있는 경우에만 초기화 진행
      if (
        file &&
        canvasElement &&
        (!lastFileRef.current || lastFileRef.current !== file || !initialized.current)
      ) {
        // 마지막으로 처리한 파일 업데이트
        lastFileRef.current = file;
        initialized.current = true;

        try {
          // 새 캔버스 생성
          const newCanvas = new fabric.Canvas(canvasElement, {
            width: FABRIC_CANVAS_WIDTH,
            height: FABRIC_CANVAS_HEIGHT,
            selection: false,
          });

          // 스토어에 캔버스 저장
          setCanvas(newCanvas);

          // PDF 이미지 로드 및 배경으로 설정
          getImageByFile(file)
            .then((image) => {
              if (image) {
                fabric.FabricImage.fromURL(image).then((img) => {
                  img.set({
                    objectCaching: false,
                  });

                  newCanvas.backgroundImage = img;
                  newCanvas.requestRenderAll();
                });
              }
            })
            .catch((error) => {
              console.error('PDF 이미지 로딩 실패:', error);
              toast.error('PDF 이미지 로딩 중 오류가 발생했습니다.');
            });
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
