import { useState } from 'react';
import { Modal, Select, Button, Progress, Alert, Typography, Divider } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useAppStore } from '../stores/useAppStore';

const { Text } = Typography;

interface TrajCalcModalProps {
  open: boolean;
  onClose: () => void;
}

const mockDbOptions = [
  { value: 'db1', label: 'БД СБИ v5.2 (ЛИ-2024)' },
  { value: 'db2', label: 'БД СБИ v5.3 (ЛИ-2025)' },
  { value: 'db3', label: 'БД СБИ v4.9 (Архив)' },
];

const mockFileOptions = [
  { value: 'f1', label: 'flight_001.dat' },
  { value: 'f2', label: 'flight_002.dat' },
  { value: 'f3', label: 'flight_003.dat' },
  { value: 'f4', label: 'calibration_run.dat' },
];

export default function TrajCalcModal({ open, onClose }: TrajCalcModalProps) {
  const { setActiveTrajectory, trajectories } = useAppStore();
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [calcProgress, setCalcProgress] = useState<number>(0);
  const [calcStatus, setCalcStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');

  const handleCalc = () => {
    if (!selectedDb || !selectedFile) return;
    setCalcStatus('running');
    setCalcProgress(0);

    const interval = setInterval(() => {
      setCalcProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCalcStatus('done');
          setActiveTrajectory(trajectories[0].id);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);
  };

  const handleClose = () => {
    setCalcStatus('idle');
    setCalcProgress(0);
    onClose();
  };

  return (
    <Modal
      title="Расчёт траектории"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>База данных</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Выберите БД СБИ"
            options={mockDbOptions}
            value={selectedDb}
            onChange={setSelectedDb}
            disabled={calcStatus === 'running'}
          />
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Файл с данными</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Выберите файл записи"
            options={mockFileOptions}
            value={selectedFile}
            onChange={setSelectedFile}
            disabled={calcStatus === 'running'}
          />
        </div>

        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleCalc}
          disabled={!selectedDb || !selectedFile || calcStatus === 'running'}
          loading={calcStatus === 'running'}
          block
        >
          {calcStatus === 'idle' ? 'Рассчитать' : calcStatus === 'running' ? 'Расчёт...' : 'Готово'}
        </Button>

        {calcStatus === 'running' && (
          <Progress percent={calcProgress} status="active" strokeColor="#1677ff" />
        )}

        {calcStatus === 'done' && (
          <Alert
            type="success"
            message="Расчёт завершён"
            description="Траектория flight_001 загружена. Перейдите к просмотру графиков."
            showIcon
          />
        )}

        {calcStatus === 'done' && (
          <Divider />
        )}
      </div>
    </Modal>
  );
}
