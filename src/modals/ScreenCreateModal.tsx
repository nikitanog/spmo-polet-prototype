import { useState } from 'react';
import { Modal, Input, Select, Button, Typography, Space } from 'antd';

const { Text } = Typography;

interface ScreenCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const templateOptions = [
  { value: 'empty', label: 'Пустой экран' },
  { value: 'default', label: 'Стандартный (график + таблица)' },
  { value: 'fullscreen', label: 'Полноэкранный график' },
  { value: 'monitor', label: 'Мониторинг (телеметрия + аварии)' },
];

export default function ScreenCreateModal({ open, onClose, onCreate }: ScreenCreateModalProps) {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('empty');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    setName('');
    setTemplate('empty');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setTemplate('empty');
    onClose();
  };

  return (
    <Modal
      title="Создать экран"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Имя экрана</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Основной экран"
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          />
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Шаблон</Text>
          <Select
            style={{ width: '100%' }}
            value={template}
            onChange={setTemplate}
            options={templateOptions}
          />
        </div>
        <Space style={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleClose}>Отмена</Button>
          <Button type="primary" onClick={handleCreate} disabled={!name.trim()}>
            Создать
          </Button>
        </Space>
      </div>
    </Modal>
  );
}
