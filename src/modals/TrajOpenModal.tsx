import { useState } from 'react';
import { Modal, Select, Button, Typography, Alert, Empty, Space } from 'antd';
import { useAppStore } from '../stores/useAppStore';

const { Text } = Typography;

interface TrajOpenModalProps {
  open: boolean;
  onClose: () => void;
}

const mockFiles = [
  { value: 'trj-1', label: 'flight_001.trj', size: '12.4 МБ', date: '2026-06-15' },
  { value: 'trj-2', label: 'flight_002.trj', size: '8.7 МБ', date: '2026-06-14' },
  { value: 'trj-none', label: 'flight_003.trj', size: '15.1 МБ', date: '2026-06-10' },
  { value: 'trj-none2', label: 'calibration_run.trj', size: '3.2 МБ', date: '2026-05-28' },
];

export default function TrajOpenModal({ open, onClose }: TrajOpenModalProps) {
  const { setActiveTrajectory, trajectories } = useAppStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (!selected) return;
    const knownTraj = trajectories.find((t) => t.id === selected);
    if (knownTraj) {
      setActiveTrajectory(selected);
    } else {
      setActiveTrajectory(trajectories[0].id);
    }
    setOpened(true);
  };

  const handleClose = () => {
    setSelected(null);
    setOpened(false);
    onClose();
  };

  const selectedFile = mockFiles.find((f) => f.value === selected);

  return (
    <Modal
      title="Открыть файл траектории"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
    >
      {!opened ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Выберите файл траектории (*.trj) для открытия:</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Найти файл..."
            showSearch
            value={selected}
            onChange={setSelected}
            options={mockFiles.map((f) => ({
              value: f.value,
              label: `${f.label} (${f.size}, ${f.date})`,
            }))}
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={<Empty description="Файлы не найдены" />}
          />
          {selectedFile && (
            <Alert
              type="info"
              showIcon
              message={selectedFile.label}
              description={`Размер: ${selectedFile.size}, Дата: ${selectedFile.date}`}
            />
          )}
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" onClick={handleOpen} disabled={!selected}>
              Открыть
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Траектория открыта"
          description={`Файл ${selectedFile?.label} загружен. Используйте меню для работы с траекторией.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
