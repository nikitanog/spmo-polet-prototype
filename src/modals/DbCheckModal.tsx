import { useState } from 'react';
import { Modal, Alert, Button, Typography, Space, List, Tag, Progress } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface DbCheckModalProps {
  open: boolean;
  onClose: () => void;
}

interface CheckResult {
  key: string;
  check: string;
  status: 'pass' | 'fail' | 'warn';
  detail: string;
}

const mockResults: CheckResult[] = [
  { key: 'c1', check: 'Целостность структуры БД', status: 'pass', detail: 'Все таблицы и индексы в порядке' },
  { key: 'c2', check: 'Уникальность идентификаторов', status: 'pass', detail: 'Дубликатов не найдено (120/120 уникальны)' },
  { key: 'c3', check: 'Границы диапазонов', status: 'warn', detail: 'n_z_g: мин > макс' },
  { key: 'c4', check: 'Ссылочная целостность', status: 'pass', detail: 'Все внешние ключи валидны' },
  { key: 'c5', check: 'Типы параметров', status: 'fail', detail: '3 параметра без указанного типа' },
];

export default function DbCheckModal({ open, onClose }: DbCheckModalProps) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setDone(true); }, 1200);
  };

  const handleClose = () => {
    setRunning(false);
    setDone(false);
    onClose();
  };

  const statusIcon = (s: string) =>
    s === 'pass' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
    s === 'fail' ? <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> :
    <CloseCircleOutlined style={{ color: '#faad14' }} />;

  const statusTag = (s: string) =>
    s === 'pass' ? <Tag color="success">Пройдено</Tag> :
    s === 'fail' ? <Tag color="error">Ошибка</Tag> :
    <Tag color="warning">Предупреждение</Tag>;

  return (
    <Modal
      title="Проверка базы данных СБИ"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={550}
    >
      {!done ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Проверка целостности и корректности базы данных.</Text>
          {running && <Progress percent={100} status="active" strokeColor="#1677ff" />}
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Закрыть</Button>
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleRun} loading={running}>
              {running ? 'Проверка...' : 'Запустить проверку'}
            </Button>
          </Space>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          <Alert
            type={mockResults.some((r) => r.status === 'fail') ? 'error' : mockResults.some((r) => r.status === 'warn') ? 'warning' : 'success'}
            showIcon
            message={`Проверка завершена: ${mockResults.filter((r) => r.status === 'pass').length} пройдено, ${mockResults.filter((r) => r.status === 'fail').length} ошибок, ${mockResults.filter((r) => r.status === 'warn').length} предупреждений`}
          />
          <List
            size="small"
            bordered
            dataSource={mockResults}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  {statusIcon(item.status)}
                  <Text strong>{item.check}</Text>
                  {statusTag(item.status)}
                </Space>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.detail}</div>
              </List.Item>
            )}
          />
          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Закрыть</Button>
          </Space>
        </div>
      )}
    </Modal>
  );
}
