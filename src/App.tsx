import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import MainLayout from './layouts/MainLayout';
import WorkspacePage from './components/screens/WorkspacePage';
import DatabasePage from './components/database/DatabasePage';
import ScreenPage from './components/screens/ScreenPage';
import ProcessingPage from './components/processing/ProcessingPage';
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
            <Route path="/screen" element={<ScreenPage />} />
            <Route path="/processing" element={<ProcessingPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}
