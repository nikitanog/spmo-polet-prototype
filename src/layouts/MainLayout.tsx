import { useEffect, useState, useCallback } from 'react';
import { Layout, Modal, message, Space, Button, Dropdown, Tooltip, Input, Select } from 'antd';
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
import { CameraOutlined } from '@ant-design/icons';
import { useAppStore } from '../stores/useAppStore';
import { useViewStore } from '../stores/useViewStore';
import { useScreenStore } from '../stores/useScreenStore';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const { mode, setMode } = useAppStore();
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
              <p style={{ fontSize: 11, color: '#888' }}>
                Все несохранённые данные будут потеряны.
              </p>
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
                  <p style={{ fontSize: 11, color: '#888' }}>
                    Для выхода из приложения закройте вкладку браузера.
                  </p>
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
        setTrajSavePartOpen(true);
        break;
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
        Modal.confirm({ title: 'Удалить все маркеры?', onOk: () => {
          useAppStore.getState().clearMarkers();
          message.success('Все маркеры удалены');
        }});
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
        setOpenDbOpen(true);
        break;
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
            const last = sel.windows[sel.windows.length - 1];
            store.removeWindow(sel.id, last.id);
            message.success('Окно удалено');
          } else {
            message.info('Нет окон для удаления');
          }
        }});
        break;
      case 'screen-win-clear':
        Modal.confirm({ title: 'Очистить содержимое окна?', onOk: () => {
          const store = useScreenStore.getState();
          const sel = store.selectedId ? store.screens.find(s => s.id === store.selectedId) : store.screens[0];
          if (sel && sel.windows.length > 0) {
            const last = sel.windows[sel.windows.length - 1];
            store.updateWindowParams(sel.id, last.id, []);
            message.success('Параметры окна очищены');
          } else {
            message.info('Нет окон для очистки');
          }
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
            if (sel && newName.trim()) {
              store.renameScreen(sel.id, newName.trim());
              message.success(`Экран переименован в «${newName.trim()}»`);
            } else {
              message.info('Имя не изменено');
            }
          },
        });
        break;
      }
      case 'screen-win-move': {
        let dir = '';
        Modal.confirm({
          title: 'Переместить/Копировать рабочее окно',
          icon: null,
          content: <Select placeholder="Выберите направление" style={{ width: '100%' }} onChange={(v) => { dir = v; }} options={[{ value: 'left', label: 'Левее' }, { value: 'right', label: 'Правее' }, { value: 'up', label: 'Выше' }, { value: 'down', label: 'Ниже' }]} />,
          onOk: () => {
            const store = useScreenStore.getState();
            const sel = store.selectedId ? store.screens.find(s => s.id === store.selectedId) : store.screens[0];
            if (sel && sel.windows.length > 0) {
              const lastIdx = sel.windows.length - 1;
              const toIdx = dir === 'left' || dir === 'up' ? Math.max(0, lastIdx - 1) : lastIdx;
              if (toIdx !== lastIdx) {
                store.reorderWindows(sel.id, lastIdx, toIdx);
                message.success(`Окно перемещено ${dir === 'left' || dir === 'up' ? 'влево/вверх' : 'вправо/вниз'}`);
              } else {
                message.info('Окно уже на краю');
              }
            } else {
              message.info('Нет окон для перемещения');
            }
          },
        });
        break;
      }
      case 'screen-split':
        setScreenSplitOpen(true);
        break;
      case 'view-scales':
        useViewStore.getState().setScalesVisible(!useViewStore.getState().scalesVisible);
        message.success(useViewStore.getState().scalesVisible ? 'Шкалы параметров: показаны' : 'Шкалы параметров: скрыты');
        break;
      case 'view-values-list':
        useViewStore.getState().setValuesMode('list');
        message.success('Текущие значения: режим списка');
        break;
      case 'view-values-table':
        useViewStore.getState().setValuesMode('table');
        message.success('Текущие значения: режим таблицы');
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
        message.success('Курсор: перекрестье со значениями');
        break;
      case 'cursor-arrow':
        useViewStore.getState().setCursorMode('arrow');
        message.success('Курсор: стрелка');
        break;
      case 'cursor-vline':
        useViewStore.getState().setCursorMode('vline');
        message.success('Курсор: вертикальная линия');
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
        setPrintPreviewOpen(true);
        break;
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
        message.success('Снимок экрана сохранён: screenshot_2026-06-18.png');
        break;
      case 'help-f1':
        navigate('/help');
        break;
      case 'help-about':
        Modal.info({ title: 'О программе', content: 'СПМО «Полёт» версия 5. Прототип UI. Разработка: НИЦ «Полёт». Версия прототипа: v5-r1. Дата сборки: 2026-06-19.' });
        break;
      default:
        message.info(`Команда: ${key}`);
    }
  }, [navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        setTrajOpenOpen(true);
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        message.success('Сохранено (Ctrl+S)');
      } else if (e.key === 'F1') {
        e.preventDefault();
        navigate('/help');
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
  }, [navigate]);

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
            <Button type="text" icon={<FolderOpenOutlined />} style={{ color: '#fff' }} onClick={() => setTrajOpenOpen(true)} />
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
          style={{ background: isFlight ? '#16213e' : '#fafafa', borderRight: '1px solid #d9d9d9' }}
        >
          <ObjectTree onCreateTopic={() => setCreateTopicOpen(true)} onCreateObject={() => setCreateObjectOpen(true)} />
        </Sider>
        <Content style={{ padding: 0, background: bgColor, overflow: 'auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <MainMenuBar onMenuClick={handleMenuClick} hasTrajectory={!!activeTrajectoryId} />
          <div style={toolbarStyle}>
            <Tooltip title="Открыть (Ctrl+O)"><Button size="small" icon={<FolderOpenOutlined />} onClick={() => setTrajOpenOpen(true)} /></Tooltip>
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
