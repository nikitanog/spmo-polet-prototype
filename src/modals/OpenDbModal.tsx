import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Select, Button, Alert, Typography, Space } from 'antd';

const { Text } = Typography;

interface OpenDbModalProps {
  open: boolean;
  onClose: () => void;
}

const mockDbFiles = [
  { value: 'db_v52', label: 'sbis_db_v5.2.csv', size: '2.4 МБ', date: '2026-06-15' },
  { value: 'db_v53', label: 'sbis_db_v5.3.csv', size: '3.1 МБ', date: '2026-06-14' },
  { value: 'db_v49', label: 'sbis_db_v4.9.dbf', size: '5.7 МБ', date: '2026-05-20' },
  { value: 'db_calc', label: 'calc_params.db', size: '0.8 МБ', date: '2026-06-10' },
];

export default function OpenDbModal({ open, onClose }: OpenDbModalProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (!selected) return;
    setOpened(true);
    setTimeout(() => {
      setSelected(null);
      setOpened(false);
      onClose();
      navigate('/db');
    }, 800);
  };

  const handleClose = () => {
    setSelected(null);
    setOpened(false);
    onClose();
  };

  const selectedFile = mockDbFiles.find((f) => f.value === selected);

  return (
    <Modal
      title="Открыть базу данных СБИ"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
      destroyOnClose
    >
      {!opened ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Выберите файл базы данных (*.csv, *.dbf, *.db):</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Найти файл..."
            showSearch
            value={selected}
            onChange={setSelected}
            options={mockDbFiles.map((f) => ({
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
            <Button type="primary" onClick={handleOpen} disabled={!selected}>
              Открыть
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="База данных открыта"
          description={`Файл ${selectedFile?.label} загружен. Переход в раздел БД СБИ...`}
        />
      )}
    </Modal>
  );
}
