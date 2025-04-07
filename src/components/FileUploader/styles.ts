import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SectionItem = styled.div``;

export const PdfFileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
`;

export const RemoveButton = styled.button`
  margin-left: 10px;
  background-color: #ff4d4f;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
  padding: 4px 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff7875;
  }
`;

export const UploadButton = styled.button`
  background-color: #666;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #888;
  }
`;

export const StampsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    cursor: pointer;
  }
`;

export const BottomSection = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
`;

export const ApplyStampButton = styled.button`
  background-color: #666;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const DeleteButton = styled.button`
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff7875;
  }
`;
