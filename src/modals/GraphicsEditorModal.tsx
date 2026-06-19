import { useState } from 'react';
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

export default function GraphicsEditorModal({ open, onClose }: GraphicsEditorModalProps) {
  const [grid, setGrid] = useState('1x1');

  const chartOpts: Record<string, any> = {
    '1x1': {
      grid: { left: 50, right: 16, top: 16, bottom: 24 },
      series: [
        { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 50 + Math.sin(i / 20) * 20]), symbol: 'none', lineStyle: { width: 1.5 } },
        { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 30 + Math.cos(i / 15) * 15]), symbol: 'none', lineStyle: { width: 1.5, color: '#ff4d4f' } },
      ],
    },
    '1x2': {
      grid: [{ left: 50, right: 16, top: 16, height: '35%' }, { left: 50, right: 16, bottom: 16, height: '35%' }],
      series: [
        { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 50 + Math.sin(i / 20) * 20]), symbol: 'none', lineStyle: { width: 1.5, color: '#1677ff' }, xAxisIndex: 0, yAxisIndex: 0 },
        { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 30 + Math.cos(i / 15) * 15]), symbol: 'none', lineStyle: { width: 1.5, color: '#ff4d4f' }, xAxisIndex: 1, yAxisIndex: 1 },
      ],
    },
    '2x1': {
      grid: [{ left: 50, right: '52%', top: 16, bottom: 24 }, { left: '52%', right: 16, top: 16, bottom: 24 }],
      series: [
        { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 50 + Math.sin(i / 20) * 20]), symbol: 'none', lineStyle: { width: 1.5, color: '#1677ff' }, xAxisIndex: 0, yAxisIndex: 0 },
        { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 30 + Math.cos(i / 15) * 15]), symbol: 'none', lineStyle: { width: 1.5, color: '#ff4d4f' }, xAxisIndex: 1, yAxisIndex: 1 },
      ],
    },
    '2x2': {
      grid: [
        { left: 50, right: '52%', top: 16, height: '35%' },
        { left: '52%', right: 16, top: 16, height: '35%' },
        { left: 50, right: '52%', bottom: 16, height: '35%' },
        { left: '52%', right: 16, bottom: 16, height: '35%' },
      ],
      series: [
        { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 50 + Math.sin(i / 20) * 20]), symbol: 'none', lineStyle: { width: 1.5, color: '#1677ff' }, xAxisIndex: 0, yAxisIndex: 0 },
        { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 30 + Math.cos(i / 15) * 15]), symbol: 'none', lineStyle: { width: 1.5, color: '#ff4d4f' }, xAxisIndex: 1, yAxisIndex: 1 },
      ],
    },
  };

  const cfg = chartOpts[grid] || chartOpts['1x1'];

  const axes = Array.isArray(cfg.grid)
    ? { xAxis: cfg.grid.map((_: any, i: number) => ({ type: 'value' as const, gridIndex: i })), yAxis: cfg.grid.map((_: any, i: number) => ({ type: 'value' as const, gridIndex: i })) }
    : { xAxis: { type: 'value' as const }, yAxis: { type: 'value' as const } };

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
        <Button onClick={() => message.info('Шаблон будет создан')}>Создать файл шаблона</Button>
        <Button onClick={() => message.info('Выберите файл .tpl для открытия')}>Открыть...</Button>
        <Button onClick={() => message.success('Шаблон сохранён')}>Сохранить</Button>
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
        <Button size="small" onClick={() => message.info('Легенда добавлена')}>Легенду</Button>
        <Button size="small" onClick={() => message.info('Линия добавлена')}>Линию</Button>
        <Button size="small" onClick={() => message.info('Текст добавлен')}>Текст</Button>
        <Button size="small" onClick={() => message.info('Выноска добавлена')}>Выноску</Button>
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 8 }}>
        <Chart
          key={grid}
          height={300}
          option={{
            tooltip: { trigger: 'axis' },
            ...axes,
            ...cfg,
            animation: false,
          }}
        />
      </div>
    </Modal>
  );
}
