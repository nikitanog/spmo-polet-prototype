import { useState } from 'react';
import { Modal, Tabs, Table, Tag, Button, Typography, Select, Space, Alert } from 'antd';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, MarkAreaComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, MarkAreaComponent, CanvasRenderer]);

const { Text } = Typography;

const timeFaultsColumns = [
  { title: 'Время начала', dataIndex: 'start', key: 'start' },
  { title: 'Время конца', dataIndex: 'end', key: 'end' },
  { title: 'Тип сбоя', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="red">{t}</Tag> },
  { title: 'Длительность (мс)', dataIndex: 'duration', key: 'duration' },
];

const mockTimeFaults = [
  { key: '1', start: '00:12:05.100', end: '00:12:05.320', type: 'Потеря синхронизации', duration: 220 },
  { key: '2', start: '00:24:18.500', end: '00:24:18.550', type: 'Скачок времени', duration: 50 },
  { key: '3', start: '00:37:42.000', end: '00:37:42.800', type: 'Пропуск метки', duration: 800 },
  { key: '4', start: '00:45:03.200', end: '00:45:03.250', type: 'Потеря синхронизации', duration: 50 },
  { key: '5', start: '00:58:30.000', end: '00:58:31.200', type: 'Пропуск метки', duration: 1200 },
];

const mockParamFaults = [
  { key: '1', start: '00:05:00', end: '00:05:05', param: 'Параметр_001', type: 'Выброс', original: 45.2, corrected: 42.1 },
  { key: '2', start: '00:12:30', end: '00:12:35', param: 'Параметр_010', type: 'Пропуск', original: null, corrected: 78.3 },
  { key: '3', start: '00:20:15', end: '00:20:18', param: 'Параметр_050', type: 'Шум', original: '±15', corrected: '±2' },
  { key: '4', start: '00:33:00', end: '00:33:10', param: 'Параметр_020', type: 'Выброс', original: 210.0, corrected: 95.4 },
  { key: '5', start: '00:41:45', end: '00:41:50', param: 'Параметр_030', type: 'Пропуск', original: null, corrected: 156.2 },
];

const paramFaultsColumns = [
  { title: 'Время', dataIndex: 'start', key: 'start' },
  { title: 'Параметр', dataIndex: 'param', key: 'param' },
  { title: 'Тип', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={t === 'Выброс' ? 'volcano' : t === 'Пропуск' ? 'purple' : 'orange'}>{t}</Tag> },
  { title: 'Исходное', dataIndex: 'original', key: 'original', render: (v: unknown) => v ?? <Text type="secondary">—</Text> },
  { title: 'Исправленное', dataIndex: 'corrected', key: 'corrected', render: (v: unknown) => v ?? <Text type="secondary">—</Text> },
];

function TimeFaultsTab() {
  const [selected, setSelected] = useState<string | null>(null);

  const data = Array.from({ length: 500 }, (_, i) => [i, 50 + Math.sin(i / 20) * 15 + (Math.random() - 0.5) * 10]);

  return (
    <div>
      <Text strong>Найденные сбои времени ТН:</Text>
      <Table
        dataSource={mockTimeFaults}
        columns={timeFaultsColumns}
        size="small"
        pagination={false}
        style={{ marginTop: 8 }}
        onRow={(record) => ({ onClick: () => setSelected(record.key), style: { cursor: 'pointer', background: selected === record.key ? '#e6f4ff' : undefined } })}
      />
      <div style={{ height: 180, marginTop: 12 }}>
        <ReactEChartsCore
          echarts={echarts}
          option={{
            tooltip: { trigger: 'axis' },
            grid: { left: 50, right: 16, top: 16, bottom: 24 },
            xAxis: { type: 'value', name: 'Время (с)' },
            yAxis: { type: 'value' },
            series: [{
              type: 'line', data, symbol: 'none', lineStyle: { width: 1, color: '#1677ff' },
              markArea: {
                data: mockTimeFaults.map(f => [
                  { xAxis: Number(f.start.slice(3, 5)) * 60 + Number(f.start.slice(6, 8)) },
                  { xAxis: Number(f.end.slice(3, 5)) * 60 + Number(f.end.slice(6, 8)), itemStyle: { color: 'rgba(255,0,0,0.15)' } },
                ]),
              },
            }],
            animation: false,
          }}
          style={{ height: 180 }}
        />
      </div>
    </div>
  );
}

function ParamFaultsTab() {
  const [param, setParam] = useState('Параметр_001');
  const [fixed, setFixed] = useState(false);

  const data = Array.from({ length: 500 }, (_, i) => {
    const base = 50 + Math.sin(i / 25) * 20;
    if (i > 150 && i < 180) return base + 60;
    if (i > 300 && i < 320) return null;
    return base + (Math.random() - 0.5) * 5;
  });

  const fixedData = data.map(v => v ?? 50);

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Text>Параметр:</Text>
        <Select value={param} onChange={setParam} style={{ width: 180 }} options={['Параметр_001', 'Параметр_010', 'Параметр_020', 'Параметр_050'].map(p => ({ value: p, label: p }))} />
      </Space>
      <Table dataSource={mockParamFaults} columns={paramFaultsColumns} size="small" pagination={false} />
      <div style={{ height: 180, marginTop: 12 }}>
        <ReactEChartsCore
          echarts={echarts}
          option={{
            tooltip: { trigger: 'axis' },
            grid: { left: 50, right: 16, top: 16, bottom: 24 },
            xAxis: { type: 'value' },
            yAxis: { type: 'value' },
            series: [
              { name: 'Исходный', type: 'line', data: data.map((v, i) => [i, v]), symbol: 'none', lineStyle: { width: 1, color: '#ff4d4f', opacity: fixed ? 0.3 : 1 } },
              ...(fixed ? [{ name: 'Исправленный', type: 'line', data: fixedData.map((v, i) => [i, v]), symbol: 'none', lineStyle: { width: 1.5, color: '#52c41a' } }] : []),
            ],
            animation: false,
          }}
          style={{ height: 180 }}
        />
      </div>
      {!fixed ? (
        <Button type="primary" onClick={() => setFixed(true)} style={{ marginTop: 8 }}>Исправить</Button>
      ) : (
        <Space style={{ marginTop: 8 }}>
          <Alert type="success" showIcon message="Сбои исправлены (интерполяция)" style={{ flex: 1 }} />
          <Button onClick={() => setFixed(false)}>Отменить</Button>
        </Space>
      )}
    </div>
  );
}

interface FaultsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FaultsModal({ open, onClose }: FaultsModalProps) {
  return (
    <Modal
      title="Анализ сбоев"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Tabs items={[
        { key: 'time', label: 'Сбои времени ТН', children: <TimeFaultsTab /> },
        { key: 'param', label: 'Сбои параметров', children: <ParamFaultsTab /> },
      ]} />
    </Modal>
  );
}
