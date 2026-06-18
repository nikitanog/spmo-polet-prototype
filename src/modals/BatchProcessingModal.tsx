import { useState } from 'react';
import { Modal, Table, Button, Progress, Tag, Typography, Space, Alert } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

type FileStatus = 'pending' | 'running' | 'done' | 'error';

interface FileItem {
  key: string;
  name: string;
  size: string;
  status: FileStatus;
}

const mockFiles: FileItem[] = [
  { key: '1', name: 'flight_001.dat', size: '45.2 МБ', status: 'pending' },
  { key: '2', name: 'flight_002.dat', size: '38.7 МБ', status: 'pending' },
  { key: '3', name: 'flight_003.dat', size: '52.1 МБ', status: 'pending' },
  { key: '4', name: 'flight_004.dat', size: '41.5 МБ', status: 'pending' },
  { key: '5', name: 'flight_005.dat', size: '39.8 МБ', status: 'pending' },
];

const columns = [
  { title: 'Файл', dataIndex: 'name', key: 'name' },
  { title: 'Размер', dataIndex: 'size', key: 'size' },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (s: string) => {
      const color = s === 'done' ? 'success' : s === 'error' ? 'error' : s === 'running' ? 'processing' : 'default';
      const label = s === 'done' ? 'Готово' : s === 'error' ? 'Ошибка' : s === 'running' ? 'Выполняется' : 'Ожидает';
      return <Tag color={color}>{label}</Tag>;
    },
  },
];

interface BatchProcessingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BatchProcessingModal({ open, onClose }: BatchProcessingModalProps) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState(mockFiles);

  const startPipeline = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setRunning(false);
          setFiles(files.map((f, i) => ({ ...f, status: (i < 5 ? (i < 4 ? 'done' : 'error') : 'pending') as FileStatus })));
          return 100;
        }
        const doneCount = Math.floor(next / 20);
        setFiles(files.map((f, i) => ({ ...f, status: (i < doneCount ? 'done' : i === doneCount ? 'running' : 'pending') as FileStatus })));
        return next;
      });
    }, 500);
  };

  return (
    <Modal
      title="Пакетная пост-обработка"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Закрыть</Button>}
      width={640}
    >
      <Text strong>Выбранные файлы для обработки:</Text>
      <Table dataSource={files} columns={columns} size="small" pagination={false} style={{ marginTop: 8 }} />
      {running && (
        <Progress percent={Math.min(Math.round(progress), 100)} status="active" style={{ margin: '12px 0' }} />
      )}
      <Space style={{ marginTop: 12 }}>
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={startPipeline} disabled={running}>
          Запустить пайплайн
        </Button>
        <Button>Выбрать каталог...</Button>
      </Space>
      {!running && files.some(f => f.status === 'done') && (
        <Alert type="success" showIcon message="Обработка завершена" description="4/5 файлов обработано успешно, 1 ошибка." style={{ marginTop: 12 }} />
      )}
    </Modal>
  );
}
