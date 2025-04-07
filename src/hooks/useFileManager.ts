import { useRef, useState } from 'react';
import { useStore } from '@/store';
import { useFileValidation } from '@/hooks/useFileValidation';
import { pdfFileSchema } from '@/utils/validations';
import { toast } from 'sonner';

export const useFileManager = () => {
  const { file, setFile, canvas, stampObject, setStampObject, clearAllPageStamps } = useStore();
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isLoading: isPdfLoading, validateFile: validatePdfFile } =
    useFileValidation(pdfFileSchema);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const isValid = validatePdfFile(selectedFile);
      if (isValid) {
        setFile(selectedFile);
        toast.success('PDF 파일이 업로드되었습니다.');
      }
    }
    e.target.value = '';
  };

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.renderAll();
    }
    if (stampObject) {
      setStampObject(null);
    }
    clearAllPageStamps();
  };

  const handlePDFRemove = () => {
    if (showConfirm) {
      setFile(null);
      clearCanvas();
      setShowConfirm(false);
      toast.info('PDF 파일이 삭제되었습니다.');
    } else {
      setShowConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return {
    file,
    pdfInputRef,
    isPdfLoading,
    showConfirm,
    handlePDFChange,
    handlePDFUpload,
    handlePDFRemove,
    handleCancelDelete,
    setShowConfirm,
  };
};
