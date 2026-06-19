import { useEffect, useState, useCallback } from 'react';
import { Layout, Modal, message, Space, Button, Dropdown, Tooltip, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpenOutlined, SaveOutlined, CalculatorOutlined, DeleteOutlined,
  FolderOutlined, DatabaseOutlined, NodeIndexOutlined, MonitorOutlined,
  EyeOutlined, LineChartOutlined, TableOutlined, ToolOutlined,
  SettingOutlined, QuestionCircleOutlined, CameraOutlined,
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
import TrajOpenModal from '../modals/TrajOpenModal';
import TrajSavePartModal from '../modals/TrajSavePartModal';
import TrajDelPartModal from '../modals/TrajDelPartModal';
import ParameterTypeModal from '../modals/ParameterTypeModal';
import PivControlModal from '../modals/PivControlModal';
import BatchProcessingModal from '../modals/BatchProcessingModal';
import GraphicsEditorModal from '../modals/GraphicsEditorModal';
import CalcParamsModal from '../modals/CalcParamsModal';
import TensoParamsModal from '../modals/TensoParamsModal';
import CreateTopicModal from '../modals/CreateTopicModal';
import CreateObjectModal from '../modals/CreateObjectModal';
import OpenDbModal from '../modals/OpenDbModal';
import DbCompareModal from '../modals/DbCompareModal';
import DbUpdateModal from '../modals/DbUpdateModal';
import ScreenCreateModal from '../modals/ScreenCreateModal';
import ScreenSaveModal from '../modals/ScreenSaveModal';
import ScreenSplitModal from '../modals/ScreenSplitModal';
import AddFuncModal from '../modals/AddFuncModal';
import GraphLimitsModal from '../modals/GraphLimitsModal';
import GraphAutoModal from '../modals/GraphAutoModal';
import GraphAxisModal from '../modals/GraphAxisModal';
import GraphSaveModal from '../modals/GraphSaveModal';
import TableSettingsModal from '../modals/TableSettingsModal';
import TableExportModal from '../modals/TableExportModal';
import PrintPreviewModal from '../modals/PrintPreviewModal';
import TaskLoadModal from '../modals/TaskLoadModal';
import TaskSaveModal from '../modals/TaskSaveModal';
import DbExportModal from '../modals/DbExportModal';
import DbCheckModal from '../modals/DbCheckModal';
import ScreenWinAddModal from '../modals/ScreenWinAddModal';
import AddValueModal from '../modals/AddValueModal';
import { useAppStore } from '../stores/useAppStore';
import { useViewStore } from '../stores/useViewStore';
import { useScreenStore } from '../stores/useScreenStore';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const OPS_ITEMS = [
  { key: 'object-select', icon: <FolderOutlined />, label: 'Объект' },
  { key: 'db-view', icon: <DatabaseOutlined />, label: 'БД СБИ' },
  { key: 'traj-open', icon: <NodeIndexOutlined />, label: 'Траектория' },
  { key: 'screen-create', icon: <MonitorOutlined />, label: 'Экран' },
  { key: 'view-scales', icon: <EyeOutlined />, label: 'Вид' },
  { key: 'graph-add-func', icon: <LineChartOutlined />, label: 'График' },
  { key: 'table-values', icon: <TableOutlined />, label: 'Таблицы' },
  { key: 'proc-task-list', icon: <ToolOutlined />, label: 'Обработка' },
  { key: 'service-settings', icon: <SettingOutlined />, label: 'Сервис' },
  { key: 'help-f1', icon: <QuestionCircleOutlined />, label: 'Справка' },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const mode = useAppStore((s) => s.mode);
  const activeTrajectoryId = useAppStore((s) => s.activeTrajectoryId);

  const [selectObjectOpen, setSelectObjectOpen] = useState(false);
  const [trajCalcOpen, setTrajCalcOpen] = useState(false);
  const [trajOpenOpen, setTrajOpenOpen] = useState(false);
  const [trajSavePartOpen, setTrajSavePartOpen] = useState(false);
  const [trajDelPartOpen, setTrajDelPartOpen] = useState(false);
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
  const [createTopicOpen, setCreateTopicOpen] = useState(false);
  const [createObjectOpen, setCreateObjectOpen] = useState(false);
  const [openDbOpen, setOpenDbOpen] = useState(false);
  const [dbCompareOpen, setDbCompareOpen] = useState(false);
  const [dbUpdateOpen, setDbUpdateOpen] = useState(false);
  const [screenSaveOpen, setScreenSaveOpen] = useState(false);
  const [screenCreateOpen, setScreenCreateOpen] = useState(false);
  const [screenSplitOpen, setScreenSplitOpen] = useState(false);
  const [addFuncOpen, setAddFuncOpen] = useState(false);
  const [graphLimitsOpen, setGraphLimitsOpen] = useState(false);
  const [graphAutoOpen, setGraphAutoOpen] = useState(false);
  const [graphAxisOpen, setGraphAxisOpen] = useState(false);
  const [graphSaveOpen, setGraphSaveOpen] = useState(false);
  const [tableSettingsOpen, setTableSettingsOpen] = useState(false);
  const [tableExportOpen, setTableExportOpen] = useState(false);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [taskLoadOpen, setTaskLoadOpen] = useState(false);
  const [taskSaveOpen, setTaskSaveOpen] = useState(false);
  const [dbExportOpen, setDbExportOpen] = useState(false);
  const [dbCheckOpen, setDbCheckOpen] = useState(false);
  const [screenWinAddOpen, setScreenWinAddOpen] = useState(false);
  const [addValueOpen, setAddValueOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const { markerSetMode, setMarkerSetMode } = useAppStore.getState();
        if (markerSetMode !== 'off') {
          setMarkerSetMode('off');
          message.info('Режим маркеров отменён');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleMenuClick = useCallback((key: string) => {
    switch (key) {
      case 'object-select':
        setSelectObjectOpen(true);
        break;
      case 'object-create-topic':
        setCreateTopicOpen(true);
        break;
      case 'object-create-object':
        setCreateObjectOpen(true);
        break;
      case 'object-exit':
        Modal.confirm({
          title: 'Завершить работу с СПМО «Полёт»?',
          icon: null,
          content: (
            <div>
              <p>Вы действительно хотите выйти из программы?</p>
              <p style={{ fontSize: 11, color: '#888' }}>Все несохранённые данные будут потеряны.</p>
            </div>
          ),
          okText: 'Завершить',
          cancelText: 'Отмена',
          onOk: () => {
            useAppStore.getState().exitApp();
            Modal.info({
              title: 'Работа завершена',
              icon: null,
              content: (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p>Сеанс работы СПМО «Полёт» завершён.</p>
                  <p style={{ fontSize: 11, color: '#888' }}>Для выхода из приложения закройте вкладку браузера.</p>
                </div>
              ),
              okText: 'Закрыть вкладку',
              onOk: () => window.close(),
            });
          },
        });
        break;
      case 'traj-calc':
        setTrajCalcOpen(true);
        break;
      case 'traj-open':
        setTrajOpenOpen(true);
        break;
      case 'traj-close':
        useAppStore.getState().setActiveTrajectory(null);
        message.success('Траектория закрыта');
        break;
      case 'traj-save-as':
      case 'traj-save-part':
        setTrajSavePartOpen(true);
        break;
      case 'traj-del-part':
        setTrajDelPartOpen(true);
        break;
      case 'traj-faults-time':
      case 'traj-faults-param':
        setFaultsOpen(true);
        break;
      case 'marker-set':
        useAppStore.getState().setMarkerSetMode('set');
        message.info('Кликните на графике для установки маркера. Esc — отмена.');
        break;
      case 'marker-del':
        useAppStore.getState().setMarkerSetMode('del');
        message.info('Кликните по маркеру на графике для удаления. Esc — отмена.');
        break;
      case 'marker-del-all':
        Modal.confirm({ title: 'Удалить все маркеры?', onOk: () => { useAppStore.getState().clearMarkers(); message.success('Все маркеры удалены'); }});
        break;
      case 'sample-save':
      case 'sample-add':
        setSampleOpen(true);
        break;
      case 'db-view':
        navigate('/db');
        break;
      case 'db-current':
        navigate('/db?db=current');
        break;
      case 'db-editor':
        navigate('/db-editor');
        break;
      case 'db-calc':
        navigate('/db?db=calc');
        break;
      case 'db-change':
      case 'db-open':
        setOpenDbOpen(true);
        break;
      case 'screen-create':
        setScreenCreateOpen(true);
        break;
      case 'screen-open':
        navigate('/screens');
        break;
      case 'screen-save':
        message.success('Экран сохранён');
        break;
      case 'screen-save-as':
        setScreenSaveOpen(true);
        break;
      case 'screen-win-add':
        setScreenWinAddOpen(true);
        break;
      case 'screen-win-del':
        Modal.confirm({ title: 'Удалить последнее рабочее окно?', onOk: () => {
          const store = useScreenStore.getState();
          const sel = store.selectedId ? store.screens.find(s => s.id === store.selectedId) : store.screens[0];
          if (sel && sel.windows.length > 0) {
            store.removeWindow(sel.id, sel.windows[sel.windows.length - 1].id);
            message.success('Окно удалено');
          } else message.info('Нет окон для удаления');
        }});
        break;
      case 'screen-win-clear':
        Modal.confirm({ title: 'Очистить содержимое окна?', onOk: () => {
          const store = useScreenStore.getState();
          const sel = store.selectedId ? store.screens.find(s => s.id === store.selectedId) : store.screens[0];
          if (sel && sel.windows.length > 0) {
            store.updateWindowParams(sel.id, sel.windows[sel.windows.length - 1].id, []);
            message.success('Параметры окна очищены');
          } else message.info('Нет окон для очистки');
        }});
        break;
      case 'screen-win-rename': {
        let newName = '';
        Modal.confirm({
          title: 'Переименовать экран',
          icon: null,
          content: <Input placeholder="Введите новое имя экрана" onChange={(e) => { newName = e.target.value; }} />,
          onOk: () => {
            const store = useScreenStore.getState();
            const sel = store.selectedId ? store.screens.find(s => s.id === store.selectedId) : store.screens[0];
            if (sel && newName.trim()) { store.renameScreen(sel.id, newName.trim()); message.success(`Экран переименован в «${newName.trim()}»`); }
            else message.info('Имя не изменено');
          },
        });
        break;
      }
      case 'screen-win-move': {
        let dir = '';
        Modal.confirm({
          title: 'Переместить рабочее окно',
          icon: null,
          content: <Select placeholder="Направление" style={{ width: '100%' }} onChange={(v) => { dir = v; }} options={[{ value: 'left', label: 'Левее' }, { value: 'right', label: 'Правее' }]} />,
          onOk: () => {
            const store = useScreenStore.getState();
            const sel = store.selectedId ? store.screens.find(s => s.id === store.selectedId) : store.screens[0];
            if (sel && sel.windows.length > 0) {
              const lastIdx = sel.windows.length - 1;
              const toIdx = dir === 'left' ? Math.max(0, lastIdx - 1) : lastIdx;
              if (toIdx !== lastIdx) { store.reorderWindows(sel.id, lastIdx, toIdx); message.success('Окно перемещено'); }
              else message.info('Окно уже на краю');
            } else message.info('Нет окон');
          },
        });
        break;
      }
      case 'screen-split':
        setScreenSplitOpen(true);
        break;
      case 'view-scales':
        useViewStore.getState().setScalesVisible(!useViewStore.getState().scalesVisible);
        message.success(useViewStore.getState().scalesVisible ? 'Шкалы: показаны' : 'Шкалы: скрыты');
        break;
      case 'view-values-list':
        useViewStore.getState().setValuesMode('list');
        message.success('Текущие значения: список');
        break;
      case 'view-values-table':
        useViewStore.getState().setValuesMode('table');
        message.success('Текущие значения: таблица');
        break;
      case 'view-values-off':
        useViewStore.getState().setValuesMode('hidden');
        message.success('Текущие значения: скрыты');
        break;
      case 'cursor-cross':
        useViewStore.getState().setCursorMode('cross');
        message.success('Курсор: перекрестье');
        break;
      case 'cursor-cross-val':
        useViewStore.getState().setCursorMode('crossVal');
        break;
      case 'cursor-arrow':
        useViewStore.getState().setCursorMode('arrow');
        break;
      case 'cursor-vline':
        useViewStore.getState().setCursorMode('vline');
        break;
      case 'graph-add-func':
        setAddFuncOpen(true);
        break;
      case 'graph-add-val':
        setAddValueOpen(true);
        break;
      case 'graph-limits':
        setGraphLimitsOpen(true);
        break;
      case 'graph-auto':
        setGraphAutoOpen(true);
        break;
      case 'graph-axis':
        setGraphAxisOpen(true);
        break;
      case 'graph-grid':
        useViewStore.getState().setGridVisible(!useViewStore.getState().gridVisible);
        message.success(useViewStore.getState().gridVisible ? 'Сетка: показана' : 'Сетка: скрыта');
        break;
      case 'graph-save':
        setGraphSaveOpen(true);
        break;
      case 'table-values':
        navigate('/');
        break;
      case 'table-settings':
        setTableSettingsOpen(true);
        break;
      case 'table-export':
        setTableExportOpen(true);
        break;
      case 'table-print-preview':
      case 'table-print':
        setPrintPreviewOpen(true);
        break;
      case 'table-stat':
        setStatisticsOpen(true);
        break;
      case 'proc-tasks':
      case 'proc-task-list':
        navigate('/processing');
        break;
      case 'proc-task-load':
        setTaskLoadOpen(true);
        break;
      case 'proc-task-save':
        setTaskSaveOpen(true);
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
      case 'db-compare':
        setDbCompareOpen(true);
        break;
      case 'db-update':
        setDbUpdateOpen(true);
        break;
      case 'db-export':
        setDbExportOpen(true);
        break;
      case 'db-check':
        setDbCheckOpen(true);
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
        message.success('Снимок экрана: screenshot.png');
        break;
      case 'help-f1':
        navigate('/help');
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
      if (e.ctrlKey && e.key === 'o') { e.preventDefault(); setTrajOpenOpen(true); }
      else if (e.ctrlKey && e.key === 's') { e.preventDefault(); message.success('Сохранено (Ctrl+S)'); }
      else if (e.key === 'F1') { e.preventDefault(); navigate('/help'); }
      else if (e.key === 'F5') { e.preventDefault(); setTrajCalcOpen(true); }
      else if (e.key === 'Delete') { Modal.confirm({ title: 'Удалить?', onOk: () => message.success('Удалено') }); }
      else if (e.altKey && e.key === 'F4') { e.preventDefault(); Modal.confirm({ title: 'Завершить работу?', onOk: () => window.close() }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  const isFlight = mode === 'flight';
  const bgColor = isFlight ? '#1a1a2e' : '#f5f5f5';
  const textColor = isFlight ? '#e0e0e0' : '#000000';

  document.documentElement.style.setProperty('--bg', bgColor);
  document.documentElement.style.setProperty('--text', textColor);

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
        background: 'linear-gradient(90deg, #2A4DAB 0%, #80BEEB 100%)',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 28,
        borderBottom: '1px solid #1a3a8a',
      }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
          СПМО «ПОЛЁТ» v5
          <span style={{
            marginLeft: 10, fontSize: 10, background: isFlight ? '#52c41a' : '#1677ff',
            padding: '1px 6px', borderRadius: 3, color: '#fff', fontWeight: 600, verticalAlign: 'middle',
          }}>
            {isFlight ? 'ПОЛЁТ' : 'АНАЛИЗ'}
          </span>
        </div>
        <Space size={2}>
          <Tooltip title="Ctrl+O — Открыть"><Button type="text" icon={<FolderOpenOutlined style={{ fontSize: 13 }} />} style={{ color: '#fff', height: 22, width: 22 }} onClick={() => setTrajOpenOpen(true)} /></Tooltip>
          <Tooltip title="Ctrl+S — Сохранить"><Button type="text" icon={<SaveOutlined style={{ fontSize: 13 }} />} style={{ color: '#fff', height: 22, width: 22 }} onClick={() => message.success('Сохранено')} /></Tooltip>
          <Tooltip title="F5 — Расчёт"><Button type="text" icon={<CalculatorOutlined style={{ fontSize: 13 }} />} style={{ color: '#fff', height: 22, width: 22 }} onClick={() => setTrajCalcOpen(true)} /></Tooltip>
          <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: 4, fontSize: 12 }}>
            {isFlight ? 'Пилот' : 'Аналитик'}
          </span>
        </Space>
      </Header>

      <Layout>
        <div style={{
          width: 44, background: '#DEDDE1', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid #C0C0C0', padding: '4px 0', gap: 1, flexShrink: 0,
        }}>
          {OPS_ITEMS.map((item) => (
            <Tooltip key={item.key} title={item.label} placement="right">
              <Button
                type="text"
                icon={item.icon}
                style={{
                  width: 36, height: 36, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 4, fontSize: 18, color: '#333',
                }}
                onClick={() => handleMenuClick(item.key)}
              />
            </Tooltip>
          ))}
        </div>

        <Sider
          width={220}
          style={{ background: '#DEDDE1', borderRight: '1px solid #C0C0C0' }}
        >
          <ObjectTree onCreateTopic={() => setCreateTopicOpen(true)} onCreateObject={() => setCreateObjectOpen(true)} />
        </Sider>

        <Content style={{ padding: 0, background: '#FFFFFF', overflow: 'auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <MainMenuBar onMenuClick={handleMenuClick} hasTrajectory={!!activeTrajectoryId} />

          <div style={{
            background: '#E8E8E8', borderBottom: '1px solid #C0C0C0',
            borderTop: '1px solid #F4F3F5', padding: '2px 8px',
            display: 'flex', gap: 1, alignItems: 'center', height: 30,
          }}>
            <Tooltip title="Открыть траекторию"><Button size="small" type="text" icon={<FolderOpenOutlined style={{ fontSize: 14 }} />} onClick={() => setTrajOpenOpen(true)} /></Tooltip>
            <div style={{ width: 1, height: 18, background: '#C0C0C0', margin: '0 4px' }} />
            <Tooltip title="Рассчитать (F5)"><Button size="small" type="text" icon={<CalculatorOutlined style={{ fontSize: 14 }} />} onClick={() => setTrajCalcOpen(true)} /></Tooltip>
            <Tooltip title="Сохранить часть"><Button size="small" type="text" icon={<SaveOutlined style={{ fontSize: 14 }} />} onClick={() => setTrajSavePartOpen(true)} /></Tooltip>
            <div style={{ width: 1, height: 18, background: '#C0C0C0', margin: '0 4px' }} />
            <Tooltip title="Добавить функцию"><Button size="small" type="text" icon={<LineChartOutlined style={{ fontSize: 14 }} />} onClick={() => setAddFuncOpen(true)} /></Tooltip>
            <Tooltip title="Автопостроение"><Button size="small" type="text" icon={<TableOutlined style={{ fontSize: 14 }} />} onClick={() => setGraphAutoOpen(true)} /></Tooltip>
            <div style={{ width: 1, height: 18, background: '#C0C0C0', margin: '0 4px' }} />
            <Tooltip title="Маркеры"><Button size="small" type="text" icon={<NodeIndexOutlined style={{ fontSize: 14 }} />} onClick={() => { useAppStore.getState().setMarkerSetMode('set'); message.info('Кликните на графике'); }} /></Tooltip>
            <Tooltip title="Сбои"><Button size="small" type="text" icon={<DeleteOutlined style={{ fontSize: 14 }} />} onClick={() => setFaultsOpen(true)} /></Tooltip>
            <div style={{ flex: 1 }} />
            <Tooltip title="Снимок экрана"><Button size="small" type="text" icon={<CameraOutlined style={{ fontSize: 14 }} />} onClick={() => message.success('Снимок экрана сохранён')} /></Tooltip>
            <Tooltip title="Настройки"><Button size="small" type="text" icon={<SettingOutlined style={{ fontSize: 14 }} />} onClick={() => setSettingsOpen(true)} /></Tooltip>
          </div>

          <div
            style={{ flex: 1, padding: 12, background: '#FFFFFF' }}
            onContextMenu={(e) => { e.preventDefault(); }}
          >
            <Dropdown menu={{ items: ctxMenuItems, onClick: ({ key }) => handleMenuClick(key) }} trigger={['contextMenu']}>
              <div style={{ minHeight: '100%' }}>{children}</div>
            </Dropdown>
          </div>
        </Content>
      </Layout>

      <StatusBar />

      <SelectObjectModal open={selectObjectOpen} onClose={() => setSelectObjectOpen(false)} />
      <CreateTopicModal open={createTopicOpen} onClose={() => setCreateTopicOpen(false)} />
      <CreateObjectModal open={createObjectOpen} onClose={() => setCreateObjectOpen(false)} />
      <TrajCalcModal open={trajCalcOpen} onClose={() => setTrajCalcOpen(false)} />
      <OpenDbModal open={openDbOpen} onClose={() => setOpenDbOpen(false)} />
      <DbCompareModal open={dbCompareOpen} onClose={() => setDbCompareOpen(false)} />
      <DbUpdateModal open={dbUpdateOpen} onClose={() => setDbUpdateOpen(false)} />
      <DbExportModal open={dbExportOpen} onClose={() => setDbExportOpen(false)} />
      <DbCheckModal open={dbCheckOpen} onClose={() => setDbCheckOpen(false)} />
      <TrajOpenModal open={trajOpenOpen} onClose={() => setTrajOpenOpen(false)} />
      <TrajSavePartModal open={trajSavePartOpen} onClose={() => setTrajSavePartOpen(false)} />
      <TrajDelPartModal open={trajDelPartOpen} onClose={() => setTrajDelPartOpen(false)} />
      <ScreenCreateModal open={screenCreateOpen} onClose={() => setScreenCreateOpen(false)} onCreate={(name) => { message.success(`Экран «${name}» создан`); navigate('/screens'); }} />
      <ScreenSaveModal open={screenSaveOpen} screenName="" onClose={() => setScreenSaveOpen(false)} />
      <ScreenSplitModal open={screenSplitOpen} onClose={() => setScreenSplitOpen(false)} />
      <ScreenWinAddModal open={screenWinAddOpen} onClose={() => setScreenWinAddOpen(false)} />
      <AddFuncModal open={addFuncOpen} onClose={() => setAddFuncOpen(false)} />
      <AddValueModal open={addValueOpen} onClose={() => setAddValueOpen(false)} />
      <GraphLimitsModal open={graphLimitsOpen} onClose={() => setGraphLimitsOpen(false)} />
      <GraphAutoModal open={graphAutoOpen} onClose={() => setGraphAutoOpen(false)} />
      <GraphAxisModal open={graphAxisOpen} onClose={() => setGraphAxisOpen(false)} />
      <GraphSaveModal open={graphSaveOpen} onClose={() => setGraphSaveOpen(false)} />
      <TableSettingsModal open={tableSettingsOpen} onClose={() => setTableSettingsOpen(false)} />
      <TableExportModal open={tableExportOpen} onClose={() => setTableExportOpen(false)} />
      <PrintPreviewModal open={printPreviewOpen} onClose={() => setPrintPreviewOpen(false)} />
      <TaskLoadModal open={taskLoadOpen} onClose={() => setTaskLoadOpen(false)} />
      <TaskSaveModal open={taskSaveOpen} onClose={() => setTaskSaveOpen(false)} />
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
