import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex: 1;
  min-height: 300px;
  justify-content: space-between;
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
`;

export const UploadButton = styled.button`
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

export const StampsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

export const StampItem = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;

  &.selected {
    border: 2px solid #3498db;
  }
`;

export const StampImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ApplyStampButton = styled.button`
  background-color: #666;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyMessage = styled.p`
  color: #666;
  font-style: italic;
  margin-top: 10px;
`;

export const LimitMessage = styled.p`
  color: #f39c12;
  font-size: 12px;
  margin-top: 5px;
`;
