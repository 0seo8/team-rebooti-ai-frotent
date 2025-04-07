import * as S from './styles';
import { useStampAdder } from '@/hooks/useStampAdder';
import { useStampManager } from '@/hooks/useStampManager';
import { MAX_STAMP_COUNT } from '@/utils/validations';
import { toast } from 'sonner';

const StampUploader = () => {
  const {
    stamps,
    selectedStamp,
    isStampLoading,
    stampInputRef,
    handleStampChange,
    handleStampUpload,
    handleStampRemove,
    handleStampSelect,
    isMaxStampsReached,
    file,
  } = useStampManager();

  const { focusActiveStamp } = useStampAdder();

  const handleStampDraw = () => {
    if (!file) {
      toast.error('PDF 파일을 먼저 업로드해주세요.');
      return;
    }

    if (!selectedStamp) {
      toast.error('도장을 먼저 선택해주세요.');
      return;
    }

    const success = focusActiveStamp();

    if (!success) {
      toast.info('도장 설정 중입니다. 다시 한번 "도장 찍기" 버튼을 클릭해보세요.');
    }
  };

  return (
    <S.Container>
      <S.ContentArea>
        <S.Title>도장 관리</S.Title>
        <div>
          <input
            ref={stampInputRef}
            type="file"
            accept=".png"
            onChange={handleStampChange}
            style={{ display: 'none' }}
          />
          <S.UploadButton
            type="button"
            onClick={handleStampUpload}
            disabled={isStampLoading || isMaxStampsReached}
          >
            {isStampLoading ? '로딩 중...' : '도장 업로드'}
          </S.UploadButton>

          {isMaxStampsReached && (
            <S.LimitMessage>
              도장은 최대 {MAX_STAMP_COUNT}개까지만 업로드할 수 있습니다.
            </S.LimitMessage>
          )}
        </div>

        {stamps.length > 0 ? (
          <S.StampsContainer>
            {stamps.map((stamp) => (
              <S.StampItem
                key={stamp.id}
                className={selectedStamp?.id === stamp.id ? 'selected' : ''}
              >
                <S.StampImage
                  src={stamp.src}
                  alt={stamp.name}
                  onClick={() => handleStampSelect(stamp)}
                />
                <S.RemoveButton type="button" onClick={() => handleStampRemove(stamp.id)}>
                  ×
                </S.RemoveButton>
              </S.StampItem>
            ))}
          </S.StampsContainer>
        ) : (
          <S.EmptyMessage>업로드된 도장이 없습니다.</S.EmptyMessage>
        )}
      </S.ContentArea>

      <S.ApplyStampButton
        type="button"
        onClick={handleStampDraw}
        disabled={!file || !selectedStamp}
      >
        도장 찍기
      </S.ApplyStampButton>
    </S.Container>
  );
};

export default StampUploader;
