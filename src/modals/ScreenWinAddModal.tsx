import { useState } from 'react';
import { Modal, Button, Typography, Space, message } from 'antd';
import { BarChartOutlined, TableOutlined, CameraOutlined, EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ScreenWinAddModalProps {
  open: boolean;
  onClose: () => void;
}

interface WinType {
  type: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
}

const winTypes: WinType[] = [
  { type: 'graph', label: 'График', icon: <BarChartOutlined style={{ fontSize: 32 }} />, desc: 'Временной ряд выбранных параметров' },
  { type: 'table', label: 'Таблица', icon: <TableOutlined style={{ fontSize: 32 }} />, desc: 'Таблица значений параметров' },
  { type: 'video', label: 'Видео', icon: <CameraOutlined style={{ fontSize: 32 }} />, desc: 'Видеопоток с камеры' },
  { type: 'map', label: 'Карта', icon: <EnvironmentOutlined style={{ fontSize: 32 }} />, desc: 'Схема расположения объектов' },
];

export default function ScreenWinAddModal({ open, onClose }: ScreenWinAddModalProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleAdd = () => {
    if (!selected) return;
    message.success(`Рабочее окно типа «${winTypes.find((w) => w.type === selected)?.label}» добавлено`);
    setSelected(null);
    onClose();
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Modal
      title="Добавить рабочее окно"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        <Text>Выберите тип рабочего окна для добавления на экран:</Text>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {winTypes.map((w) => (
            <div
              key={w.type}
              style={{
                border: selected === w.type ? '2px solid #1677ff' : '1px solid #d9d9d9',
                borderRadius: 6, padding: 16, cursor: 'pointer', textAlign: 'center',
                background: selected === w.type ? '#e6f4ff' : '#fafafa',
                transition: 'all 0.15s',
              }}
              onClick={() => setSelected(w.type)}
            >
              <div style={{ marginBottom: 8, color: selected === w.type ? '#1677ff' : '#888' }}>
                {w.icon}
              </div>
              <Text strong>{w.label}</Text>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{w.desc}</div>
            </div>
          ))}
        </div>
        <Space style={{ justifyContent: 'flex-end', marginTop: 8 }}>
          <Button onClick={handleClose}>Отмена</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} disabled={!selected}>
            Добавить
          </Button>
        </Space>
      </div>
    </Modal>
  );
}
