import { useState } from 'react';
import { Modal, Input, Select, Button, Alert, Typography, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useScreenStore } from '../stores/useScreenStore';

const { Text } = Typography;

interface ScreenSaveModalProps {
  open: boolean;
  screenName: string;
  onClose: () => void;
}

const formatOptions = [
  { value: '.scr', label: 'Файл экрана (*.scr)' },
  { value: '.wdw', label: 'Файл окон (*.wdw)' },
];

export default function ScreenSaveModal({ open, screenName, onClose }: ScreenSaveModalProps) {
  const [fileName, setFileName] = useState(screenName || 'screen');
  const [format, setFormat] = useState('.scr');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!fileName.trim()) return;
    const screen = useScreenStore.getState().screens.find(s => s.name === screenName);
    if (screen) {
      localStorage.setItem(`scr_${fileName}`, JSON.stringify(screen));
    }
    setSaved(true);
  };

  const handleClose = () => {
    setFileName(screenName || 'screen');
    setFormat('.scr');
    setSaved(false);
    onClose();
  };

  return (
    <Modal
      title="Сохранить экран"
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
              addonAfter={format}
              placeholder="Имя файла"
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Формат</Text>
            <Select
              style={{ width: '100%' }}
              value={format}
              onChange={setFormat}
              options={formatOptions}
            />
          </div>
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
          message="Экран сохранён"
          description={`Файл ${fileName}${format} сохранён.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
