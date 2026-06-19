import { useState } from 'react';
import { Modal, Form, Select, Input, InputNumber, Button, Progress, Alert, Typography, Tabs } from 'antd';
import { ExportOutlined, FileTextOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

const paramOptions = ['V_приборная_км_ч', 'V_истинная_км_ч', 'Крен_град', 'Тангаж_град', 'Расход_топлива_кг_ч', 'Темп_1_двиг_C', 'Напряжение_БС_В', 'Обороты_1_двиг_об_мин']
  .map((p) => ({ value: p, label: p }));

const formatOptions = [
  { value: 'bin', label: 'Бинарный (spmo-bin)' },
  { value: 'csv', label: 'CSV' },
  { value: 'mdf4', label: 'MDF4' },
  { value: 'parquet', label: 'Apache Parquet' },
];

function BinaryExport({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const startExport = () => {
    setStep(1);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setStep(2);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 300);
  };

  return (
    <div>
      {step === 0 && (
        <Form layout="vertical">
          <Form.Item label="Параметры" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Выберите параметры" options={paramOptions} />
          </Form.Item>
          <Form.Item label="Формат файла">
            <Select defaultValue="bin" options={formatOptions} />
          </Form.Item>
          <Form.Item label="Путь сохранения">
            <Input defaultValue="/data/export/export_001.bin" />
          </Form.Item>
          <Button type="primary" icon={<ExportOutlined />} onClick={startExport}>Экспортировать</Button>
        </Form>
      )}
      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Progress percent={Math.min(Math.round(progress), 100)} status="active" style={{ maxWidth: 400, margin: '0 auto 16px' }} />
          <Text type="secondary">Экспорт данных...</Text>
        </div>
      )}
      {step === 2 && (
        <Alert type="success" showIcon message="Экспорт завершён" description="Файл сохранён: /data/export/export_001.bin (12.4 МБ)" action={<Button size="small" onClick={onClose}>Закрыть</Button>} />
      )}
    </div>
  );
}

function UsmExport({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const startExport = () => {
    setStep(1);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setStep(2); return 100; }
        return p + Math.random() * 20 + 5;
      });
    }, 300);
  };

  return (
    <div>
      {step === 0 && (
        <Form layout="vertical">
          <Form.Item label="Изделие">
            <Select defaultValue="usm_001" options={[
              { value: 'usm_001', label: 'USM-01 (Борт №1)' },
              { value: 'usm_002', label: 'USM-02 (Борт №2)' },
              { value: 'usm_003', label: 'USM-03 (Борт №3)' },
            ]} />
          </Form.Item>
          <Form.Item label="Каналы">
            <Select mode="multiple" defaultValue={['ch1', 'ch2', 'ch4']} options={[
              { value: 'ch1', label: 'Канал 1 — Вибрация' },
              { value: 'ch2', label: 'Канал 2 — Давление' },
              { value: 'ch3', label: 'Канал 3 — Температура' },
              { value: 'ch4', label: 'Канал 4 — Частота вращения' },
              { value: 'ch5', label: 'Канал 5 — Момент' },
              { value: 'ch6', label: 'Канал 6 — Дополнительный' },
            ]} />
          </Form.Item>
          <Form.Item label="Имя файла">
            <Input defaultValue="usm_export_001" addonAfter=".usm" />
          </Form.Item>
          <Form.Item label="Путь сохранения">
            <Input defaultValue="/data/usm/" />
          </Form.Item>
          <Button type="primary" icon={<ExportOutlined />} onClick={startExport}>Экспортировать</Button>
        </Form>
      )}
      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Progress percent={Math.min(Math.round(progress), 100)} status="active" style={{ maxWidth: 400, margin: '0 auto 16px' }} />
          <Text type="secondary">Формирование USM-файла...</Text>
        </div>
      )}
      {step === 2 && (
        <Alert type="success" showIcon message="Экспорт USM завершён" description="Файл сохранён: /data/usm/usm_export_001.usm" action={<Button size="small" onClick={onClose}>Закрыть</Button>} />
      )}
    </div>
  );
}

function BssExport({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const startExport = () => {
    setStep(1);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setStep(2); return 100; }
        return p + Math.random() * 10 + 10;
      });
    }, 200);
  };

  return (
    <div>
      {step === 0 && (
        <Form layout="vertical">
          <Form.Item label="Тип БСС-500А">
            <Select defaultValue="bss_standard" options={[
              { value: 'bss_standard', label: 'Стандартный' },
              { value: 'bss_extended', label: 'Расширенный (12 каналов)' },
              { value: 'bss_compact', label: 'Компактный (4 канала)' },
            ]} />
          </Form.Item>
          <Form.Item label="Каналы">
            <Select mode="multiple" defaultValue={['1', '2', '3', '4']} options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Канал ${i + 1}` }))} />
          </Form.Item>
          <Form.Item label="Частота дискретизации (Гц)">
            <InputNumber defaultValue={1000} min={100} max={10000} />
          </Form.Item>
          <Form.Item label="Имя файла">
            <Input defaultValue="bss_export_001" addonAfter=".bss" />
          </Form.Item>
          <Button type="primary" icon={<ExportOutlined />} onClick={startExport}>Экспортировать</Button>
        </Form>
      )}
      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Progress percent={Math.min(Math.round(progress), 100)} status="active" style={{ maxWidth: 400, margin: '0 auto 16px' }} />
          <Text type="secondary">Экспорт в формат БСС-500А...</Text>
        </div>
      )}
      {step === 2 && (
        <Alert type="success" showIcon message="Экспорт БСС-500А завершён" description="Файл сохранён: /data/bss/bss_export_001.bss (45.8 МБ)" action={<Button size="small" onClick={onClose}>Закрыть</Button>} />
      )}
    </div>
  );
}

export default function ExportModal({ open, onClose }: ExportModalProps) {
  return (
    <Modal
      title="Экспорт данных"
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
    >
      <Tabs
        items={[
          {
            key: 'binary',
            label: <span><FileTextOutlined /> Бинарный файл</span>,
            children: <BinaryExport onClose={onClose} />,
          },
          {
            key: 'usm',
            label: <span><DatabaseOutlined /> USM</span>,
            children: <UsmExport onClose={onClose} />,
          },
          {
            key: 'bss',
            label: <span><DatabaseOutlined /> БСС-500А</span>,
            children: <BssExport onClose={onClose} />,
          },
        ]}
      />
    </Modal>
  );
}
