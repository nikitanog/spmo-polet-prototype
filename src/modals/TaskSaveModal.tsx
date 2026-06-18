import { useState } from 'react';
import { Modal, Input, Button, Alert, Typography, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TaskSaveModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TaskSaveModal({ open, onClose }: TaskSaveModalProps) {
  const [fileName, setFileName] = useState('tasks');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!fileName.trim()) return;
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
            Будут сохранены все задачи текущего сеанса.
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
          description={`Файл ${fileName}.tsk сохранён.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
