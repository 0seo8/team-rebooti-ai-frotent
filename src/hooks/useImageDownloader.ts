import { useState } from 'react';
import { useStore } from '@/store';
import { toast } from 'sonner';

/**
 * 캔버스를 이미지로 다운로드하는 기능을 제공하는 훅
 */
export const useImageDownloader = () => {
  const { file, canvas } = useStore();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  /**
   * 캔버스를 이미지로 다운로드
   */
  const downloadAsImage = async () => {
    if (!canvas || !file) {
      toast.error('PDF가 로드되지 않았거나 캔버스가 준비되지 않았습니다.');
      return;
    }

    setIsGeneratingImage(true);

    try {
      // 캔버스를 이미지로 변환
      const dataURL = canvas.toDataURL({
        format: 'png',
        multiplier: 1,
      });

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `preview_${file.name.replace('.pdf', '')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('이미지가 다운로드되었습니다.');
    } catch (error) {
      console.error('이미지 다운로드 중 오류:', error);
      toast.error('이미지 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return {
    isGeneratingImage,
    downloadAsImage,
  };
};
