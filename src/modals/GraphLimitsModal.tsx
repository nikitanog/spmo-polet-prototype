import { useState } from 'react';
import { Modal, List, InputNumber, Switch, Button, Typography, Space, Tag } from 'antd';
import { useGraphStore } from '../stores/useGraphStore';

const { Text } = Typography;

interface GraphLimitsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GraphLimitsModal({ open, onClose }: GraphLimitsModalProps) {
  const { functions, updateFunction } = useGraphStore();
  const [localFuncs, setLocalFuncs] = useState(
    functions.map((f) => ({ id: f.id, paramName: f.paramName, autoMin: true, autoMax: true, min: 0, max: 100 }))
  );

  const handleApply = () => {
    localFuncs.forEach((l) => {
      updateFunction(l.id, { baseline: l.autoMin ? 0 : l.min });
    });
    onClose();
  };

  return (
    <Modal
      title="Пределы функции"
      open={open}
      onCancel={onClose}
      onOk={handleApply}
      okText="Применить"
      cancelText="Отмена"
      width={550}
    >
      {functions.length === 0 ? (
        <Text type="secondary">Нет добавленных функций</Text>
      ) : (
        <List
          size="small"
          dataSource={functions}
          renderItem={(fn) => {
            const local = localFuncs.find((l) => l.id === fn.id);
            return (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <Space style={{ marginBottom: 8 }}>
                    <Tag color="blue">{fn.paramName}</Tag>
                  </Space>
                  <Space style={{ width: '100%' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Авто мин</Text>
                      <Switch
                        size="small"
                        checked={local?.autoMin ?? true}
                        onChange={(v) => setLocalFuncs((prev) => prev.map((l) => l.id === fn.id ? { ...l, autoMin: v } : l))}
                      />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Мин</Text>
                      <InputNumber
                        size="small"
                        disabled={local?.autoMin}
                        value={local?.min ?? 0}
                        onChange={(v) => setLocalFuncs((prev) => prev.map((l) => l.id === fn.id ? { ...l, min: v ?? 0 } : l))}
                        style={{ width: 80 }}
                      />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Авто макс</Text>
                      <Switch
                        size="small"
                        checked={local?.autoMax ?? true}
                        onChange={(v) => setLocalFuncs((prev) => prev.map((l) => l.id === fn.id ? { ...l, autoMax: v } : l))}
                      />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Макс</Text>
                      <InputNumber
                        size="small"
                        disabled={local?.autoMax}
                        value={local?.max ?? 100}
                        onChange={(v) => setLocalFuncs((prev) => prev.map((l) => l.id === fn.id ? { ...l, max: v ?? 100 } : l))}
                        style={{ width: 80 }}
                      />
                    </div>
                  </Space>
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
}
