import { useState } from 'react';
import { Modal, Form, Select, Input, Button, Progress, Alert, Typography, Space, Tag } from 'antd';
import { CalculatorOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface CalcParamsModalProps {
  open: boolean;
  onClose: () => void;
}

const operators = ['+', '-', '*', '/', 'sin', 'cos', 'log', 'int', 'diff', 'sqrt', 'abs', 'pow'];

export default function CalcParamsModal({ open, onClose }: CalcParamsModalProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formula, setFormula] = useState('');

  const startCalc = () => {
    setStep(1);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setStep(2); return 100; }
        return p + Math.random() * 15 + 5;
      });
    }, 300);
  };

  return (
    <Modal
      title="Расчётные параметры"
      open={open}
      onCancel={() => { setStep(0); setProgress(0); onClose(); }}
      footer={null}
      width={560}
    >
      {step === 0 && (
        <>
          <Form layout="vertical">
            <Form.Item label="Имя расчётного параметра">
              <Input placeholder="Например: P_расч_001" />
            </Form.Item>
            <Form.Item label="Формула">
              <Input.TextArea rows={3} value={formula} onChange={e => setFormula(e.target.value)} placeholder="A + B * 2, sin(Параметр_001), int(Параметр_002)" />
            </Form.Item>
            <Form.Item label="Входные параметры">
              <Select mode="multiple" placeholder="Выберите параметры" options={['Параметр_001', 'Параметр_002', 'Параметр_010', 'Параметр_020', 'Параметр_030', 'Параметр_050'].map(p => ({ value: p, label: p }))} />
            </Form.Item>
          </Form>
          <div style={{ marginBottom: 12 }}>
            <Text strong>Доступные операторы: </Text>
            <Space wrap size={[4, 4]}>
              {operators.map(op => <Tag key={op} style={{ cursor: 'pointer' }} onClick={() => setFormula(f => f + ' ' + op + ' ')}>{op}</Tag>)}
            </Space>
          </div>
          <Space>
            {formula && <Text type="secondary"><CheckCircleOutlined style={{ color: '#52c41a' }} /> Формула: {formula}</Text>}
          </Space>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" icon={<CalculatorOutlined />} onClick={startCalc} disabled={!formula}>Рассчитать</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setFormula('')}>Очистить</Button>
          </div>
        </>
      )}
      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Progress percent={Math.min(Math.round(progress), 100)} status="active" style={{ maxWidth: 400, margin: '0 auto 16px' }} />
          <Text type="secondary">Расчёт... {Math.round(progress)}%</Text>
        </div>
      )}
      {step === 2 && (
        <Alert type="success" showIcon message="Расчёт завершён" description={`Параметр «${formula.split(' ')[0] || 'P_расч'}» добавлен в рабочую область.`} action={<Button size="small" onClick={() => { setStep(0); setProgress(0); onClose(); }}>Закрыть</Button>} />
      )}
    </Modal>
  );
}
