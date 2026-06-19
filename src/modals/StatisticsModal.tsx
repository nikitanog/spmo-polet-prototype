import { Modal, Table, Typography, Select, Space, Button } from 'antd';

const { Text } = Typography;

const mockStats = [
  { key: '1', param: 'V_приборная_км_ч', min: 12.345, max: 87.654, avg: 45.123, sko: 15.678, range: 75.309 },
  { key: '2', param: 'V_истинная_км_ч', min: 0.012, max: 1.045, avg: 0.523, sko: 0.234, range: 1.033 },
  { key: '3', param: 'Крен_град', min: 234.5, max: 876.3, avg: 567.8, sko: 123.4, range: 641.8 },
  { key: '4', param: 'Тангаж_град', min: 45.0, max: 156.0, avg: 98.7, sko: 23.4, range: 111.0 },
  { key: '5', param: 'Расход_топлива_кг_ч', min: 0.015, max: 0.089, avg: 0.047, sko: 0.016, range: 0.074 },
  { key: '6', param: 'Темп_1_двиг_C', min: 450.0, max: 1200.0, avg: 812.5, sko: 187.3, range: 750.0 },
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
        <Select mode="multiple" defaultValue={['V_приборная_км_ч', 'V_истинная_км_ч', 'Крен_град', 'Тангаж_град', 'Расход_топлива_кг_ч', 'Темп_1_двиг_C']} style={{ minWidth: 360 }} options={[
          'V_приборная_км_ч', 'V_истинная_км_ч', 'H_барометрическая_м', 'Крен_град', 'Тангаж_град',
          'Расход_топлива_кг_ч', 'Темп_1_двиг_C', 'Напряжение_БС_В', 'Уровень_сигнала_ТМ_дБ', 'Обороты_1_двиг_об_мин',
        ].map(p => ({ value: p, label: p }))} />
        <Button type="primary">Рассчитать</Button>
      </Space>
      <Table dataSource={mockStats} columns={columns} size="small" pagination={false} />
    </Modal>
  );
}
