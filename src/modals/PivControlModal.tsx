import { Modal, Table, Tag, Button, Typography, Space } from 'antd';

const { Text } = Typography;

const pivBlocks = [
  { key: '1', name: 'ПИВ-01 (Борт 001)', type: 'БС-4000', status: 'online', ip: '192.168.1.100', channels: 8 },
  { key: '2', name: 'ПИВ-02 (Борт 001)', type: 'БС-4000', status: 'online', ip: '192.168.1.101', channels: 8 },
  { key: '3', name: 'ПИВ-03 (Борт 002)', type: 'БС-2000', status: 'offline', ip: '192.168.1.102', channels: 4 },
  { key: '4', name: 'ПИВ-04 (Борт 002)', type: 'БС-4000', status: 'error', ip: '192.168.1.103', channels: 8 },
  { key: '5', name: 'ПИВ-05 (Борт 003)', type: 'БС-2000', status: 'online', ip: '192.168.1.104', channels: 4 },
];

const columns = [
  { title: 'Блок', dataIndex: 'name', key: 'name' },
  { title: 'Тип', dataIndex: 'type', key: 'type' },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (s: string) => {
      const color = s === 'online' ? 'success' : s === 'offline' ? 'default' : 'error';
      return <Tag color={color}>{s === 'online' ? '🟢 Онлайн' : s === 'offline' ? '⚪ Офлайн' : '🔴 Ошибка'}</Tag>;
    },
  },
  { title: 'IP-адрес', dataIndex: 'ip', key: 'ip' },
  { title: 'Каналы', dataIndex: 'channels', key: 'channels' },
  { title: '', key: 'actions', render: () => <Button size="small">Диагностика</Button> },
];

interface PivControlModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PivControlModal({ open, onClose }: PivControlModalProps) {
  return (
    <Modal
      title="Управление ПИВ"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Закрыть</Button>}
      width={760}
    >
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Блоки сбора данных:</Text>
      <Table dataSource={pivBlocks} columns={columns} size="small" pagination={false} />
      <Space style={{ marginTop: 16 }}>
        <Button>Настроить выбранный</Button>
        <Button>Диагностика всех</Button>
      </Space>
      <div style={{ marginTop: 12, padding: 8, background: '#f6ffed', borderRadius: 4 }}>
        <Tag color="success">🟢</Tag> Подключено: 3 блока. <Tag>⚪</Tag> Офлайн: 1. <Tag color="error">🔴</Tag> Ошибка: 1.
      </div>
    </Modal>
  );
}
