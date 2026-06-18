import { useState } from 'react';
import { Modal, Select, Button, Alert, Typography, Space } from 'antd';

const { Text } = Typography;

interface TaskLoadModalProps {
  open: boolean;
  onClose: () => void;
}

const mockTaskFiles = [
  { value: 'task1', label: 'filter_tasks.tsk', size: '2.1 КБ', date: '2026-06-15' },
  { value: 'task2', label: 'spectrum_analysis.tsk', size: '1.5 КБ', date: '2026-06-14' },
  { value: 'task3', label: 'batch_calibration.tsk', size: '4.3 КБ', date: '2026-06-10' },
  { value: 'task4', label: 'tenso_params.tsk', size: '0.8 КБ', date: '2026-05-28' },
];

export default function TaskLoadModal({ open, onClose }: TaskLoadModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    if (!selected) return;
    setLoaded(true);
  };

  const handleClose = () => {
    setSelected(null);
    setLoaded(false);
    onClose();
  };

  const selectedFile = mockTaskFiles.find((f) => f.value === selected);

  return (
    <Modal
      title="Загрузить задание"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
    >
      {!loaded ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Выберите файл задания (*.tsk):</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Найти файл..."
            showSearch
            value={selected}
            onChange={setSelected}
            options={mockTaskFiles.map((f) => ({
              value: f.value,
              label: `${f.label} (${f.size}, ${f.date})`,
            }))}
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
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
            <Button type="primary" onClick={handleLoad} disabled={!selected}>
              Загрузить
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Задание загружено"
          description={`Файл ${selectedFile?.label} загружен. Задачи доступны в разделе «Вторичная обработка».`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
