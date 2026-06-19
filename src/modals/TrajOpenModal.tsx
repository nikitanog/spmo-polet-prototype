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
  const { addTrajectory, setActiveTrajectory, trajectories } = useAppStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (!selected) return;
    const knownTraj = trajectories.find((t) => t.id === selected);
    if (knownTraj) {
      setActiveTrajectory(selected);
    } else {
      const params = ['V_ист', 'V_приб', 'V_верт', 'V_путевая', 'H_бар', 'H_отн_ЗП', 'M_число', 'УТ', 'α_атак', 'γ_крен', 'υ_тангаж', 'Ψ_курс', 'Vy_верт', 'n_x', 'n_y', 'n_z', 'РН', 'РВ', 'РЭ', 'a_прод', 'a_норм', 'a_бок', 'ω_x', 'ω_y', 'ω_z', 'G_топл', 'P_каб', 'T_каб', 'T_H_двиг', 'P_масл', 'T_масл', 't_пол', 't_ост', 'Fuel_расх', 'Fuel_ост', 'T_вх_двиг', 'P_вх_двиг', 'B_параш', 'Р_шв_носк', 'T_шв_носк', 'Полож_мех', 'У_закр_лев', 'У_закр_пр', 'Скор_верт', 'Угол_сн', 'Расх_топл_сум', 'T_выт_возд', 'Сигн_пож', 'V_приб_испр', 'H_бар_испр'];
      const count = 50;
      const data: Record<string, number[]> = {};
      params.forEach((p) => {
        data[p] = Array.from({ length: count }, () => Math.random() * 200 - 50);
      });
      addTrajectory({ id: selected, name: mockFiles.find((f) => f.value === selected)?.label || selected, params, data });
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
