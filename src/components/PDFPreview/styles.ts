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
