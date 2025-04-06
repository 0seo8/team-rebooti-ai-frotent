import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  canvas {
    max-width: 100%;
    max-height: 100%;
  }
`;

export const DownloadButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #666;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
`;
