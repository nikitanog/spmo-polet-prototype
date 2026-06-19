import { useState } from 'react';
import { Modal, Select, Table, Tag, Button, Alert, Typography, Space } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface DbCompareModalProps {
  open: boolean;
  onClose: () => void;
}

interface DiffRow {
  key: string;
  param: string;
  field: string;
  leftValue: string;
  rightValue: string;
  difference: 'modified' | 'added' | 'removed';
}

const mockDiffData: DiffRow[] = [
  { key: 'd1', param: 'Параметр_001', field: 'Мин', leftValue: '-100', rightValue: '-120', difference: 'modified' },
  { key: 'd2', param: 'Параметр_001', field: 'Макс', leftValue: '100', rightValue: '110', difference: 'modified' },
  { key: 'd3', param: 'Параметр_050', field: 'Ед.изм.', leftValue: 'м', rightValue: 'см', difference: 'modified' },
  { key: 'd4', param: 'Параметр_101', field: '—', leftValue: '—', rightValue: 'новый', difference: 'added' },
  { key: 'd5', param: 'Параметр_099', field: '—', leftValue: 'существующий', rightValue: '—', difference: 'removed' },
];

const mockDbOptions = [
  { value: 'db1', label: 'БД СБИ v5.2 (текущая)' },
  { value: 'db2', label: 'БД СБИ v5.3 (расчётная)' },
  { value: 'db3', label: 'БД СБИ v4.9 (архив)' },
];

export default function DbCompareModal({ open, onClose }: DbCompareModalProps) {
  const [leftDb, setLeftDb] = useState<string | null>(null);
  const [rightDb, setRightDb] = useState<string | null>(null);
  const [compared, setCompared] = useState(false);

  const handleCompare = () => {
    if (!leftDb || !rightDb) return;
    setCompared(true);
  };

  const handleClose = () => {
    setLeftDb(null);
    setRightDb(null);
    setCompared(false);
    onClose();
  };

  const columns = [
    { title: 'Параметр', dataIndex: 'param', key: 'param', width: 140 },
    { title: 'Поле', dataIndex: 'field', key: 'field', width: 100 },
    { title: 'Левая БД', dataIndex: 'leftValue', key: 'leftValue', width: 120 },
    { title: 'Правая БД', dataIndex: 'rightValue', key: 'rightValue', width: 120 },
    {
      title: 'Статус', dataIndex: 'difference', key: 'difference', width: 100,
      render: (v: string) => {
        const color = v === 'modified' ? 'orange' : v === 'added' ? 'green' : 'red';
        const label = v === 'modified' ? 'Изменён' : v === 'added' ? 'Добавлен' : 'Удалён';
        return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

  return (
    <Modal
      title="Сравнение баз данных"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
    >
      {!compared ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Выберите две базы данных для сравнения:</Text>
          <Space style={{ alignItems: 'flex-end' }}>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Первая БД</Text>
              <Select
                style={{ width: 240 }}
                placeholder="Выберите БД"
                value={leftDb}
                onChange={setLeftDb}
                options={mockDbOptions}
              />
            </div>
            <SwapOutlined style={{ marginBottom: 8, color: '#888' }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Вторая БД</Text>
              <Select
                style={{ width: 240 }}
                placeholder="Выберите БД"
                value={rightDb}
                onChange={setRightDb}
                options={mockDbOptions}
              />
            </div>
          </Space>
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" onClick={handleCompare} disabled={!leftDb || !rightDb || leftDb === rightDb}>
              Сравнить
            </Button>
          </Space>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          <Alert
            type="info"
            showIcon
            message={`Найдено ${mockDiffData.length} различий`}
            description={`${mockDiffData.filter(d => d.difference === 'modified').length} изменений, ${mockDiffData.filter(d => d.difference === 'added').length} добавлений, ${mockDiffData.filter(d => d.difference === 'removed').length} удалений`}
          />
          <Table
            dataSource={mockDiffData}
            columns={columns}
            size="small"
            pagination={false}
            bordered
          />
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Закрыть</Button>
          </Space>
        </div>
      )}
    </Modal>
  );
}
