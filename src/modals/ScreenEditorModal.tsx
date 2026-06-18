import { Modal, List, Tag, Button, Typography, Space, Empty } from 'antd';
import { DeleteOutlined, BarChartOutlined, TableOutlined, CameraOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ScreenWindow {
  type: 'graph' | 'table' | 'video' | 'map';
  params: string[];
}

interface ScreenEditorModalProps {
  open: boolean;
  screen: { id: string; name: string; windows: ScreenWindow[] };
  onClose: () => void;
}

const windowTypeMeta: Record<string, { icon: React.ReactNode; label: string }> = {
  graph: { icon: <BarChartOutlined />, label: 'График' },
  table: { icon: <TableOutlined />, label: 'Таблица' },
  video: { icon: <CameraOutlined />, label: 'Видео' },
  map: { icon: <EnvironmentOutlined />, label: 'Карта' },
};

const availableTypes = [
  { type: 'graph', label: 'График', desc: 'Временной ряд выбранных параметров' },
  { type: 'table', label: 'Таблица', desc: 'Таблица значений параметров' },
  { type: 'video', label: 'Видео', desc: 'Видеопоток с камеры' },
  { type: 'map', label: 'Карта', desc: 'Схема/карта с объектами' },
];

export default function ScreenEditorModal({ open, screen, onClose }: ScreenEditorModalProps) {
  return (
    <Modal
      title={`Редактор экрана: ${screen.name}`}
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Закрыть</Button>}
      width={500}
    >
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Рабочие окна</Text>
      {screen.windows.length === 0 ? (
        <Empty description="Нет окон" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          size="small"
          dataSource={screen.windows}
          renderItem={(w, idx) => {
            const meta = windowTypeMeta[w.type] || { icon: null, label: w.type };
            return (
              <List.Item
                actions={[<Button key="del" size="small" danger icon={<DeleteOutlined />} />]}
              >
                <Space>
                  {meta.icon}
                  <Text>{meta.label} {idx + 1}</Text>
                  <Tag>{w.params.length} параметров</Tag>
                </Space>
              </List.Item>
            );
          }}
        />
      )}

      <Text strong style={{ display: 'block', margin: '12px 0 8px' }}>Добавить окно</Text>
      <Space wrap>
        {availableTypes.map((t) => (
          <Button key={t.type} icon={windowTypeMeta[t.type]?.icon} size="small">
            {t.label}
          </Button>
        ))}
      </Space>
    </Modal>
  );
}
