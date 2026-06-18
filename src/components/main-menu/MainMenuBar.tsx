import { Menu } from 'antd';
import {
  FolderOutlined, DatabaseOutlined, NodeIndexOutlined, MonitorOutlined,
  EyeOutlined, LineChartOutlined, TableOutlined, ToolOutlined,
  SettingOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const menuItems: MenuProps['items'] = [
  { key: 'object', icon: <FolderOutlined />, label: 'Объект', children: [
    { key: 'object-create-topic', label: 'Создать тему' },
    { key: 'object-create-object', label: 'Создать объект' },
    { key: 'object-select', label: 'Выбрать' },
    { type: 'divider' },
    { key: 'object-exit', label: 'Выход' },
  ]},
  { key: 'db', icon: <DatabaseOutlined />, label: 'БД СБИ', children: [
    { key: 'db-view', label: 'Просмотреть' },
    { key: 'db-current', label: 'Текущая' },
    { key: 'db-calc', label: 'Расчетная' },
    { key: 'db-open', label: 'Открыть' },
    { key: 'db-change', label: 'Изменить' },
    { key: 'db-editor', label: 'Редактор' },
    { type: 'divider' },
    { key: 'db-param-types', label: 'Типы параметров' },
  ]},
  { key: 'trajectory', icon: <NodeIndexOutlined />, label: 'Траектория', children: [
    { key: 'traj-calc', label: 'Рассчитать' },
    { key: 'traj-open', label: 'Открыть' },
    { key: 'traj-close', label: 'Закрыть' },
    { key: 'traj-save-as', label: 'Сохранить как...' },
    { key: 'traj-save-part', label: 'Сохранить часть' },
    { key: 'traj-del-part', label: 'Удалить часть' },
    { type: 'divider' },
    { key: 'traj-faults-time', label: 'Сбои времени ТН' },
    { key: 'traj-faults-param', label: 'Сбои параметров' },
    { key: 'traj-markers', label: 'Маркеры', children: [
      { key: 'marker-set', label: 'Установить' },
      { key: 'marker-del', label: 'Удалить' },
      { key: 'marker-del-all', label: 'Удалить все' },
    ]},
    { key: 'traj-sample', label: 'Выборка', children: [
      { key: 'sample-save', label: 'Сохранить' },
      { key: 'sample-add', label: 'Добавить' },
    ]},
  ]},
  { key: 'screen', icon: <MonitorOutlined />, label: 'Экран', children: [
    { key: 'screen-create', label: 'Создать' },
    { key: 'screen-open', label: 'Открыть' },
    { key: 'screen-save', label: 'Сохранить' },
    { key: 'screen-save-as', label: 'Сохранить как...' },
    { type: 'divider' },
    { key: 'screen-win-add', label: 'Добавить рабочее окно' },
    { key: 'screen-win-del', label: 'Удалить рабочее окно' },
    { key: 'screen-win-clear', label: 'Очистить' },
    { key: 'screen-win-rename', label: 'Переименовать' },
    { key: 'screen-win-move', label: 'Переместить/Копировать' },
    { type: 'divider' },
    { key: 'screen-split', label: 'Разделить' },
  ]},
  { key: 'view', icon: <EyeOutlined />, label: 'Вид', children: [
    { key: 'view-scales', label: 'Шкалы параметров' },
    { key: 'view-values', label: 'Текущие значения', children: [
      { key: 'view-values-list', label: 'Список' },
      { key: 'view-values-table', label: 'Таблица' },
      { key: 'view-values-off', label: 'Не отображать' },
    ]},
    { key: 'view-cursor', label: 'Курсор', children: [
      { key: 'cursor-cross', label: 'Перекрестье' },
      { key: 'cursor-cross-val', label: 'Перекрестье со значениями' },
      { key: 'cursor-arrow', label: 'Стрелка' },
      { key: 'cursor-vline', label: 'Вертикальная линия' },
    ]},
  ]},
  { key: 'graph', icon: <LineChartOutlined />, label: 'График', children: [
    { key: 'graph-add-func', label: 'Добавить функцию' },
    { key: 'graph-add-val', label: 'Добавить значение' },
    { key: 'graph-limits', label: 'Пределы функции' },
    { key: 'graph-auto', label: 'Автопостроение' },
    { key: 'graph-axis', label: 'Свойства шкалы оси X' },
    { key: 'graph-grid', label: 'Сетка' },
    { key: 'graph-save', label: 'Сохранить в файл' },
  ]},
  { key: 'tables', icon: <TableOutlined />, label: 'Таблицы', children: [
    { key: 'table-values', label: 'Значения параметров' },
    { key: 'table-stat', label: 'Статистика' },
  ]},
  { key: 'processing', icon: <ToolOutlined />, label: 'Вторичная обработка', children: [
    { key: 'proc-calc-params', label: 'Расчетные параметры' },
    { key: 'proc-tasks', label: 'Задачи' },
    { key: 'proc-tenso', label: 'Тензопараметры' },
    { type: 'divider' },
    { key: 'proc-gfx-editor', label: 'Графический редактор' },
  ]},
  { key: 'service', icon: <SettingOutlined />, label: 'Сервис', children: [
    { key: 'service-import', label: 'Импорт', children: [
      { key: 'import-text', label: 'Текстовые файлы' },
      { key: 'import-excel', label: 'Excel' },
      { key: 'import-binary', label: 'Бинарные файлы' },
      { key: 'import-dirac', label: 'DIRAC' },
    ]},
    { key: 'service-export', label: 'Экспорт', children: [
      { key: 'export-binary', label: 'Бинарный файл' },
      { key: 'export-usm', label: 'USM' },
      { key: 'export-bss', label: 'БСС-500А' },
    ]},
    { key: 'service-sync', label: 'Синхронизация', children: [
      { key: 'sync-auto', label: 'Автоматическая' },
      { key: 'sync-manual', label: 'Ручная' },
    ]},
    { type: 'divider' },
    { key: 'service-piv', label: 'Управление ПИВ' },
    { key: 'service-batch', label: 'Пакетная обработка' },
    { type: 'divider' },
    { key: 'service-settings', label: 'Настройки' },
  ]},
  { key: 'help', icon: <QuestionCircleOutlined />, label: 'Справка', children: [
    { key: 'help-f1', label: 'По СПМО «Полёт»' },
    { key: 'help-about', label: 'О программе' },
  ]},
];

interface MainMenuBarProps {
  onMenuClick: (key: string) => void;
}

export default function MainMenuBar({ onMenuClick }: MainMenuBarProps) {
  return (
    <Menu
      mode="horizontal"
      items={menuItems}
      onClick={({ key }) => onMenuClick(key)}
      style={{ borderBottom: '1px solid #d9d9d9', marginBottom: 0 }}
    />
  );
}
