import { useEffect, useState, useCallback } from 'react';
import { Layout, Modal, message, Space, Button, Dropdown, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpenOutlined, SaveOutlined, CalculatorOutlined, DeleteOutlined,
} from '@ant-design/icons';
import MainMenuBar from '../components/main-menu/MainMenuBar';
import ObjectTree from '../components/sidebar/ObjectTree';
import StatusBar from '../components/common/StatusBar';
import SelectObjectModal from '../modals/SelectObjectModal';
import TrajCalcModal from '../modals/TrajCalcModal';
import SettingsModal from '../modals/SettingsModal';
import ExportModal from '../modals/ExportModal';
import SyncModal from '../modals/SyncModal';
import ImportWizardModal from '../modals/ImportWizardModal';
import FaultsModal from '../modals/FaultsModal';
import StatisticsModal from '../modals/StatisticsModal';
import SampleModal from '../modals/SampleModal';
import ParameterTypeModal from '../modals/ParameterTypeModal';
import PivControlModal from '../modals/PivControlModal';
import BatchProcessingModal from '../modals/BatchProcessingModal';
import GraphicsEditorModal from '../modals/GraphicsEditorModal';
import CalcParamsModal from '../modals/CalcParamsModal';
import TensoParamsModal from '../modals/TensoParamsModal';
import { CameraOutlined } from '@ant-design/icons';
import { useAppStore } from '../stores/useAppStore';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { mode, setMode } = useAppStore();

  const [selectObjectOpen, setSelectObjectOpen] = useState(false);
  const [trajCalcOpen, setTrajCalcOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [faultsOpen, setFaultsOpen] = useState(false);
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(false);
  const [paramTypeOpen, setParamTypeOpen] = useState(false);
  const [pivOpen, setPivOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [gfxEditorOpen, setGfxEditorOpen] = useState(false);
  const [calcParamsOpen, setCalcParamsOpen] = useState(false);
  const [tensoOpen, setTensoOpen] = useState(false);

  useEffect(() => {
    setSelectObjectOpen(true);
  }, []);

  const handleMenuClick = useCallback((key: string) => {
    switch (key) {
      case 'object-select':
        setSelectObjectOpen(true);
        break;
      case 'object-create-topic':
      case 'object-create-object':
        Modal.info({ title: key === 'object-create-topic' ? 'Создать тему' : 'Создать объект', content: `Диалог создания — макет. Имя: [поле ввода]` });
        break;
      case 'object-exit':
        Modal.confirm({ title: 'Завершить работу с СПМО «Полёт»?', onOk: () => window.close() });
        break;
      case 'traj-calc':
        setTrajCalcOpen(true);
        break;
      case 'traj-open':
        Modal.info({ title: 'Открыть файл', content: 'Выберите .trj файл для открытия. Фильтр: *.trj' });
        break;
      case 'traj-close':
        useAppStore.getState().setActiveTrajectory(null);
        message.success('Траектория закрыта');
        break;
      case 'traj-save-as':
        Modal.info({ title: 'Сохранить как', content: 'Диалог сохранения траектории. Имя файла: [ввод], формат: .trj' });
        break;
      case 'traj-save-part':
        Modal.info({ title: 'Сохранить часть траектории', content: 'Выберите интервал: от [время] до [время]. Имя файла: [ввод]' });
        break;
      case 'traj-del-part':
        Modal.info({ title: 'Удалить часть траектории', content: 'Выберите интервал для удаления: от [время] до [время]' });
        break;
      case 'traj-faults-time':
      case 'traj-faults-param':
        setFaultsOpen(true);
        break;
      case 'marker-set':
        message.info('Кликните на графике для установки маркера');
        break;
      case 'marker-del':
        message.info('Выберите маркер для удаления');
        break;
      case 'marker-del-all':
        Modal.confirm({ title: 'Удалить все маркеры?', onOk: () => message.success('Все маркеры удалены') });
        break;
      case 'sample-save':
      case 'sample-add':
        setSampleOpen(true);
        break;
      case 'db-view':
      case 'db-current':
      case 'db-editor':
        navigate('/db');
        break;
      case 'db-calc':
        Modal.info({ title: 'Расчётная БД', content: 'Просмотр расчётной базы данных' });
        break;
      case 'db-change':
        Modal.info({ title: 'Сменить БД', content: 'Выберите другую базу данных СБИ' });
        break;
      case 'db-open':
        Modal.info({ title: 'Открыть БД', content: 'Выберите файл базы данных (*.csv, *.dbf, *.db)' });
        break;
      case 'screen-create':
      case 'screen-open':
        navigate('/screen');
        break;
      case 'screen-save':
        message.success('Экран сохранён');
        break;
      case 'screen-save-as':
        Modal.info({ title: 'Сохранить экран как', content: 'Имя файла: [ввод], формат: .scr' });
        break;
      case 'screen-win-add':
        Modal.info({ title: 'Добавить рабочее окно', content: 'Тип: график / таблица / комбинированное' });
        break;
      case 'screen-win-del':
        Modal.confirm({ title: 'Удалить рабочее окно?', onOk: () => message.success('Окно удалено') });
        break;
      case 'screen-win-clear':
        Modal.confirm({ title: 'Очистить содержимое окна?', onOk: () => message.success('Окно очищено') });
        break;
      case 'screen-win-rename':
        Modal.info({ title: 'Переименовать окно', content: 'Новое имя: [поле ввода]' });
        break;
      case 'screen-win-move':
        Modal.info({ title: 'Переместить/Копировать', content: 'Выберите позицию назначения' });
        break;
      case 'screen-split':
        message.info('Рабочая область разделена на 2 экрана');
        break;
      case 'view-scales':
        message.info('Шкалы параметров: показаны');
        break;
      case 'view-values-list':
        message.info('Текущие значения: режим списка');
        break;
      case 'view-values-table':
        message.info('Текущие значения: режим таблицы');
        break;
      case 'view-values-off':
        message.info('Текущие значения: скрыты');
        break;
      case 'cursor-cross':
        message.info('Курсор: перекрестье');
        break;
      case 'cursor-cross-val':
        message.info('Курсор: перекрестье со значениями');
        break;
      case 'cursor-arrow':
        message.info('Курсор: стрелка');
        break;
      case 'cursor-vline':
        message.info('Курсор: вертикальная линия');
        break;
      case 'graph-add-func':
        Modal.info({ title: 'Добавить функцию', content: 'Выберите параметр из дерева. Поиск: [строка]' });
        break;
      case 'graph-add-val':
        Modal.info({ title: 'Добавить значение', content: 'Выберите параметр для отображения текущего значения' });
        break;
      case 'graph-limits':
        Modal.info({ title: 'Пределы функции', content: 'Min: [авто/вручную], Max: [авто/вручную]' });
        break;
      case 'graph-auto':
        Modal.info({ title: 'Автопостроение', content: 'Выберите несколько параметров. Будет применён авто-масштаб.' });
        break;
      case 'graph-axis':
        Modal.info({ title: 'Свойства шкалы оси X', content: 'Ось X: время / [выбор параметра]' });
        break;
      case 'graph-grid':
        message.info('Сетка: переключена');
        break;
      case 'graph-save':
        Modal.info({ title: 'Сохранить график', content: 'Формат: .png / .svg / .pdf / .grf' });
        break;
      case 'table-values':
        navigate('/');
        break;
      case 'table-stat':
        setStatisticsOpen(true);
        break;
      case 'proc-tasks':
        navigate('/processing');
        break;
      case 'proc-calc-params':
        setCalcParamsOpen(true);
        break;
      case 'proc-tenso':
        setTensoOpen(true);
        break;
      case 'proc-gfx-editor':
        setGfxEditorOpen(true);
        break;
      case 'import-text':
      case 'import-excel':
      case 'import-binary':
      case 'import-dirac':
        setImportOpen(true);
        break;
      case 'export-binary':
      case 'export-usm':
      case 'export-bss':
        setExportOpen(true);
        break;
      case 'sync-auto':
      case 'sync-manual':
        setSyncOpen(true);
        break;
      case 'db-param-types':
        setParamTypeOpen(true);
        break;
      case 'service-piv':
        setPivOpen(true);
        break;
      case 'service-batch':
        setBatchOpen(true);
        break;
      case 'service-settings':
        setSettingsOpen(true);
        break;
      case 'screenshot':
        message.success('Снимок экрана сохранён: screenshot_2026-06-18.png');
        break;
      case 'help-f1':
        Modal.info({ title: 'Справка', content: 'СПМО «Полёт» версия 5. Руководство оператора. Раздел: справка по программе.' });
        break;
      case 'help-about':
        Modal.info({ title: 'О программе', content: 'СПМО «Полёт» версия 5. Прототип UI. Разработка: НИЦ «Полёт».' });
        break;
      default:
        message.info(`Команда: ${key}`);
    }
  }, [navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        Modal.info({ title: 'Открыть файл', content: 'Ctrl+O: выберите .trj файл' });
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        message.success('Сохранено (Ctrl+S)');
      } else if (e.key === 'F5') {
        e.preventDefault();
        setTrajCalcOpen(true);
      } else if (e.key === 'Delete') {
        Modal.confirm({ title: 'Удалить выделенный объект?', onOk: () => message.success('Объект удалён') });
      } else if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        Modal.confirm({ title: 'Завершить работу?', onOk: () => window.close() });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isFlight = mode === 'flight';
  const bgColor = isFlight ? '#1a1a2e' : '#f5f5f5';
  const textColor = isFlight ? '#e0e0e0' : '#000000';

  document.documentElement.style.setProperty('--bg', bgColor);
  document.documentElement.style.setProperty('--text', textColor);

  const toolbarStyle: React.CSSProperties = {
    background: isFlight ? '#0d1b3e' : '#fff',
    borderBottom: `1px solid ${isFlight ? '#1a3a6a' : '#d9d9d9'}`,
    padding: '4px 12px',
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  };

  const ctxMenuItems = [
    { key: 'marker-set', label: 'Установить маркер' },
    { key: 'graph-add-func', label: 'Добавить функцию' },
    { type: 'divider' as const },
    { key: 'table-stat', label: 'Статистика' },
    { key: 'traj-faults-time', label: 'Сбои времени' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: bgColor, color: textColor }}>
      <Header style={{
        background: isFlight ? '#0f3460' : '#1a1a2e',
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
        <Space>
          <Tooltip title="Ctrl+O">
            <Button type="text" icon={<FolderOpenOutlined />} style={{ color: '#fff' }} onClick={() => Modal.info({ title: 'Открыть', content: 'Выберите .trj файл' })} />
          </Tooltip>
          <Tooltip title="Ctrl+S">
            <Button type="text" icon={<SaveOutlined />} style={{ color: '#fff' }} onClick={() => message.success('Сохранено')} />
          </Tooltip>
          <Tooltip title="F5 — расчёт">
            <Button type="text" icon={<CalculatorOutlined />} style={{ color: '#fff' }} onClick={() => setTrajCalcOpen(true)} />
          </Tooltip>
          <button
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', marginLeft: 8 }}
            onClick={() => {
              Modal.confirm({
                title: `Переключиться в режим «${isFlight ? 'Анализ' : 'Полёт'}»?`,
                onOk: () => setMode(isFlight ? 'analysis' : 'flight'),
              });
            }}
          >
            Переключить режим
          </button>
        </Space>
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
        <Content style={{ padding: 0, background: bgColor, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <MainMenuBar onMenuClick={handleMenuClick} />
          <div style={toolbarStyle}>
            <Tooltip title="Открыть (Ctrl+O)"><Button size="small" icon={<FolderOpenOutlined />} onClick={() => Modal.info({ title: 'Открыть', content: 'Выберите .trj файл' })} /></Tooltip>
            <Tooltip title="Сохранить (Ctrl+S)"><Button size="small" icon={<SaveOutlined />} onClick={() => message.success('Сохранено')} /></Tooltip>
            <Tooltip title="Рассчитать (F5)"><Button size="small" icon={<CalculatorOutlined />} onClick={() => setTrajCalcOpen(true)} /></Tooltip>
            <Tooltip title="Удалить (Del)"><Button size="small" icon={<DeleteOutlined />} onClick={() => Modal.confirm({ title: 'Удалить?', onOk: () => message.success('Удалено') })} /></Tooltip>
            <div style={{ flex: 1 }} />
            <Tooltip title="Снимок экрана"><Button size="small" icon={<CameraOutlined />} onClick={() => message.success('Снимок экрана: screenshot_2026-06-18.png')} /></Tooltip>
          </div>
          <div
            style={{ flex: 1, padding: 16 }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            <Dropdown menu={{ items: ctxMenuItems, onClick: ({ key }) => handleMenuClick(key) }} trigger={['contextMenu']}>
              <div style={{ minHeight: '100%' }}>
                {children}
              </div>
            </Dropdown>
          </div>
        </Content>
      </Layout>
      <StatusBar />

      <SelectObjectModal open={selectObjectOpen} onClose={() => setSelectObjectOpen(false)} />
      <TrajCalcModal open={trajCalcOpen} onClose={() => setTrajCalcOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <SyncModal open={syncOpen} onClose={() => setSyncOpen(false)} />
      <ImportWizardModal open={importOpen} onClose={() => setImportOpen(false)} />
      <FaultsModal open={faultsOpen} onClose={() => setFaultsOpen(false)} />
      <StatisticsModal open={statisticsOpen} onClose={() => setStatisticsOpen(false)} />
      <SampleModal open={sampleOpen} onClose={() => setSampleOpen(false)} />
      <ParameterTypeModal open={paramTypeOpen} onClose={() => setParamTypeOpen(false)} />
      <PivControlModal open={pivOpen} onClose={() => setPivOpen(false)} />
      <BatchProcessingModal open={batchOpen} onClose={() => setBatchOpen(false)} />
      <GraphicsEditorModal open={gfxEditorOpen} onClose={() => setGfxEditorOpen(false)} />
      <CalcParamsModal open={calcParamsOpen} onClose={() => setCalcParamsOpen(false)} />
      <TensoParamsModal open={tensoOpen} onClose={() => setTensoOpen(false)} />
    </Layout>
  );
}
