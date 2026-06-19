import { useState } from 'react';
import { Modal, List, Tag, Button, Alert, Typography, Space, Checkbox } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface DbUpdateModalProps {
  open: boolean;
  onClose: () => void;
}

interface UpdateItem {
  id: string;
  param: string;
  type: 'calibration' | 'range' | 'add' | 'delete';
  description: string;
}

const mockUpdates: UpdateItem[] = [
  { id: 'u1', param: 'Параметр_001', type: 'calibration', description: 'Обновление градуировки (коэфф: 1.02 → 1.05)' },
  { id: 'u2', param: 'Параметр_050', type: 'range', description: 'Изменение диапазона: мин -100 → -120, макс 100 → 110' },
  { id: 'u3', param: 'Параметр_101', type: 'add', description: 'Добавление нового параметра' },
  { id: 'u4', param: 'Параметр_099', type: 'delete', description: 'Удаление устаревшего параметра' },
];

export default function DbUpdateModal({ open, onClose }: DbUpdateModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [updated, setUpdated] = useState(false);

  const handleUpdate = () => {
    setUpdated(true);
  };

  const handleClose = () => {
    setSelected([]);
    setUpdated(false);
    onClose();
  };

  const typeColor: Record<string, string> = {
    calibration: 'blue',
    range: 'orange',
    add: 'green',
    delete: 'red',
  };

  const typeLabel: Record<string, string> = {
    calibration: 'Градуировка',
    range: 'Диапазон',
    add: 'Добавление',
    delete: 'Удаление',
  };

  return (
    <Modal
      title="Обновить базу данных"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={550}
    >
      {!updated ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          <Alert
            type="info"
            showIcon
            message={`Доступно ${mockUpdates.length} обновлений`}
            description="Выберите обновления для применения:"
          />
          <List
            size="small"
            bordered
            dataSource={mockUpdates}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Checkbox
                    key="cb"
                    checked={selected.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelected((s) => [...s, item.id]);
                      else setSelected((s) => s.filter((id) => id !== item.id));
                    }}
                  />,
                ]}
              >
                <div>
                  <Space>
                    <Tag color={typeColor[item.type]}>{typeLabel[item.type]}</Tag>
                    <Text strong>{item.param}</Text>
                  </Space>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.description}</div>
                </div>
              </List.Item>
            )}
          />
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleUpdate}
              disabled={selected.length === 0}
            >
              Применить ({selected.length})
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="База данных обновлена"
          description={`Применено обновлений: ${selected.length}.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
