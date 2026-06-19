import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import MainLayout from './layouts/MainLayout';
import WorkspacePage from './components/screens/WorkspacePage';
import DatabasePage from './components/database/DatabasePage';
import DbEditorPage from './components/database/DbEditorPage';
import ScreenPage from './components/screens/ScreenPage';
import ScreenManagerPage from './components/screens/ScreenManagerPage';
import ProcessingPage from './components/processing/ProcessingPage';
import HelpPage from './components/help/HelpPage';
import { useAppStore } from './stores/useAppStore';

export default function App() {
  const mode = useAppStore((s) => s.mode);
  const isFlight = mode === 'flight';

  return (
    <ConfigProvider
      theme={{
        algorithm: isFlight ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: isFlight ? '#52c41a' : '#1677ff',
          borderRadius: 4,
        },
      }}
    >
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<WorkspacePage />} />
            <Route path="/db" element={<DatabasePage />} />
            <Route path="/db-editor" element={<DbEditorPage />} />
            <Route path="/screen" element={<ScreenPage />} />
            <Route path="/screens" element={<ScreenManagerPage />} />
            <Route path="/processing" element={<ProcessingPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}
