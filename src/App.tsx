import FileUploader from '@/components/FileUploader';
import PDFCanvas from '@/components/PDFCanvas';
import PDFPreview from '@/components/PDFPreview';
import GlobalStyle from '@/styles/global';
import './App.css';

function App() {
  return (
    <>
      <GlobalStyle />
      <div id="app">
        <div>
          <FileUploader />
          <PDFCanvas />
          <PDFPreview />
        </div>
      </div>
    </>
  );
}

export default App;
