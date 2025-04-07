import { useState, useRef, useEffect } from 'react';
import {
  addStampToPDF,
  getImageByFile,
  FABRIC_CANVAS_WIDTH,
  FABRIC_CANVAS_HEIGHT,
} from '@/utils/pdf';
import { toast } from 'sonner';
import * as fabric from 'fabric';
import { Stamp } from '@/store';

interface StampPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * PDF 편집 및 다운로드 기능을 제공하는 훅
 */
export const usePdfEditor = (file: File | null, selectedStamp: Stamp | null) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const stampImageRef = useRef<fabric.Image | null>(null);

  /**
   * 캔버스를 이미에 다운로드
   */
  const downloadAsImage = async (fileName: string) => {
    if (!fabricCanvasRef.current) {
      toast.error('캔버스가 준비되지 않았습니다.');
      return;
    }

    try {
      // 캔버스를 이미지로 변환
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        multiplier: 1,
      });

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `preview_${fileName.replace('.pdf', '')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('이미지가 다운로드되었습니다.');
    } catch (error) {
      console.error('이미지 다운로드 중 오류:', error);
      toast.error('이미지 다운로드 중 오류가 발생했습니다.');
    }
  };

  /**
   * PDF에 도장을 적용하고 다운로드
   */
  const downloadWithStamp = async () => {
    if (!fabricCanvasRef.current || !file || !selectedStamp) {
      toast.error('PDF와 도장이 모두 있어야 다운로드할 수 있습니다.');
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // 도장 위치 정보 가져오기
      const activeObject = fabricCanvasRef.current.getActiveObject();
      let stampPosition: StampPosition | undefined;

      if (activeObject) {
        // 캔버스에서의 도장 위치 및 크기
        stampPosition = {
          x: activeObject.left || 0,
          y: activeObject.top || 0,
          width: (activeObject.width || 100) * (activeObject.scaleX || 1),
          height: (activeObject.height || 100) * (activeObject.scaleY || 1),
        };
      }

      // PDF에 도장 적용하기
      const pdfBytes = await addStampToPDF(file, selectedStamp.src, stampPosition);

      // Blob 생성
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `stamped_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Blob URL 해제
      URL.revokeObjectURL(link.href);

      toast.success('도장이 적용된 PDF가 다운로드되었습니다.');
    } catch (error) {
      console.error('PDF 다운로드 중 오류:', error);
      toast.error('PDF 다운로드 중 오류가 발생했습니다.');

      // 오류 발생 시 PNG로 대체 다운로드 제공
      if (file) {
        toast.info('PNG 형식으로 다운로드를 시도합니다.');
        await downloadAsImage(file.name);
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  /**
   * 캔버스 초기화 및 PDF 렌더링
   */
  const initializeCanvas = (canvasElement: HTMLCanvasElement) => {
    // canvasRef 업데이트
    canvasRef.current = canvasElement;

    if (!file || !canvasElement) return;

    // 기존 캔버스가 있으면 제거
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    // 새 캔버스 생성
    fabricCanvasRef.current = new fabric.Canvas(canvasElement, {
      width: FABRIC_CANVAS_WIDTH,
      height: FABRIC_CANVAS_HEIGHT,
      selection: false,
    });

    // PDF 이미지 로드 및 배경으로 설정
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
        toast.error('PDF 이미지 로딩 중 오류가 발생했습니다.');
      }
    })();
  };

  /**
   * 파일이 변경될 때 캔버스 초기화
   */
  useEffect(() => {
    if (!file || !canvasRef.current) return;

    initializeCanvas(canvasRef.current);

    // 컴포넌트가 언마운트될 때 캔버스 정리
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [file]);

  /**
   * 선택된 도장이 변경될 때 도장 이미지 처리
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) {
      return;
    }

    // 기존 도장 이미지 제거
    if (stampImageRef.current) {
      fabricCanvasRef.current.remove(stampImageRef.current);
      stampImageRef.current = null;
    }

    // 새 도장 이미지 추가
    if (selectedStamp) {
      // @ts-expect-error - fabric.js 6.x 버전의 타입 정의가 완벽하지 않아 발생하는 오류
      fabric.FabricImage.fromURL(selectedStamp.src, function (img) {
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
        fabricCanvasRef.current!.requestRenderAll();

        toast.success('도장이 캔버스에 추가되었습니다. 드래그하여 위치를 조정할 수 있습니다.');
      });
    }
  }, [selectedStamp]);

  return {
    isGeneratingPdf,
    downloadAsImage,
    downloadWithStamp,
    canvasRef,
    initializeCanvas,
  };
};
