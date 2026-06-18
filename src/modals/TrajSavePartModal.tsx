import { useState } from 'react';
import { Modal, InputNumber, Input, Button, Alert, Typography, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TrajSavePartModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TrajSavePartModal({ open, onClose }: TrajSavePartModalProps) {
  const [timeFrom, setTimeFrom] = useState<number>(0);
  const [timeTo, setTimeTo] = useState<number>(2999);
  const [fileName, setFileName] = useState('traj_part');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (timeTo <= timeFrom) return;
    setSaved(true);
  };

  const handleClose = () => {
    setTimeFrom(0);
    setTimeTo(2999);
    setFileName('traj_part');
    setSaved(false);
    onClose();
  };

  return (
    <Modal
      title="Сохранить часть траектории"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {!saved ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Интервал сохранения</Text>
            <Space>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>От (отсчёт)</Text>
                <InputNumber
                  min={0}
                  max={2999}
                  value={timeFrom}
                  onChange={(v) => setTimeFrom(v ?? 0)}
                  style={{ width: 120 }}
                />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>До (отсчёт)</Text>
                <InputNumber
                  min={0}
                  max={2999}
                  value={timeTo}
                  onChange={(v) => setTimeTo(v ?? 2999)}
                  style={{ width: 120 }}
                />
              </div>
            </Space>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Имя файла</Text>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              addonAfter=".trj"
              placeholder="Имя файла"
            />
          </div>
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              disabled={timeTo <= timeFrom || !fileName.trim()}
            >
              Сохранить
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Часть траектории сохранена"
          description={`Файл ${fileName}.trj (интервал ${timeFrom}–${timeTo}) сохранён.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
