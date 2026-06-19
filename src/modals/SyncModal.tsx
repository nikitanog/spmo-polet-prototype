import { useState } from 'react';
import { Modal, Tabs, Form, Select, Button, Progress, Alert, Typography, Space, Slider } from 'antd';
import { SyncOutlined, SlidersOutlined } from '@ant-design/icons';
import Chart from '../components/common/Chart';

const { Text } = Typography;

function AutoSync({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const startSync = () => {
    setStep(1);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setStep(2); return 100; }
        return p + Math.random() * 12 + 5;
      });
    }, 300);
  };

  return (
    <div>
      {step === 0 && (
        <Form layout="vertical">
          <Form.Item label="Файлы траектории для объединения">
            <Select mode="multiple" defaultValue={['flight_001.trj', 'flight_002.trj']} options={[
              { value: 'flight_001.trj', label: 'flight_001.trj (12.04.2026, 10:23, 45.2 МБ)' },
              { value: 'flight_002.trj', label: 'flight_002.trj (12.04.2026, 11:05, 38.7 МБ)' },
              { value: 'flight_003.trj', label: 'flight_003.trj (12.04.2026, 11:48, 52.1 МБ)' },
              { value: 'flight_004.trj', label: 'flight_004.trj (13.04.2026, 09:12, 41.5 МБ)' },
            ]} />
          </Form.Item>
          <Form.Item label="Метод синхронизации">
            <Select defaultValue='time' options={[
              { value: 'time', label: 'По временным меткам' },
              { value: 'corr', label: 'По корреляции сигналов' },
              { value: 'events', label: 'По событиям' },
            ]} />
          </Form.Item>
          <Button type="primary" icon={<SyncOutlined />} onClick={startSync}>Синхронизировать</Button>
        </Form>
      )}
      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Progress percent={Math.min(Math.round(progress), 100)} status="active" style={{ maxWidth: 400, margin: '0 auto 16px' }} />
          <Text type="secondary">Синхронизация и объединение файлов...</Text>
        </div>
      )}
      {step === 2 && (
        <Alert type="success" showIcon message="Синхронизация завершена" description="Создана объединённая траектория «Сводный полёт 12.04.2026» (3 файла, 2 ч 15 мин)" action={<Button size="small" onClick={onClose}>Открыть</Button>} />
      )}
    </div>
  );
}

const baseSignal = Array.from({ length: 400 }, (_, i) => 50 + Math.sin(i / 15) * 20 + Math.sin(i / 5) * 8 + (Math.random() - 0.5) * 5);

function ManualSync() {
  const [shift, setShift] = useState(0);
  const [applied, setApplied] = useState(false);

  const shiftedSignal = baseSignal.map((_, i) => {
    const srcIdx = Math.max(0, Math.min(i - shift, baseSignal.length - 1));
    return baseSignal[Math.round(srcIdx)];
  });

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Chart
          height={240}
          option={{
            tooltip: { trigger: 'axis' },
            grid: { left: 50, right: 16, top: 20, bottom: 24 },
            xAxis: { type: 'value', name: 'Время (с)' },
            yAxis: { type: 'value' },
            series: [
              { name: 'Траектория A', type: 'line', data: baseSignal.map((v, i) => [i, v]), symbol: 'none', lineStyle: { width: 1.5, color: '#1677ff' } },
              { name: 'Траектория B', type: 'line', data: shiftedSignal.map((v, i) => [i, v]), symbol: 'none', lineStyle: { width: 1.5, color: '#ff4d4f', type: 'dashed' as const } },
            ],
            animation: false,
          }}
        />
      </div>

      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>Сдвиг: {shift > 0 ? `+${shift} отсчётов` : `${shift} отсчётов`}</Text>
        <Text type="secondary">Траектория A — сплошная, B — пунктир</Text>
      </Space>

      <Slider
        min={-50}
        max={50}
        value={shift}
        onChange={(v) => { setShift(v); setApplied(false); }}
        marks={{ '-50': '-50', '-25': '-25', '0': '0', '25': '25', '50': '50' }}
      />

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={() => setShift(0)}>Сброс</Button>
        <Button type="primary" onClick={() => setApplied(true)} icon={<SlidersOutlined />} disabled={shift === 0 || applied}>
          {applied ? 'Сдвиг зафиксирован' : 'Применить'}
        </Button>
      </div>

      {applied && (
        <Alert type="success" showIcon message={`Сдвиг ${shift > 0 ? '+' : ''}${shift} отсчётов зафиксирован`} style={{ marginTop: 12 }} />
      )}
    </div>
  );
}

export default function SyncModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      title="Синхронизация данных"
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
    >
      <Tabs
        items={[
          {
            key: 'auto',
            label: <span><SyncOutlined /> Автоматическая</span>,
            children: <AutoSync onClose={onClose} />,
          },
          {
            key: 'manual',
            label: <span><SlidersOutlined /> Ручная</span>,
            children: <ManualSync />,
          },
        ]}
      />
    </Modal>
  );
}
