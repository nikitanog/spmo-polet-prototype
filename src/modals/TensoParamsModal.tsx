import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Select, InputNumber, Button, Progress, Alert, Typography, Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGraphStore } from '../stores/useGraphStore';

const { Text } = Typography;

interface TensoParamsModalProps {
  open: boolean;
  onClose: () => void;
}

const mockTensoResults = [
  { id: 'tnz_001', name: 'Деформация_осевая', value: 0.042, unit: 'мм/мм' },
  { id: 'tnz_002', name: 'Деформация_поперечная', value: -0.015, unit: 'мм/мм' },
  { id: 'tnz_003', name: 'Напряжение_продольное', value: 126.5, unit: 'МПа' },
  { id: 'tnz_004', name: 'Напряжение_касательное', value: 34.2, unit: 'МПа' },
  { id: 'tnz_005', name: 'Коэффициент_Пуассона', value: 0.31, unit: '' },
  { id: 'tnz_006', name: 'Модуль_упругости', value: 2.1e5, unit: 'МПа' },
];

export default function TensoParamsModal({ open, onClose }: TensoParamsModalProps) {
  const navigate = useNavigate();
  const { addFunction } = useGraphStore();
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
            <Select mode="multiple" options={['V_приборная_км_ч', 'V_истинная_км_ч', 'Крен_град', 'Тангаж_град'].map(p => ({ value: p, label: p }))} />
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
        <div>
          <Alert type="success" showIcon message="Расчёт завершён" description="Тензопараметры рассчитаны." style={{ marginBottom: 12 }} />
          <Text strong>Результаты:</Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, marginBottom: 12 }}>
            {mockTensoResults.map((r) => (
              <Tag key={r.id} color="purple" style={{ fontSize: 12, padding: '2px 8px' }}>
                {r.name}: {r.value}{r.unit ? ` ${r.unit}` : ''}
              </Tag>
            ))}
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              mockTensoResults.forEach((r) => {
                addFunction({
                  id: `tnz-${r.id}`,
                  paramName: r.name,
                  color: '#722ed1',
                  thickness: 1.5,
                  lineType: 'solid',
                  scale: 'left',
                  baseline: 0,
                  visible: true,
                });
              });
              message.success(`${mockTensoResults.length} тензопараметров добавлены на график`);
              setStep(0);
              setProgress(0);
              onClose();
              navigate('/');
            }}>
              Добавить на график
            </Button>
            <Button onClick={() => { setStep(0); setProgress(0); onClose(); }}>Закрыть</Button>
          </Space>
        </div>
      )}
    </Modal>
  );
}
