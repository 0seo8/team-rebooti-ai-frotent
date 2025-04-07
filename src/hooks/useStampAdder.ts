import { useCallback } from 'react';
import * as fabric from 'fabric';
import { toast } from 'sonner';
import { useStore, PageStamp } from '@/store';

/**
 * 도장 추가 및 포커스 관련 기능을 제공하는 훅
 */
export const useStampAdder = () => {
  const {
    selectedStamp,
    stampObject,
    setStampObject,
    canvas,
    currentPage,
    addPageStamp,
    getPageStamp,
  } = useStore();

  /**
   * 캔버스에 도장 추가하는 함수
   * @returns Promise<boolean> 도장 추가 성공 여부를 나타내는 Promise 반환
   */
  const addStampToCanvas = useCallback(
    (targetCanvas: fabric.Canvas): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        if (!selectedStamp) {
          resolve(false);
          return;
        }

        // 기존 도장 이미지 제거
        if (stampObject) {
          targetCanvas.remove(stampObject);
          // 이전 참조 제거
          setStampObject(null);
        }

        try {
          // 현재 페이지에 저장된 도장 정보가 있는지 확인
          const existingPageStamp = getPageStamp(currentPage);

          if (existingPageStamp && selectedStamp) {
            // 저장된 도장 정보가 있으면 해당 위치에 도장 추가
            addSavedStampToCanvas(targetCanvas, existingPageStamp, selectedStamp.src);
            resolve(true);
            return;
          }

          // 직접 Image 객체를 생성하여 로드
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              // 로드된 이미지로 Fabric 이미지 생성
              const fabricImg = new fabric.FabricImage(img);

              // 이미지 크기 조정 (너무 크지 않게)
              const maxSize = 100;
              if (fabricImg.width && fabricImg.height) {
                if (fabricImg.width > maxSize || fabricImg.height > maxSize) {
                  const scale = Math.min(maxSize / fabricImg.width, maxSize / fabricImg.height);
                  fabricImg.scale(scale);
                }
              }

              // 이미지 위치 설정 (중앙)
              fabricImg.set({
                left: targetCanvas.width! / 2 - (fabricImg.width! * fabricImg.scaleX!) / 2,
                top: targetCanvas.height! / 2 - (fabricImg.height! * fabricImg.scaleY!) / 2,
                cornerSize: 8,
                transparentCorners: false,
                borderColor: '#2196F3',
                cornerColor: '#2196F3',
              });

              // 이미지를 캔버스에 추가하고 선택 상태로 설정
              targetCanvas.add(fabricImg);
              targetCanvas.setActiveObject(fabricImg);

              // 스토어에 도장 객체 저장
              setStampObject(fabricImg);

              targetCanvas.requestRenderAll();

              toast.success('도장이 추가되었습니다.');

              resolve(true);
            } catch (fabricError) {
              console.error('Fabric 이미지 처리 중 오류:', fabricError);
              toast.error('도장 이미지 처리 중 오류가 발생했습니다.');
              resolve(false);
            }
          };

          img.onerror = () => {
            toast.error('도장 이미지 로드 중 오류가 발생했습니다.');
            resolve(false);
          };

          // 이미지 로드 시작
          img.src = selectedStamp.src;
        } catch {
          toast.error('도장 이미지를 추가하는 중 오류가 발생했습니다.');
          resolve(false);
        }
      });
    },
    [selectedStamp, stampObject, setStampObject, currentPage, getPageStamp],
  );

  /**
   * 저장된 도장 정보를 이용해 캔버스에 도장 추가
   */
  const addSavedStampToCanvas = (
    targetCanvas: fabric.Canvas,
    pageStamp: PageStamp,
    stampSrc: string,
  ) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const fabricImg = new fabric.FabricImage(img);

        // 저장된 위치와 크기 적용
        fabricImg.set({
          left: pageStamp.position.x,
          top: pageStamp.position.y,
          scaleX: pageStamp.position.width / (fabricImg.width || 1),
          scaleY: pageStamp.position.height / (fabricImg.height || 1),
          cornerSize: 8,
          transparentCorners: false,
          borderColor: '#2196F3',
          cornerColor: '#2196F3',
        });

        // 이미지를 캔버스에 추가하고 선택 상태로 설정
        targetCanvas.add(fabricImg);
        targetCanvas.setActiveObject(fabricImg);

        // 스토어에 도장 객체 저장
        setStampObject(fabricImg);
        targetCanvas.requestRenderAll();
      } catch (error) {
        console.error('저장된 도장 적용 중 오류:', error);
      }
    };

    img.onerror = () => {
      console.error('도장 이미지 로드 중 오류');
    };

    img.src = stampSrc;
  };

  /**
   * 도장에 포커스를 설정하고 사용자에게 알림
   */
  const focusActiveStamp = useCallback(async () => {
    if (!canvas) {
      toast.error('캔버스가 준비되지 않았습니다.');
      return false;
    }

    if (!stampObject) {
      if (selectedStamp) {
        toast.info('도장을 추가하는 중입니다...');

        try {
          // Promise 기반 함수 호출
          const success = await addStampToCanvas(canvas);

          if (success) {
            // 도장 객체가 성공적으로 추가되었으므로 포커스 즉시 시도
            const currentStampObject = useStore.getState().stampObject;
            if (currentStampObject) {
              canvas.setActiveObject(currentStampObject);
              canvas.requestRenderAll();
              toast.success('도장을 드래그하여 위치를 조정한 후 도장 적용 버튼을 클릭하세요.');
              return true;
            }
          }

          return false;
        } catch (error) {
          console.error('도장 추가 중 오류가 발생했습니다.', error);
          toast.error('도장 추가 중 오류가 발생했습니다.');
          return false;
        }
      }

      toast.error('선택된 도장이 없습니다. 도장을 먼저 선택해주세요.');
      return false;
    }

    try {
      // 도장을 선택 상태로 설정
      canvas.setActiveObject(stampObject);
      canvas.requestRenderAll();

      toast.success('도장을 드래그하여 위치를 조정한 후 도장 적용 버튼을 클릭하세요.');
      return true;
    } catch {
      toast.error('도장 선택 중 오류가 발생했습니다.');
      return false;
    }
  }, [canvas, stampObject, selectedStamp, addStampToCanvas]);

  /**
   * 현재 페이지에 도장 적용 (상태에 저장)
   */
  const applyStampToCurrentPage = useCallback(() => {
    if (!canvas || !stampObject || !selectedStamp) {
      toast.error('도장을 먼저 배치해주세요.');
      return false;
    }

    // 현재 도장 위치 및 크기 정보
    const position = {
      x: stampObject.left || 0,
      y: stampObject.top || 0,
      width: (stampObject.width || 100) * (stampObject.scaleX || 1),
      height: (stampObject.height || 100) * (stampObject.scaleY || 1),
    };

    // 페이지 도장 정보 생성
    const pageStamp: PageStamp = {
      pageNumber: currentPage,
      stampId: selectedStamp.id,
      position,
    };

    // 스토어에 저장
    addPageStamp(pageStamp);

    // 현재 객체 초기화하여 중복 적용 방지
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    toast.success(`페이지 ${currentPage}에 도장이 적용되었습니다.`);
    return true;
  }, [canvas, stampObject, selectedStamp, currentPage, addPageStamp]);

  return {
    addStampToCanvas,
    focusActiveStamp,
    applyStampToCurrentPage,
  };
};
