import { useState } from 'react';
import { Modal, Select, Input, Button, Alert, Typography, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TableExportModalProps {
  open: boolean;
  onClose: () => void;
}

const formatOptions = [
  { value: '.csv', label: 'CSV (.csv)' },
  { value: '.xlsx', label: 'Excel (.xlsx)' },
  { value: '.docx', label: 'Word (.docx)' },
];

export default function TableExportModal({ open, onClose }: TableExportModalProps) {
  const [fileName, setFileName] = useState('table_export');
  const [format, setFormat] = useState('.csv');
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    if (!fileName.trim()) return;
    setExported(true);
  };

  const handleClose = () => {
    setFileName('table_export');
    setFormat('.csv');
    setExported(false);
    onClose();
  };

  return (
    <Modal
      title="Сохранить таблицу"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {!exported ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Имя файла</Text>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              addonAfter={format}
              placeholder="Имя файла"
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Формат</Text>
            <Select
              style={{ width: '100%' }}
              value={format}
              onChange={setFormat}
              options={formatOptions}
            />
          </div>
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} disabled={!fileName.trim()}>
              Экспорт
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Таблица экспортирована"
          description={`Файл ${fileName}${format} сохранён (3000 строк × 10 колонок).`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
