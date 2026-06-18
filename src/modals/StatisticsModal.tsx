import { Modal, Table, Typography, Select, Space, Button } from 'antd';

const { Text } = Typography;

const mockStats = [
  { key: '1', param: 'Параметр_001', min: 12.345, max: 87.654, avg: 45.123, sko: 15.678, range: 75.309 },
  { key: '2', param: 'Параметр_002', min: 0.012, max: 1.045, avg: 0.523, sko: 0.234, range: 1.033 },
  { key: '3', param: 'Параметр_010', min: 234.5, max: 876.3, avg: 567.8, sko: 123.4, range: 641.8 },
  { key: '4', param: 'Параметр_020', min: 45.0, max: 156.0, avg: 98.7, sko: 23.4, range: 111.0 },
  { key: '5', param: 'Параметр_030', min: 0.015, max: 0.089, avg: 0.047, sko: 0.016, range: 0.074 },
  { key: '6', param: 'Параметр_050', min: 450.0, max: 1200.0, avg: 812.5, sko: 187.3, range: 750.0 },
];

const columns = [
  { title: 'Параметр', dataIndex: 'param', key: 'param' },
  { title: 'Min', dataIndex: 'min', key: 'min', render: (v: number) => v.toFixed(3) },
  { title: 'Max', dataIndex: 'max', key: 'max', render: (v: number) => v.toFixed(3) },
  { title: 'Среднее', dataIndex: 'avg', key: 'avg', render: (v: number) => v.toFixed(3) },
  { title: 'СКО', dataIndex: 'sko', key: 'sko', render: (v: number) => v.toFixed(3) },
  { title: 'Размах', dataIndex: 'range', key: 'range', render: (v: number) => v.toFixed(3) },
];

interface StatisticsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StatisticsModal({ open, onClose }: StatisticsModalProps) {
  return (
    <Modal
      title="Статистика параметров"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Закрыть</Button>}
      width={660}
    >
      <Space style={{ marginBottom: 12 }}>
        <Text>Параметры:</Text>
        <Select mode="multiple" defaultValue={['Параметр_001', 'Параметр_002', 'Параметр_010', 'Параметр_020', 'Параметр_030', 'Параметр_050']} style={{ minWidth: 360 }} options={[
          'Параметр_001', 'Параметр_002', 'Параметр_003', 'Параметр_010', 'Параметр_020',
          'Параметр_030', 'Параметр_050', 'Параметр_100', 'Параметр_110', 'Параметр_120',
        ].map(p => ({ value: p, label: p }))} />
        <Button type="primary">Рассчитать</Button>
      </Space>
      <Table dataSource={mockStats} columns={columns} size="small" pagination={false} />
    </Modal>
  );
}
