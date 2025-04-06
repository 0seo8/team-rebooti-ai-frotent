import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  padding: 8px;
`;

export const RemoveButton = styled.button`
  margin-left: 10px;
  background-color: transparent;
  border: none;
  color: #ff0000;
  cursor: pointer;
  font-weight: bold;
`;

export const UploadButton = styled.button`
  background-color: #666;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
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
