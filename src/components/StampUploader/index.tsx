import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore, Stamp } from '@/store';
import { useFileValidation } from '@/hooks/useFileValidation';
import { stampFileSchema, validateStampCount, MAX_STAMP_COUNT } from '@/utils/validations';
import { toast } from 'sonner';
import * as S from './styles';

const StampUploader = () => {
  const { stamps, addStamp, removeStamp, selectedStamp, selectStamp, file } = useStore();
  const stampInputRef = useRef<HTMLInputElement>(null);

  const { isLoading: isStampLoading, validateFile: validateStampFile } =
    useFileValidation(stampFileSchema);

  useEffect(() => {
    console.log('file', file);
  }, [file]);

  useEffect(() => {
    console.log('selectedStamp', selectedStamp);
  }, [selectedStamp]);

  const handleStampChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      try {
        const isFileValid = validateStampFile(selectedFile);

        const countSchema = validateStampCount(stamps.length);
        const isCountValid = countSchema.safeParse(true);

        if (!isCountValid.success) {
          toast.error(isCountValid.error.errors[0].message);
          e.target.value = '';
          return;
        }

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

              addStamp(newStamp);
              toast.success('도장 이미지가 추가되었습니다.');
              console.log('도장 이미지 추가됨:', newStamp);
              // 업로드 후 자동으로 선택
              selectStamp(newStamp);
            }
          };
          reader.readAsDataURL(selectedFile);
        }
      } catch (error) {
        console.error('도장 이미지 처리 중 오류:', error);
        toast.error('도장 이미지 처리 중 오류가 발생했습니다.');
      }
    }

    e.target.value = '';
  };

  const handleStampUpload = () => {
    stampInputRef.current?.click();
  };

  const handleStampRemove = (stampId: string) => {
    removeStamp(stampId);
    toast.info('도장 이미지가 삭제되었습니다.');
  };

  const handleStampSelect = (stamp: Stamp) => {
    // 이미 선택된 도장을 다시 클릭하면 선택 해제
    if (selectedStamp?.id === stamp.id) {
      selectStamp(null);
    } else {
      selectStamp(stamp);
      toast.info(`도장 "${stamp.name}"이(가) 선택되었습니다.`);
    }
  };

  const handleStampDraw = () => {
    if (!file) {
      toast.error('PDF 파일을 먼저 업로드해주세요.');
      return;
    }

    if (!selectedStamp) {
      toast.error('도장을 먼저 선택해주세요.');
      return;
    }

    // 도장 찍기 기능 구현 예정
    toast.info('도장 찍기는 아직 구현되지 않았습니다.');
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
            disabled={isStampLoading || stamps.length >= MAX_STAMP_COUNT}
          >
            {isStampLoading ? '로딩 중...' : '도장 업로드'}
          </S.UploadButton>

          {stamps.length >= MAX_STAMP_COUNT && (
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
