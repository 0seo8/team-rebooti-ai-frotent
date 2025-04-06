import FileUploader from '@/components/FileUploader';
import PDFCanvas from '@/components/PDFCanvas';
import PDFPreview from '@/components/PDFPreview';
import GlobalStyle from '@/styles/global';
import './App.css';
import { Toaster } from 'sonner';
function App() {
  return (
    <>
      <GlobalStyle />
      <Toaster position="bottom-center" duration={2000} richColors />
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
