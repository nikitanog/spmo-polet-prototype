import { useState } from 'react';
import { Layout, Modal, message } from 'antd';
import MainMenuBar from '../components/main-menu/MainMenuBar';
import ObjectTree from '../components/sidebar/ObjectTree';
import StatusBar from '../components/common/StatusBar';
import { useAppStore } from '../stores/useAppStore';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { mode, setMode } = useAppStore();

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'object-exit':
        Modal.confirm({ title: 'Завершить работу с СПМО «Полёт»?', onOk: () => window.close() });
        break;
      case 'traj-calc':
        Modal.info({ title: 'Расчёт траектории', content: 'Выберите БД и файл с данными' });
        break;
      case 'traj-open':
        message.info('Выберите .trj файл для открытия');
        break;
      case 'screen-create':
        message.info('Создать новый экран');
        break;
      case 'graph-add-func':
        message.info('Добавить функцию на график');
        break;
      case 'table-values':
        message.info('Открыть таблицу значений параметров');
        break;
      case 'proc-tasks':
        message.info('Открыть список задач вторичной обработки');
        break;
      case 'service-settings':
        message.info('Открыть настройки');
        break;
      case 'help-about':
        Modal.info({ title: 'О программе', content: 'СПМО «Полёт» версия 5. Прототип UI.' });
        break;
      case 'traj-faults-time':
        message.info('Анализ сбоев времени ТН');
        break;
      case 'traj-faults-param':
        message.info('Поиск сбоев заданного параметра');
        break;
      default:
        if (key.startsWith('import-') || key.startsWith('export-') || key.startsWith('sync-')) {
          message.info(`Открыть: ${key.replace(/-/g, ' ')}`);
        } else {
          message.info(`Команда: ${key}`);
        }
    }
  };

  const isFlight = mode === 'flight';
  const bgColor = isFlight ? '#1a1a2e' : '#ffffff';
  const textColor = isFlight ? '#e0e0e0' : '#000000';

  document.documentElement.style.setProperty('--bg', bgColor);
  document.documentElement.style.setProperty('--text', textColor);

  return (
    <Layout style={{ minHeight: '100vh', background: bgColor, color: textColor }}>
      <Header style={{
        background: isFlight ? '#0f3460' : '#1677ff',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
      }}>
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          СПМО «ПОЛЁТ» v5
          <span style={{
            marginLeft: 12,
            fontSize: 11,
            background: isFlight ? '#52c41a' : '#1677ff',
            padding: '2px 8px',
            borderRadius: 4,
            color: '#fff',
            fontWeight: 600,
          }}>
            {isFlight ? 'ПОЛЁТ' : 'АНАЛИЗ'}
          </span>
        </div>
        <div>
          <button
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}
            onClick={() => {
              Modal.confirm({
                title: `Переключиться в режим «${isFlight ? 'Анализ' : 'Полёт'}»?`,
                onOk: () => setMode(isFlight ? 'analysis' : 'flight'),
              });
            }}
          >
            Переключить режим
          </button>
        </div>
      </Header>
      <Layout>
        <Sider
          width={220}
          collapsed={collapsed}
          collapsible
          onCollapse={setCollapsed}
          style={{ background: isFlight ? '#16213e' : '#fafafa', borderRight: '1px solid #d9d9d9' }}
        >
          <ObjectTree />
        </Sider>
        <Content style={{ padding: 16, background: bgColor, overflow: 'auto' }}>
          <MainMenuBar onMenuClick={handleMenuClick} />
          <div style={{ marginTop: 12 }}>
            {children}
          </div>
        </Content>
      </Layout>
      <StatusBar />
    </Layout>
  );
}
