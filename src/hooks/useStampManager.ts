import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore, Stamp } from '@/store';
import { useFileValidation } from '@/hooks/useFileValidation';
import { stampFileSchema, validateStampCount, MAX_STAMP_COUNT } from '@/utils/validations';
import { toast } from 'sonner';

/**
 * 도장 이미지 관리를 위한 훅
 */
export const useStampManager = () => {
  const { stamps, addStamp, removeStamp, selectedStamp, selectStamp, file } = useStore();
  const stampInputRef = useRef<HTMLInputElement>(null);

  // 도장 이미지 유효성 검사 훅
  const { isLoading: isStampLoading, validateFile: validateStampFile } =
    useFileValidation(stampFileSchema);

  /**
   * 도장 파일 변경 처리
   */
  const handleStampChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      try {
        // 1. 파일 유효성 검사 수행
        const isFileValid = validateStampFile(selectedFile);

        // 2. 도장 개수 제한 검사 수행
        const countSchema = validateStampCount(stamps.length);
        const isCountValid = countSchema.safeParse(true);

        if (!isCountValid.success) {
          toast.error(isCountValid.error.errors[0].message);
          e.target.value = '';
          return;
        }

        // 파일과 개수 모두 유효한 경우
        if (isFileValid) {
          // 파일을 Base64로 변환
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              const newStamp: Stamp = {
                id: uuidv4(),
                src: event.target.result as string,
                name: selectedFile.name,
              };

              // 스토어에 도장 추가 및 선택 상태로 설정
              addStamp(newStamp);
              selectStamp(newStamp);

              toast.success('도장 이미지가 추가되고 선택되었습니다.');
            }
          };
          reader.readAsDataURL(selectedFile);
        }
      } catch (error) {
        console.error('도장 이미지 처리 중 오류:', error);
        toast.error('도장 이미지 처리 중 오류가 발생했습니다.');
      }
    }

    // 입력 필드 초기화
    e.target.value = '';
  };

  /**
   * 도장 업로드 버튼 클릭 처리
   */
  const handleStampUpload = () => {
    stampInputRef.current?.click();
  };

  /**
   * 도장 삭제 처리
   */
  const handleStampRemove = (stampId: string) => {
    removeStamp(stampId);
    toast.info('도장 이미지가 삭제되었습니다.');
  };

  /**
   * 도장 선택 처리
   */
  const handleStampSelect = (stamp: Stamp) => {
    // 이미 선택된 도장을 다시 클릭하면 선택 해제
    if (selectedStamp?.id === stamp.id) {
      selectStamp(null);
      toast.info('도장 선택이 해제되었습니다.');
    } else {
      selectStamp(stamp);
      toast.info(`도장 "${stamp.name}"이(가) 선택되었습니다.`);
    }
  };

  return {
    stamps,
    selectedStamp,
    isStampLoading,
    stampInputRef,
    handleStampChange,
    handleStampUpload,
    handleStampRemove,
    handleStampSelect,
    isMaxStampsReached: stamps.length >= MAX_STAMP_COUNT,
    file,
  };
};
