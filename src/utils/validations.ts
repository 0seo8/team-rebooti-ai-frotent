import { z } from 'zod';

// 파일 크기 제한: PDF는 10MB, 이미지는 2MB
export const MAX_PDF_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_STAMP_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// 허용된 파일 타입
export const ALLOWED_PDF_TYPE = 'application/pdf';
export const ALLOWED_STAMP_TYPES = ['image/png'];

/**
 * PDF 파일 유효성 검사 스키마
 */
export const pdfFileSchema = z
  .instanceof(File)
  .nullable()
  .refine((file) => file === null || file.size <= MAX_PDF_FILE_SIZE, {
    message: `PDF 파일 크기가 최대 한도인 ${MAX_PDF_FILE_SIZE / (1024 * 1024)}MB를 초과했습니다.`,
  })
  .refine((file) => file === null || file.type === ALLOWED_PDF_TYPE, {
    message: 'PDF 형식의 파일만 업로드 가능합니다.',
  });

/**
 * 도장 이미지 파일 유효성 검사 스키마
 */
export const stampFileSchema = z
  .instanceof(File)
  .nullable()
  .refine((file) => file === null || file.size <= MAX_STAMP_FILE_SIZE, {
    message: `이미지 파일 크기가 최대 한도인 ${MAX_STAMP_FILE_SIZE / (1024 * 1024)}MB를 초과했습니다.`,
  })
  .refine((file) => file === null || ALLOWED_STAMP_TYPES.includes(file.type), {
    message: 'PNG 형식의 이미지 파일만 업로드 가능합니다.',
  });
