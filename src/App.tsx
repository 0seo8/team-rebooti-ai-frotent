import FileUploader from '@/components/FileUploader';
import StampUploader from '@/components/StampUploader';
import PDFCanvas from '@/components/PDFCanvas';
import PDFPreview from '@/components/PDFPreview';
import GlobalStyle from '@/styles/global';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <>
      <GlobalStyle />
      <Toaster position="bottom-center" duration={2000} richColors />
      <div id="app">
        <div>
          <div className="left-section">
            <FileUploader />
            <StampUploader />
          </div>
          <div>
            <PDFCanvas />
          </div>
          <div>
            <PDFPreview />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
