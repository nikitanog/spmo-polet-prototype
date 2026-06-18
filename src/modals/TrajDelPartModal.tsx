import { useState } from 'react';
import { Modal, InputNumber, Button, Alert, Typography, Space } from 'antd';

const { Text } = Typography;

interface TrajDelPartModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TrajDelPartModal({ open, onClose }: TrajDelPartModalProps) {
  const [timeFrom, setTimeFrom] = useState<number>(0);
  const [timeTo, setTimeTo] = useState<number>(2999);
  const [step, setStep] = useState<'interval' | 'confirm' | 'done'>('interval');

  const handleNext = () => {
    if (timeTo <= timeFrom) return;
    setStep('confirm');
  };

  const handleDelete = () => {
    setStep('done');
  };

  const handleClose = () => {
    setTimeFrom(0);
    setTimeTo(2999);
    setStep('interval');
    onClose();
  };

  return (
    <Modal
      title="Удалить часть траектории"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {step === 'interval' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Выберите интервал для удаления:</Text>
          <Space>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>От (отсчёт)</Text>
              <InputNumber
                min={0}
                max={2999}
                value={timeFrom}
                onChange={(v) => setTimeFrom(v ?? 0)}
                style={{ width: 120 }}
              />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>До (отсчёт)</Text>
              <InputNumber
                min={0}
                max={2999}
                value={timeTo}
                onChange={(v) => setTimeTo(v ?? 2999)}
                style={{ width: 120 }}
              />
            </div>
          </Space>
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" onClick={handleNext} disabled={timeTo <= timeFrom} danger>
              Удалить
            </Button>
          </Space>
        </div>
      )}
      {step === 'confirm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Alert
            type="warning"
            showIcon
            message="Подтверждение удаления"
            description={`Вы уверены, что хотите удалить данные в интервале ${timeFrom}–${timeTo}? Это действие необратимо.`}
          />
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" onClick={handleDelete} danger>
              Подтвердить удаление
            </Button>
          </Space>
        </div>
      )}
      {step === 'done' && (
        <Alert
          type="success"
          showIcon
          message="Часть траектории удалена"
          description={`Интервал ${timeFrom}–${timeTo} удалён.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
