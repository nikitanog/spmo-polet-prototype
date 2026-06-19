import { Modal, List, Tag, Button, Typography, Space, Empty, Select, message } from 'antd';
import { DeleteOutlined, BarChartOutlined, TableOutlined, CameraOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useScreenStore } from '../stores/useScreenStore';
import { mockParams } from '../mock-data';
import type { ScreenWindow } from '../mock-data/types';

const { Text } = Typography;

interface ScreenEditorModalProps {
  open: boolean;
  screenId: string;
  onClose: () => void;
}

const windowTypeMeta: Record<string, { icon: React.ReactNode; label: string }> = {
  graph: { icon: <BarChartOutlined />, label: 'График' },
  table: { icon: <TableOutlined />, label: 'Таблица' },
  video: { icon: <CameraOutlined />, label: 'Видео' },
  map: { icon: <EnvironmentOutlined />, label: 'Карта' },
};

const availableTypes: { type: ScreenWindow['type']; label: string; desc: string }[] = [
  { type: 'graph', label: 'График', desc: 'Временной ряд выбранных параметров' },
  { type: 'table', label: 'Таблица', desc: 'Таблица значений параметров' },
  { type: 'video', label: 'Видео', desc: 'Видеопоток с камеры' },
  { type: 'map', label: 'Карта', desc: 'Схема/карта с объектами' },
];

const paramOptions = mockParams.map((p) => ({ value: p.name, label: p.name }));

export default function ScreenEditorModal({ open, screenId, onClose }: ScreenEditorModalProps) {
  const screen = useScreenStore((s) => s.screens.find((sc) => sc.id === screenId));
  const { addWindow, removeWindow, updateWindowParams } = useScreenStore();

  if (!screen) return null;

  return (
    <Modal
      title={`Редактор экрана: ${screen.name}`}
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Закрыть</Button>}
      width={600}
    >
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Рабочие окна ({screen.windows.length})</Text>
      {screen.windows.length === 0 ? (
        <Empty description="Нет окон. Добавьте окно ниже." image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          size="small"
          dataSource={screen.windows}
          renderItem={(w, idx) => {
            const meta = windowTypeMeta[w.type] || { icon: null, label: w.type };
            return (
              <List.Item
                actions={[
                  <Button
                    key="del"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => { removeWindow(screen.id, w.id); message.success('Окно удалено'); }}
                  />,
                ]}
              >
                <div style={{ width: '100%' }}>
                  <Space>
                    {meta.icon}
                    <Text>{meta.label} {idx + 1}</Text>
                    <Tag>{w.params.length} парам.</Tag>
                  </Space>
                  {w.type !== 'video' && w.type !== 'map' && (
                    <div style={{ marginTop: 4, marginLeft: 22 }}>
                      <Select
                        mode="multiple"
                        size="small"
                        style={{ width: '100%' }}
                        value={w.params}
                        onChange={(vals) => updateWindowParams(screen.id, w.id, vals)}
                        options={paramOptions}
                        placeholder="Выберите параметры"
                      />
                    </div>
                  )}
                </div>
              </List.Item>
            );
          }}
        />
      )}

      <Text strong style={{ display: 'block', margin: '12px 0 8px' }}>Добавить окно</Text>
      <Space wrap>
        {availableTypes.map((t) => (
          <Button
            key={t.type}
            icon={windowTypeMeta[t.type]?.icon}
            size="small"
            onClick={() => { addWindow(screen.id, t.type); message.success(`Окно «${t.label}» добавлено`); }}
          >
            {t.label}
          </Button>
        ))}
      </Space>
    </Modal>
  );
}
