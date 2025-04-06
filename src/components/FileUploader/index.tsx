import { useRef } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import { useFileValidation } from '@/hooks/useFileValidation';
import { pdfFileSchema } from '@/utils/validations';
import { toast } from 'sonner';

const FileUploader = () => {
  const { file, setFile } = useStore();
  const pdfInputRef = useRef<HTMLInputElement>(null);

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

  const handlePDFRemove = () => {
    setFile(null);
    toast.info('PDF 파일이 삭제되었습니다.');
  };

  return (
    <S.Container>
      <S.SectionItem>
        <div>
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            onChange={handlePDFChange}
            style={{ display: 'none' }}
          />

          <S.UploadButton type="button" onClick={handlePDFUpload} disabled={isPdfLoading}>
            {isPdfLoading ? '로딩 중...' : 'PDF 업로드'}
          </S.UploadButton>
        </div>

        {file?.name && (
          <S.PdfFileInfo>
            📄 파일명: <strong>{file.name}</strong>
            <S.RemoveButton type="button" onClick={handlePDFRemove}>
              X
            </S.RemoveButton>
          </S.PdfFileInfo>
        )}
      </S.SectionItem>
    </S.Container>
  );
};

export default FileUploader;
