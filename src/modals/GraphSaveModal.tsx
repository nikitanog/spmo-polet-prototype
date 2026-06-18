import { useState } from 'react';
import { Modal, Input, Select, Button, Alert, Typography, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface GraphSaveModalProps {
  open: boolean;
  onClose: () => void;
}

const formatOptions = [
  { value: '.png', label: 'PNG (.png)' },
  { value: '.svg', label: 'SVG (.svg)' },
  { value: '.pdf', label: 'PDF (.pdf)' },
  { value: '.grf', label: 'Файл графика (.grf)' },
];

export default function GraphSaveModal({ open, onClose }: GraphSaveModalProps) {
  const [fileName, setFileName] = useState('graph');
  const [format, setFormat] = useState('.png');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!fileName.trim()) return;
    setSaved(true);
  };

  const handleClose = () => {
    setFileName('graph');
    setFormat('.png');
    setSaved(false);
    onClose();
  };

  return (
    <Modal
      title="Сохранить график"
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
          message="График сохранён"
          description={`Файл ${fileName}${format} сохранён.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
