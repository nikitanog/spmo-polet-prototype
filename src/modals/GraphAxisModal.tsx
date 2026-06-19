import { useState, useEffect } from 'react';
import { Modal, Select, Alert, Typography } from 'antd';
import { useGraphStore } from '../stores/useGraphStore';

const { Text } = Typography;

interface GraphAxisModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GraphAxisModal({ open, onClose }: GraphAxisModalProps) {
  const { xAxisParam, setXAxisParam } = useGraphStore();
  const [local, setLocal] = useState<string | null>(xAxisParam);

  useEffect(() => {
    if (open) setLocal(xAxisParam);
  }, [open, xAxisParam]);

  const handleApply = () => {
    setXAxisParam(local);
    onClose();
  };

  const handleClose = () => {
    setLocal(xAxisParam);
    onClose();
  };

  const axisOptions = [
    { value: '', label: 'Время (по умолчанию)' },
    { value: 'V_приборная_км_ч', label: 'V_приборная_км_ч' },
    { value: 'V_истинная_км_ч', label: 'V_истинная_км_ч' },
    { value: 'Крен_град', label: 'Крен_град' },
  ];

  return (
    <Modal
      title="Свойства шкалы оси X"
      open={open}
      onCancel={handleClose}
      onOk={handleApply}
      okText="Применить"
      cancelText="Отмена"
      width={450}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Ось X</Text>
          <Select
            style={{ width: '100%' }}
            value={local}
            onChange={setLocal}
            options={axisOptions}
          />
        </div>
        <Alert
          type="info"
          showIcon
          message={local ? `Ось X: ${local}` : 'Ось X: время (отсчёты)'}
          description="Выберите параметр для отображения на оси X вместо времени."
        />
      </div>
    </Modal>
  );
}
