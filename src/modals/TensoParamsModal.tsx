import { useState } from 'react';
import { Modal, Form, Select, InputNumber, Button, Progress, Alert, Typography } from 'antd';

const { Text } = Typography;

interface TensoParamsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TensoParamsModal({ open, onClose }: TensoParamsModalProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const startCalc = () => {
    setStep(1);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setStep(2); return 100; }
        return p + Math.random() * 10 + 5;
      });
    }, 300);
  };

  return (
    <Modal
      title="Расчёт тензопараметров"
      open={open}
      onCancel={() => { setStep(0); setProgress(0); onClose(); }}
      footer={null}
      width={480}
    >
      {step === 0 && (
        <Form layout="vertical">
          <Form.Item label="Библиотека">
            <Select options={[
              { value: 'lib_tenso_std', label: 'Тензо-стандарт v2.1' },
              { value: 'lib_tenso_high', label: 'Тензо-высокоточная v1.0' },
            ]} />
          </Form.Item>
          <Form.Item label="Тип датчика">
            <Select options={[
              { value: 'strain_gauge', label: 'Тензорезистор' },
              { value: 'piezo', label: 'Пьезодатчик' },
              { value: 'capacitive', label: 'Ёмкостный' },
            ]} />
          </Form.Item>
          <Form.Item label="Коэффициент чувствительности">
            <InputNumber min={0.1} step={0.01} defaultValue={2.1} />
          </Form.Item>
          <Form.Item label="Напряжение питания (В)">
            <InputNumber min={1} max={24} defaultValue={10} />
          </Form.Item>
          <Form.Item label="Входные параметры">
            <Select mode="multiple" options={['Параметр_001', 'Параметр_002', 'Параметр_010', 'Параметр_020'].map(p => ({ value: p, label: p }))} />
          </Form.Item>
          <Button type="primary" onClick={startCalc}>Рассчитать</Button>
        </Form>
      )}
      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Progress percent={Math.min(Math.round(progress), 100)} status="active" style={{ maxWidth: 400, margin: '0 auto 16px' }} />
          <Text type="secondary">Расчёт тензопараметров... {Math.round(progress)}%</Text>
        </div>
      )}
      {step === 2 && (
        <Alert type="success" showIcon message="Расчёт завершён" description="Тензопараметры рассчитаны и добавлены в рабочую область." action={<Button size="small" onClick={() => { setStep(0); setProgress(0); onClose(); }}>Закрыть</Button>} />
      )}
    </Modal>
  );
}
