import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/store';
import * as S from './styles';
import { getPageImageByFile, getPdfPageCount } from '@/utils/pdf';

interface PageImage {
  url: string;
  pageNumber: number;
  hasStamp: boolean; // 도장 적용 여부 추적
}

const PDFPreview = () => {
  const { file, currentPage, totalPages, setCurrentPage, setTotalPages, pageStamps } = useStore();
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 파일이 변경되면 초기화 및 총 페이지 수 가져오기
  useEffect(() => {
    if (!file) {
      setPageImages([]);
      setCurrentPage(1);
      setTotalPages(0);
      return;
    }

    const initializePdfPreview = async () => {
      setIsLoading(true);
      try {
        // PDF 페이지 수 가져오기
        const numPages = await getPdfPageCount(file);
        setTotalPages(numPages);

        // 첫 페이지 이미지 로드
        await loadPageImage(1);
      } catch (error) {
        console.error('PDF 미리보기 초기화 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePdfPreview();
  }, [file, setCurrentPage, setTotalPages]);

  // 페이지 이미지 로드 함수
  const loadPageImage = useCallback(
    async (pageNumber: number) => {
      if (!file) return;

      try {
        // 이미 로드된 페이지인지 확인 및 도장 적용 여부 확인
        const currentPageHasStamp = pageStamps.some((stamp) => stamp.pageNumber === pageNumber);
        const existingPageIndex = pageImages.findIndex((image) => image.pageNumber === pageNumber);

        // 이미 로드된 페이지이고 도장 상태가 변경되지 않았다면 다시 로드하지 않음
        if (existingPageIndex >= 0) {
          const existingImage = pageImages[existingPageIndex];
          if (existingImage.hasStamp === currentPageHasStamp) {
            return;
          }
          // 도장 상태가 변경되었다면 해당 페이지만 업데이트
          setPageImages((prev) => prev.filter((img) => img.pageNumber !== pageNumber));
        }

        // 이미지 로드
        const image = await getPageImageByFile(file, pageNumber);
        if (image) {
          setPageImages((prev) => [
            ...prev.filter((img) => img.pageNumber !== pageNumber),
            { url: image, pageNumber, hasStamp: currentPageHasStamp },
          ]);
        }
      } catch (error) {
        console.error(`페이지 ${pageNumber} 이미지 로드 중 오류:`, error);
      }
    },
    [file, pageImages, pageStamps],
  );

  // 페이지 또는 도장 정보가 변경될 때 현재 페이지 이미지 업데이트
  useEffect(() => {
    if (!file || currentPage <= 0 || currentPage > totalPages) return;

    // 현재 페이지 로드
    loadPageImage(currentPage);

    // 다음 페이지 미리 로드 (성능 최적화)
    if (currentPage < totalPages) {
      loadPageImage(currentPage + 1);
    }

    // 이전 페이지도 미리 로드
    if (currentPage > 1) {
      loadPageImage(currentPage - 1);
    }
  }, [currentPage, file, totalPages, loadPageImage, pageStamps]);

  // 페이지 이동 함수
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // 현재 페이지 이미지 찾기
  const currentPageImage = pageImages.find((image) => image.pageNumber === currentPage);
  // 현재 페이지에 도장이 적용되었는지 확인
  const hasStamp = pageStamps.some((stamp) => stamp.pageNumber === currentPage);

  return (
    <S.Container>
      <S.PreviewSection>
        {isLoading && <S.LoadingMessage>PDF 로딩 중...</S.LoadingMessage>}

        {!isLoading && !currentPageImage && <S.LoadingMessage>페이지 로딩 중...</S.LoadingMessage>}

        {currentPageImage && (
          <S.PageContainer>
            <S.PageImage>
              <img
                src={currentPageImage.url}
                alt={`PDF 미리보기 - 페이지 ${currentPage}`}
                key={`page-${currentPage}-${currentPageImage.hasStamp ? 'stamped' : 'normal'}`}
              />
            </S.PageImage>
            <S.PageIndex>
              {currentPage}
              {hasStamp && ' (도장 적용됨)'}
            </S.PageIndex>
          </S.PageContainer>
        )}

        {totalPages > 0 && (
          <S.PageNavigation>
            <S.PageButton onClick={goToPrevPage} disabled={currentPage <= 1 || isLoading}>
              이전
            </S.PageButton>

            <S.PageStatus>
              {currentPage} / {totalPages}
            </S.PageStatus>

            <S.PageButton onClick={goToNextPage} disabled={currentPage >= totalPages || isLoading}>
              다음
            </S.PageButton>
          </S.PageNavigation>
        )}
      </S.PreviewSection>
    </S.Container>
  );
};

export default PDFPreview;
