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
        const numPages = await getPdfPageCount(file);
        setTotalPages(numPages);

        await loadPageImage(1);
      } catch (error) {
        console.error('PDF 미리보기 초기화 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePdfPreview();
  }, [file, setCurrentPage, setTotalPages]);

  const loadPageImage = useCallback(
    async (pageNumber: number) => {
      if (!file) return;

      try {
        const currentPageHasStamp = pageStamps.some((stamp) => stamp.pageNumber === pageNumber);
        const existingPageIndex = pageImages.findIndex((image) => image.pageNumber === pageNumber);

        if (existingPageIndex >= 0) {
          const existingImage = pageImages[existingPageIndex];
          if (existingImage.hasStamp === currentPageHasStamp) {
            return;
          }
          setPageImages((prev) => prev.filter((img) => img.pageNumber !== pageNumber));
        }

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

  useEffect(() => {
    if (!file || currentPage <= 0 || currentPage > totalPages) return;

    loadPageImage(currentPage);

    if (currentPage < totalPages) {
      loadPageImage(currentPage + 1);
    }

    if (currentPage > 1) {
      loadPageImage(currentPage - 1);
    }
  }, [currentPage, file, totalPages, loadPageImage, pageStamps]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const currentPageImage = pageImages.find((image) => image.pageNumber === currentPage);
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
