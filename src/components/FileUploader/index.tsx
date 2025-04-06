import { useRef } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import Stamp1 from '@/assets/samples/stamp-1.jpg';

const FileUploader = () => {
  const { file, setFile } = useStore();

  const stampInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
    e.target.value = '';
  };

  const handleStampUpload = () => {
    stampInputRef.current?.click();
  };

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  const handlePDFRemove = () => {
    setFile(null);
  };

  const handleStampDraw = async () => {
    // 도장 찍기 기능 구현 예정
  };

  return (
    <S.Container>
      <S.TopSection>
        <S.SectionItem>
          <div>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePDFChange}
              style={{ display: 'none' }}
            />

            <S.UploadButton type="button" onClick={handlePDFUpload}>
              PDF 업로드
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

        <S.SectionItem>
          <div>
            <input
              ref={stampInputRef}
              type="file"
              accept=".png"
              onChange={() => {}}
              style={{ display: 'none' }}
            />
            <S.UploadButton type="button" onClick={handleStampUpload}>
              도장 업로드
            </S.UploadButton>
          </div>

          <S.StampsContainer>
            <img src={Stamp1} alt="도장 이미지" />
          </S.StampsContainer>
        </S.SectionItem>
      </S.TopSection>

      <S.BottomSection>
        <S.ApplyStampButton type="button" onClick={handleStampDraw}>
          도장 찍기
        </S.ApplyStampButton>
      </S.BottomSection>
    </S.Container>
  );
};

export default FileUploader;
