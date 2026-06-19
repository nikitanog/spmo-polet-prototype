import { useState, useCallback } from 'react';
import { Modal, Button, Typography, Space, message } from 'antd';
import Chart from '../components/common/Chart';

const { Text } = Typography;

interface GraphicsEditorModalProps {
  open: boolean;
  onClose: () => void;
}

const templateGrids = [
  { key: '1x1', label: '1x1' },
  { key: '1x2', label: '1x2' },
  { key: '2x1', label: '2x1' },
  { key: '2x2', label: '2x2' },
];

const GRID_LAYOUTS: Record<string, Record<string, any>> = {
  '1x1': { grid: { left: 50, right: 16, top: 16, bottom: 24 } },
  '1x2': {
    grid: [
      { left: 50, right: 16, top: 16, height: '35%' },
      { left: 50, right: 16, bottom: 16, height: '35%' },
    ],
  },
  '2x1': {
    grid: [
      { left: 50, right: '52%', top: 16, bottom: 24 },
      { left: '52%', right: 16, top: 16, bottom: 24 },
    ],
  },
  '2x2': {
    grid: [
      { left: 50, right: '52%', top: 16, height: '35%' },
      { left: '52%', right: 16, top: 16, height: '35%' },
      { left: 50, right: '52%', bottom: 16, height: '35%' },
      { left: '52%', right: 16, bottom: 16, height: '35%' },
    ],
  },
};

function generateGridAxes(gridConfig: any) {
  if (Array.isArray(gridConfig)) {
    return {
      xAxis: gridConfig.map((_: any, i: number) => ({ type: 'value' as const, gridIndex: i })),
      yAxis: gridConfig.map((_: any, i: number) => ({ type: 'value' as const, gridIndex: i })),
    };
  }
  return { xAxis: { type: 'value' as const }, yAxis: { type: 'value' as const } };
}

let lineIdCounter = 0;

export default function GraphicsEditorModal({ open, onClose }: GraphicsEditorModalProps) {
  const [grid, setGrid] = useState('1x1');
  const [lines, setLines] = useState<any[]>([]);
  const [templateName, setTemplateName] = useState('');

  const addLine = useCallback(() => {
    lineIdCounter++;
    const id = lineIdCounter;
    const color = ['#1677ff', '#ff4d4f', '#52c41a', '#722ed1', '#fa8c16', '#13c2c2'][id % 6];
    setLines((prev) => [
      ...prev,
      {
        id,
        type: 'line',
        data: Array.from({ length: 100 }, (_, i) => [i, 30 + Math.sin(i / (10 + id * 3)) * 15 + id * 5]),
        symbol: 'none',
        lineStyle: { width: 1.5, color },
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
    ]);
    message.info(`Линия ${id} добавлена`);
  }, []);

  const addLegend = useCallback(() => {
    message.info('Для настройки легенды используйте панель свойств');
  }, []);

  const addText = useCallback(() => {
    setLines((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'line',
        data: [],
        symbol: 'none',
        lineStyle: { width: 0 },
        markPoint: {
          data: [{ type: 'max', name: `Макс: ${Math.round(Math.random() * 100)}` }],
        },
      },
    ]);
    message.info('Маркер добавлен');
  }, []);

  const addLabel = useCallback(() => {
    setLines((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'line',
        data: [],
        symbol: 'none',
        lineStyle: { width: 0 },
        markLine: {
          data: [{ yAxis: 50 + Math.random() * 20, label: { formatter: `Выноска ${prev.length + 1}` } }],
        },
      },
    ]);
    message.info('Выноска добавлена');
  }, []);

  const handleSave = useCallback(() => {
    const name = prompt('Имя шаблона:', templateName || 'template');
    if (!name) return;
    const payload = { grid, lines, name, date: new Date().toISOString() };
    localStorage.setItem(`gfx_tpl_${name}`, JSON.stringify(payload));
    setTemplateName(name);
    message.success(`Шаблон «${name}» сохранён`);
  }, [grid, lines, templateName]);

  const handleOpen = useCallback(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('gfx_tpl_'));
    if (keys.length === 0) {
      message.info('Нет сохранённых шаблонов');
      return;
    }
    const name = prompt(`Выберите шаблон (доступны: ${keys.map((k) => k.replace('gfx_tpl_', '')).join(', ')})`);
    if (!name) return;
    const raw = localStorage.getItem(`gfx_tpl_${name}`);
    if (!raw) {
      message.error('Шаблон не найден');
      return;
    }
    const data = JSON.parse(raw);
    setGrid(data.grid || '1x1');
    setLines(data.lines || []);
    setTemplateName(data.name || name);
    message.success(`Шаблон «${name}» загружен`);
  }, []);

  const gridConfig = GRID_LAYOUTS[grid] || GRID_LAYOUTS['1x1'];
  const axes = generateGridAxes(gridConfig.grid);

  return (
    <Modal
      title="Графический редактор шаблонов"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Закрыть</Button>}
      width={780}
      destroyOnClose
    >
      <Space style={{ marginBottom: 12 }}>
        <Button onClick={handleSave}>Сохранить</Button>
        <Button onClick={handleOpen}>Открыть...</Button>
      </Space>
      <Space style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap' }}>
        <Text>Сетка:</Text>
        {templateGrids.map(g => (
          <Button key={g.key} size="small" type={grid === g.key ? 'primary' : 'default'} onClick={() => setGrid(g.key)}>
            {g.label}
          </Button>
        ))}
      </Space>
      <Space style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap' }}>
        <Text>Добавить:</Text>
        <Button size="small" onClick={addLegend}>Легенду</Button>
        <Button size="small" onClick={addLine}>Линию</Button>
        <Button size="small" onClick={addText}>Текст</Button>
        <Button size="small" onClick={addLabel}>Выноску</Button>
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 8 }}>
        <Chart
          key={grid}
          height={300}
          option={{
            tooltip: { trigger: 'axis' },
            legend: { show: lines.length > 0 },
            ...axes,
            ...gridConfig,
            series: lines.length > 0 ? lines : [
              { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 50 + Math.sin(i / 20) * 20]), symbol: 'none', lineStyle: { width: 1.5 } },
              { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 30 + Math.cos(i / 15) * 15]), symbol: 'none', lineStyle: { width: 1.5, color: '#ff4d4f' } },
            ],
            animation: false,
          }}
        />
      </div>
    </Modal>
  );
}
