import { useState, useMemo } from 'react';
import { Modal, Tree, Input, Select, InputNumber, ColorPicker, Button, Typography, Space, Empty } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { mockParams } from '../mock-data';
import { useGraphStore } from '../stores/useGraphStore';

const { Text } = Typography;

interface AddFuncModalProps {
  open: boolean;
  onClose: () => void;
}

const lineTypeOptions = [
  { value: 'solid', label: 'Сплошная' },
  { value: 'dashed', label: 'Штриховая' },
  { value: 'dotted', label: 'Точечная' },
];

const scaleOptions = [
  { value: 'left', label: 'Левая шкала' },
  { value: 'right', label: 'Правая шкала' },
];

export default function AddFuncModal({ open, onClose }: AddFuncModalProps) {
  const { addFunction } = useGraphStore();
  const [searchText, setSearchText] = useState('');
  const [selectedParam, setSelectedParam] = useState<string | null>(null);
  const [color, setColor] = useState('#1677ff');
  const [thickness, setThickness] = useState(1.5);
  const [lineType, setLineType] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [scale, setScale] = useState<'left' | 'right'>('left');
  const [baseline, setBaseline] = useState(0);

  const treeData = useMemo(() => {
    const filtered = mockParams.filter((p) =>
      !searchText || p.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const types = [...new Set(filtered.map((p) => p.type))];
    return types.map((type) => ({
      title: type,
      key: type,
      children: filtered
        .filter((p) => p.type === type)
        .map((p) => ({ title: p.name, key: p.id, isLeaf: true })),
    }));
  }, [searchText]);

  const selectedParamMeta = mockParams.find((p) => p.id === selectedParam);

  const handleAdd = () => {
    if (!selectedParam || !selectedParamMeta) return;
    addFunction({
      id: `gf${Date.now()}`,
      paramName: selectedParamMeta.name,
      color,
      thickness,
      lineType,
      scale,
      baseline,
      visible: true,
    });
    setSelectedParam(null);
    setColor('#1677ff');
    onClose();
  };

  const handleClose = () => {
    setSearchText('');
    setSelectedParam(null);
    onClose();
  };

  return (
    <Modal
      title="Добавить функцию"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={550}
    >
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <div style={{ width: 240 }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Параметры</Text>
          <Input
            placeholder="Поиск..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ marginBottom: 8 }}
          />
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            <Tree
              treeData={treeData}
              selectedKeys={selectedParam ? [selectedParam] : []}
              onSelect={(keys) => {
                if (keys.length > 0) {
                  const key = keys[0] as string;
                  if (mockParams.some((p) => p.id === key)) setSelectedParam(key);
                }
              }}
              defaultExpandAll
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Настройки отображения</Text>
          {selectedParamMeta ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>Параметр</Text>
                <div><Text strong>{selectedParamMeta.name}</Text></div>
              </div>
              <Space>
                <ColorPicker value={color} onChange={(c) => setColor(c.toHexString())} />
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>Толщина</Text>
                  <InputNumber min={0.5} max={5} step={0.5} value={thickness} onChange={(v) => setThickness(v ?? 1.5)} style={{ width: 70 }} />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>Тип линии</Text>
                  <Select value={lineType} onChange={setLineType} options={lineTypeOptions} style={{ width: 120 }} />
                </div>
              </Space>
              <Space>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>Шкала</Text>
                  <Select value={scale} onChange={setScale} options={scaleOptions} style={{ width: 140 }} />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>Базовая линия</Text>
                  <InputNumber value={baseline} onChange={(v) => setBaseline(v ?? 0)} style={{ width: 80 }} />
                </div>
              </Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ alignSelf: 'flex-end' }}>
                Добавить на график
              </Button>
            </div>
          ) : (
            <Empty description="Выберите параметр слева" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </div>
    </Modal>
  );
}
