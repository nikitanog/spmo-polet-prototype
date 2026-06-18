import { useState, useMemo } from 'react';
import { Modal, Select, InputNumber, Button, Typography, Space, Tag } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { mockParams } from '../mock-data';

const { Text } = Typography;

interface TableSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TableSettingsModal({ open, onClose }: TableSettingsModalProps) {
  const [selectedCols, setSelectedCols] = useState<string[]>(
    mockParams.slice(0, 5).map((p) => p.id)
  );
  const [stepSize, setStepSize] = useState(10);
  const [numberFormat, setNumberFormat] = useState('0.00');

  const paramOptions = useMemo(
    () => mockParams.map((p) => ({ value: p.id, label: `${p.name} (${p.type})` })),
    []
  );

  const formatOptions = [
    { value: '0.00', label: 'Два знака (0.00)' },
    { value: '0.0', label: 'Один знак (0.0)' },
    { value: '0', label: 'Целое (0)' },
    { value: '0.000', label: 'Три знака (0.000)' },
    { value: '0.000e+0', label: 'Научный' },
  ];

  const handleApply = () => {
    onClose();
  };

  return (
    <Modal
      title="Настройка таблицы"
      open={open}
      onCancel={onClose}
      onOk={handleApply}
      okText="Применить"
      cancelText="Отмена"
      width={500}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Колонки параметров</Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Выберите параметры"
            value={selectedCols}
            onChange={setSelectedCols}
            options={paramOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
          />
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              Выбрано: {selectedCols.length} из {mockParams.length}
            </Text>
          </div>
        </div>
        <Space>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Шаг дискретизации</Text>
            <InputNumber
              min={1}
              max={1000}
              value={stepSize}
              onChange={(v) => setStepSize(v ?? 10)}
              addonAfter="отсчётов"
              style={{ width: 180 }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Формат чисел</Text>
            <Select value={numberFormat} onChange={setNumberFormat} options={formatOptions} style={{ width: 160 }} />
          </div>
        </Space>
        <div>
          <Text type="secondary">
            Итого строк: ~{Math.floor(3000 / stepSize)} · колонок: {selectedCols.length + 1} (включая время)
          </Text>
        </div>
      </div>
    </Modal>
  );
}
