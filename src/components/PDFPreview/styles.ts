import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  padding: 20px;
`;

export const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const PageContainer = styled.div`
  position: relative;
  width: 200px;
`;

export const PageImage = styled.div`
  width: 100%;
  overflow: hidden;

  img {
    width: 100%;
    display: block;
  }
`;

export const PageIndex = styled.div`
  position: absolute;
  left: 50%;
  bottom: -20px;
  transform: translateX(-50%);
  color: #666;
  font-weight: bold;
`;

export const LoadingMessage = styled.div`
  color: #666;
  font-size: 14px;
  margin: 20px 0;
`;

export const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

export const PageButton = styled.button`
  background-color: #666;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageStatus = styled.div`
  font-size: 14px;
  color: #666;
  min-width: 50px;
  text-align: center;
`;
