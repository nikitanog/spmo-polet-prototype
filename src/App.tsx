import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import MainLayout from './layouts/MainLayout';
import { useAppStore } from './stores/useAppStore';

function Home() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Добро пожаловать в СПМО «Полёт» версия 5</h2>
      <p style={{ color: '#888' }}>Выберите объект и откройте траекторию для начала работы</p>
    </div>
  );
}

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
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}
