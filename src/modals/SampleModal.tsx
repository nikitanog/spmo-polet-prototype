import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Alert, Typography, Space, message } from 'antd';
import { SaveOutlined, DesktopOutlined } from '@ant-design/icons';
import { useAppStore } from '../stores/useAppStore';

const { Text } = Typography;

interface SampleModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SampleModal({ open, onClose }: SampleModalProps) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [sampleName, setSampleName] = useState('sample_001');
  const trajectories = useAppStore((s) => s.trajectories);
  const markers = useAppStore((s) => s.markers);

  const handleSave = () => {
    setSaved(true);
  };

  const handleOpenOnWorkspace = () => {
    const newTraj = {
      id: `trj-sample-${Date.now()}`,
      name: `${sampleName}.smp`,
      params: trajectories[0]?.params || [],
      data: trajectories[0]?.data || {},
    };
    useAppStore.getState().addTrajectory(newTraj);
    message.success(`Выборка «${sampleName}.smp» открыта как траектория`);
    setSaved(false);
    onClose();
    navigate('/');
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
            <Input
              defaultValue="sample_001"
              addonAfter=".smp"
              onChange={(e) => setSampleName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Описание">
            <Input.TextArea rows={3} placeholder="Описание выборки (опционально)" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Text type="secondary">
              Будут сохранены все установленные маркеры (текущий набор: {markers.length} маркеров)
            </Text>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Сохранить</Button>
          </Form.Item>
        </Form>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Выборка сохранена"
          description={`Файл ${sampleName}.smp содержит ${markers.length} маркированных точек.`}
          action={
            <Space>
              <Button size="small" type="primary" icon={<DesktopOutlined />} onClick={handleOpenOnWorkspace}>
                Открыть в рабочем окне
              </Button>
              <Button size="small" onClick={handleClose}>Закрыть</Button>
            </Space>
          }
        />
      )}
    </Modal>
  );
}
