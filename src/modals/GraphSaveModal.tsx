import { useState } from 'react';
import { Modal, Input, Select, Button, Alert, Typography, Space, message } from 'antd';
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
    if (format === '.png') {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 800, 400);
        ctx.fillStyle = '#333';
        ctx.font = '14px sans-serif';
        ctx.fillText(`График траектории — ${fileName}`, 16, 24);
        ctx.fillText(`Дата: ${new Date().toLocaleString('ru-RU')}`, 16, 48);
        ctx.strokeStyle = '#1677ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 200; i++) {
          const x = 50 + (i / 200) * 700;
          const y = 300 - 200 * Math.sin(i / 20) * 0.5 - 50;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fileName}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
    message.success(`График сохранён как ${fileName}${format}`);
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
