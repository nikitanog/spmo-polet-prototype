import { useState } from 'react';
import { Modal, Select, Button, Alert, Typography, Space } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { mockParams } from '../mock-data';
import { useGraphStore } from '../stores/useGraphStore';

const { Text } = Typography;

interface GraphAutoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GraphAutoModal({ open, onClose }: GraphAutoModalProps) {
  const { addFunction } = useGraphStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const paramOptions = mockParams.map((p) => ({ value: p.id, label: `${p.name} (${p.type})` }));

  const handleBuild = () => {
    if (selected.length === 0) return;
    const colors = ['#1677ff', '#ff4d4f', '#52c41a', '#faad14', '#722ed1', '#13c2c2'];
    selected.forEach((id, idx) => {
      const param = mockParams.find((p) => p.id === id);
      if (param) {
        addFunction({
          id: `gf${Date.now()}_${idx}`,
          paramName: param.name,
          color: colors[idx % colors.length],
          thickness: 1.5,
          lineType: 'solid',
          scale: 'left',
          baseline: 0,
          visible: true,
        });
      }
    });
    setDone(true);
  };

  const handleClose = () => {
    setSelected([]);
    setDone(false);
    onClose();
  };

  return (
    <Modal
      title="Автопостроение графика"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
    >
      {!done ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Выберите параметры для автоматического построения графика:</Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Выберите параметры..."
            value={selected}
            onChange={setSelected}
            options={paramOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
          />
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleBuild} disabled={selected.length === 0}>
              Построить
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message={`График построен (${selected.length} функций)`}
          description="Автоматический масштаб применён. Используйте зум для детального просмотра."
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
