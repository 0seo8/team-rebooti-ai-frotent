import { useState } from 'react';
import { z, ZodError } from 'zod';
import { toast } from 'sonner';

/**
 * 파일 유효성 검사 훅
 * @param schema 유효성 검사에 사용할 Zod 스키마
 * @returns 유효성 검사 관련 상태와 함수들
 */
export const useFileValidation = <T extends z.ZodType>(schema: T) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 파일 유효성 검사 함수
   * @param file 검사할 파일
   * @returns 유효성 검사 통과 시 true, 실패 시 false
   */
  const validateFile = (file: File | null): boolean => {
    try {
      setIsLoading(true);

      // 파일이 없는 경우는 유효하다고 처리
      if (file === null) return true;

      schema.parse(file);
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessage = err.errors[0]?.message || '파일 유효성 검사에 실패했습니다.';

        toast.error(errorMessage);
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    validateFile,
  };
};
