import { useState } from 'react';
import { Modal, Steps, Form, Select, Button, Progress, Alert, Typography, Table } from 'antd';
import { ImportOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ImportWizardModalProps {
  open: boolean;
  onClose: () => void;
}

const formats = [
  { value: 'text', label: 'Текстовые файлы (.txt, .csv)' },
  { value: 'excel', label: 'Excel (.xlsx, .xls)' },
  { value: 'binary', label: 'Бинарные файлы (.bin, .dat)' },
  { value: 'dirac', label: 'DIRAC' },
];

const previewColumns = [
  { title: 'Время', dataIndex: 't', key: 't' },
  { title: 'Параметр_001', dataIndex: 'p1', key: 'p1' },
  { title: 'Параметр_002', dataIndex: 'p2', key: 'p2' },
  { title: 'Параметр_003', dataIndex: 'p3', key: 'p3' },
];

const previewData = Array.from({ length: 10 }, (_, i) => ({
  key: i,
  t: `${(i * 0.1).toFixed(1)}с`,
  p1: (Math.random() * 100).toFixed(2),
  p2: (Math.random() * 50).toFixed(2),
  p3: (Math.random() * 200).toFixed(2),
}));

export default function ImportWizardModal({ open, onClose }: ImportWizardModalProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState('text');

  const handleImport = () => {
    setStep(2);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setStep(3); return 100; }
        return p + Math.random() * 12 + 5;
      });
    }, 300);
  };

  const handleReset = () => {
    setStep(0);
    setProgress(0);
    onClose();
  };

  const steps = [
    {
      title: 'Выбор файла',
      content: (
        <Form layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="Формат импортируемого файла">
            <Select value={format} onChange={setFormat} options={formats} />
          </Form.Item>
          <Form.Item label="Файл">
            <Button icon={<ImportOutlined />}>Выбрать файл...</Button>
          </Form.Item>
          {format === 'text' && (
            <>
              <Form.Item label="Разделитель">
                <Select defaultValue="comma" options={[
                  { value: 'comma', label: 'Запятая (,)' },
                  { value: 'semicolon', label: 'Точка с запятой (;)' },
                  { value: 'tab', label: 'Табуляция' },
                  { value: 'space', label: 'Пробел' },
                ]} />
              </Form.Item>
              <Form.Item label="Кодировка">
                <Select defaultValue="utf8" options={[
                  { value: 'utf8', label: 'UTF-8' },
                  { value: 'cp1251', label: 'CP1251' },
                  { value: 'cp866', label: 'CP866' },
                ]} />
              </Form.Item>
            </>
          )}
          {format === 'dirac' && (
            <Form.Item label="Параметры DIRAC">
              <Select mode="multiple" placeholder="Выберите параметры" options={['Вибрация', 'Давление', 'Температура', 'Частота'].map(p => ({ value: p, label: p }))} />
            </Form.Item>
          )}
          {format === 'binary' && (
            <Form.Item label="Структура данных">
              <Select defaultValue="ieee754" options={[
                { value: 'ieee754', label: 'IEEE 754 (float32)' },
                { value: 'int16', label: 'Целочисленный int16' },
                { value: 'int32', label: 'Целочисленный int32' },
              ]} />
            </Form.Item>
          )}
        </Form>
      ),
    },
    {
      title: 'Предпросмотр',
      content: (
        <div style={{ marginTop: 12 }}>
          <Text>Первые 10 строк файла:</Text>
          <Table columns={previewColumns} dataSource={previewData} size="small" pagination={false} style={{ marginTop: 8 }} />
          <div style={{ marginTop: 12 }}>
            <Text>Маппинг колонок:</Text>
            <Form layout="vertical" style={{ marginTop: 8 }}>
              <Form.Item label="Время → колонка">
                <Select defaultValue="col_1" options={['col_1 (Время)', 'col_2', 'col_3', 'col_4'].map(c => ({ value: c, label: c }))} />
              </Form.Item>
              <Form.Item label="Параметр → колонка">
                <Select mode="multiple" defaultValue={['col_2']} options={['col_2 (Параметр_001)', 'col_3 (Параметр_002)', 'col_4 (Параметр_003)'].map(c => ({ value: c, label: c }))} />
              </Form.Item>
            </Form>
          </div>
        </div>
      ),
    },
    {
      title: 'Импорт',
      content: (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Progress percent={Math.min(Math.round(progress), 100)} status="active" style={{ maxWidth: 400, margin: '0 auto 16px' }} />
          <Text type="secondary">Импорт данных... {Math.round(progress)}%</Text>
        </div>
      ),
    },
    {
      title: 'Завершено',
      content: (
        <Alert type="success" showIcon message="Импорт завершён" description="Импортировано 3 параметра, 1240 точек. Данные добавлены в рабочую область." action={<Button size="small" onClick={handleReset}>Закрыть</Button>} />
      ),
    },
  ];

  return (
    <Modal
      title="Мастер импорта данных"
      open={open}
      onCancel={handleReset}
      footer={
        step < 2
          ? [
              <Button key="cancel" onClick={handleReset}>Отмена</Button>,
              <Button key="next" type="primary" disabled={step === 0 && !format} onClick={() => {
                if (step === 0) setStep(1);
                else if (step === 1) handleImport();
              }}>
                {step === 0 ? 'Далее →' : 'Импортировать'}
              </Button>,
            ]
          : step === 2
            ? null
            : [<Button key="close" type="primary" onClick={handleReset}>Закрыть</Button>]
      }
      width={580}
    >
      <Steps current={step} size="small" items={steps.map(s => ({ title: s.title }))} style={{ marginBottom: 16 }} />
      {steps[step].content}
    </Modal>
  );
}
