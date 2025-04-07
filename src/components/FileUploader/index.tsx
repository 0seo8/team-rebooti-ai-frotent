import * as S from './styles';
import { useFileManager } from '@/hooks/useFileManager';

const FileUploader = () => {
  const {
    file,
    pdfInputRef,
    isPdfLoading,
    showConfirm,
    handlePDFChange,
    handlePDFUpload,
    handlePDFRemove,
    handleCancelDelete,
    setShowConfirm,
  } = useFileManager();

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
          <>
            <S.PdfFileInfo>
              📄 파일명: <strong>{file.name}</strong>
              <S.RemoveButton type="button" onClick={() => setShowConfirm(true)}>
                X
              </S.RemoveButton>
            </S.PdfFileInfo>

            {showConfirm ? (
              <S.ButtonGroup>
                <S.DeleteButton type="button" onClick={handlePDFRemove}>
                  삭제 확인
                </S.DeleteButton>
                <S.UploadButton type="button" onClick={handleCancelDelete}>
                  취소
                </S.UploadButton>
              </S.ButtonGroup>
            ) : (
              <S.ButtonGroup>
                <S.DeleteButton type="button" onClick={() => setShowConfirm(true)}>
                  PDF 파일 삭제
                </S.DeleteButton>
              </S.ButtonGroup>
            )}
          </>
        )}
      </S.SectionItem>
    </S.Container>
  );
};

export default FileUploader;
