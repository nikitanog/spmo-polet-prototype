import { useState } from 'react';
import { Modal, Form, Input, Button, Alert, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SampleModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SampleModal({ open, onClose }: SampleModalProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  const handleClose = () => {
    setSaved(false);
    onClose();
  };

  return (
    <Modal
      title="Работа с выборками"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {!saved ? (
        <Form layout="vertical">
          <Form.Item label="Имя файла выборки">
            <Input defaultValue="sample_001.smp" addonAfter=".smp" />
          </Form.Item>
          <Form.Item label="Описание">
            <Input.TextArea rows={3} placeholder="Описание выборки (опционально)" />
          </Form.Item>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Будут сохранены все установленные маркеры (текущий набор: 5 маркеров)
          </Text>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Сохранить</Button>
        </Form>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Выборка сохранена"
          description="Файл sample_001.smp содержит 5 маркированных точек."
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
