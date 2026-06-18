import { useState } from 'react';
import { Modal, Input, Select, Button, Alert, Typography, Space } from 'antd';
import { useAppStore } from '../stores/useAppStore';

const { Text } = Typography;

interface CreateObjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateObjectModal({ open, onClose }: CreateObjectModalProps) {
  const { addObject, themes } = useAppStore();
  const [name, setName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    if (!name.trim() || !selectedTopic) return;
    addObject(selectedTopic, name.trim());
    setName('');
    setSelectedTopic(null);
    setCreated(true);
  };

  const handleClose = () => {
    setName('');
    setSelectedTopic(null);
    setCreated(false);
    onClose();
  };

  return (
    <Modal
      title="Создать объект"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {!created ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Тема</Text>
            <Select
              style={{ width: '100%' }}
              placeholder="Выберите тему"
              value={selectedTopic}
              onChange={setSelectedTopic}
              options={themes.map((t) => ({ value: t.id, label: t.name }))}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Имя объекта</Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Борт 005"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
            />
          </div>
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" onClick={handleCreate} disabled={!name.trim() || !selectedTopic}>
              Создать
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Объект создан"
          description={`Объект «${name}» добавлен в тему.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
