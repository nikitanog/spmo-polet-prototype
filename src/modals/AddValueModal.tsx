import { useState } from 'react';
import { Modal, Select, Tag, Button, Alert, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { mockParams } from '../mock-data';

const { Text } = Typography;

interface AddValueModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddValueModal({ open, onClose }: AddValueModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  const paramOptions = mockParams.map((p) => ({ value: p.id, label: `${p.name} (${p.unit})` }));

  const handleAdd = () => {
    if (selected.length === 0) return;
    setAdded(true);
  };

  const handleClose = () => {
    setSelected([]);
    setAdded(false);
    onClose();
  };

  const selectedParams = mockParams.filter((p) => selected.includes(p.id));

  return (
    <Modal
      title="Добавить значение"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
    >
      {!added ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Выберите параметры для отображения текущих значений на панели:</Text>
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
          {selected.length > 0 && (
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Выбрано:</Text>
              <div style={{ marginTop: 4 }}>
                {selectedParams.map((p) => (
                  <Tag key={p.id} color="blue">{p.name} ({p.unit})</Tag>
                ))}
              </div>
            </div>
          )}
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} disabled={selected.length === 0}>
              Добавить
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message={`Добавлено значений: ${selected.length}`}
          description={`Выбранные параметры отображаются на панели текущих значений.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
