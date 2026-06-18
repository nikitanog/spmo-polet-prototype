import { useState } from 'react';
import { Modal, Input, Button, Alert, Typography, Space } from 'antd';
import { useAppStore } from '../stores/useAppStore';

const { Text } = Typography;

interface CreateTopicModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTopicModal({ open, onClose }: CreateTopicModalProps) {
  const { addTopic, themes } = useAppStore();
  const [name, setName] = useState('');
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    addTopic(name.trim());
    setName('');
    setCreated(true);
  };

  const handleClose = () => {
    setName('');
    setCreated(false);
    onClose();
  };

  return (
    <Modal
      title="Создать тему"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {!created ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Введите наименование новой темы:</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: ЛИ-2026"
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          />
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" onClick={handleCreate} disabled={!name.trim()}>
              Создать
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Тема создана"
          description={`Тема «${name}» добавлена в дерево объектов. Всего тем: ${themes.length}.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
