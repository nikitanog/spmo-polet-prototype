import { useState } from 'react';
import { Modal, Input, Button, Alert, Typography, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useTaskStore } from '../stores/useTaskStore';

const { Text } = Typography;

interface TaskSaveModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TaskSaveModal({ open, onClose }: TaskSaveModalProps) {
  const [fileName, setFileName] = useState('tasks');
  const [saved, setSaved] = useState(false);
  const tasks = useTaskStore((s) => s.tasks);

  const handleSave = () => {
    if (!fileName.trim()) return;
    const data = JSON.stringify(tasks, null, 2);
    localStorage.setItem(`tsk_${fileName}`, data);
    setSaved(true);
  };

  const handleClose = () => {
    setFileName('tasks');
    setSaved(false);
    onClose();
  };

  return (
    <Modal
      title="Сохранить задание"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {!saved ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Имя файла</Text>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              addonAfter=".tsk"
              placeholder="Имя файла"
            />
          </div>
          <Text type="secondary">
            Будут сохранены все задачи текущего сеанса ({tasks.length} шт.).
          </Text>
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} disabled={!fileName.trim()}>
              Сохранить
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Задание сохранено"
          description={`Файл ${fileName}.tsk сохранён (${tasks.length} задач).`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
