import FileUploader from '@/components/FileUploader';
import StampUploader from '@/components/StampUploader';
import * as S from './styles';

const ControlPanel = () => {
  return (
    <S.Container>
      <FileUploader />
      <StampUploader />
    </S.Container>
  );
};

export default ControlPanel;
