import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import { getImageByFile } from '@/utils/pdf';

const PDFPreview = () => {
  const { file } = useStore();
  const [fileImage, setFileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setFileImage(null);
      return;
    }

    (async () => {
      try {
        const image = await getImageByFile(file);
        setFileImage(image || null);
      } catch (error) {
        console.error('PDF 미리보기 로딩 실패:', error);
        setFileImage(null);
      }
    })();
  }, [file]);

  return (
    <S.Container>
      <S.PreviewSection>
        {fileImage && (
          <S.PageContainer>
            <S.PageImage>
              <img src={fileImage} alt="PDF 미리보기" />
            </S.PageImage>
            <S.PageIndex>1</S.PageIndex>
          </S.PageContainer>
        )}
      </S.PreviewSection>
    </S.Container>
  );
};

export default PDFPreview;
