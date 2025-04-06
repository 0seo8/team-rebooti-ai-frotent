import ControlPanel from '@/components/ControlPanel';
import EditorCanvas from '@/components/EditorCanvas';
import PreviewPanel from '@/components/PreviewPanel';
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
          <ControlPanel />
          <EditorCanvas />
          <PreviewPanel />
        </div>
      </div>
    </>
  );
}

export default App;
