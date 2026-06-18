import { useState } from 'react';
import { Row, Col, Card, Button, Typography, Space, Empty, List, Tag, Modal, message } from 'antd';
import { PlusOutlined, FolderOpenOutlined, SaveOutlined, DeleteOutlined, EditOutlined, MonitorOutlined } from '@ant-design/icons';
import { mockScreens } from '../../mock-data';
import ScreenEditorModal from '../../modals/ScreenEditorModal';
import ScreenCreateModal from '../../modals/ScreenCreateModal';
import ScreenSaveModal from '../../modals/ScreenSaveModal';

const { Text, Title } = Typography;

interface ScreenItem {
  id: string;
  name: string;
  windowCount: number;
  created: string;
}

const initialScreens: ScreenItem[] = mockScreens.map((s) => ({
  id: s.id,
  name: s.name,
  windowCount: s.windows.length,
  created: '2026-06-10',
}));

export default function ScreenManagerPage() {
  const [screens, setScreens] = useState<ScreenItem[]>(initialScreens);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [savingScreen, setSavingScreen] = useState<ScreenItem | null>(null);

  const selected = screens.find((s) => s.id === selectedId);

  const handleCreate = (name: string) => {
    const newScreen: ScreenItem = {
      id: `s${Date.now()}`,
      name,
      windowCount: 0,
      created: new Date().toISOString().slice(0, 10),
    };
    setScreens((prev) => [...prev, newScreen]);
    setSelectedId(newScreen.id);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Удалить экран?',
      onOk: () => {
        setScreens((prev) => prev.filter((s) => s.id !== id));
        if (selectedId === id) setSelectedId(null);
        message.success('Экран удалён');
      },
    });
  };

  const handleSaveAs = (screen: ScreenItem) => {
    setSavingScreen(screen);
    setSaveOpen(true);
  };

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <MonitorOutlined style={{ fontSize: 20 }} />
              <Title level={4} style={{ margin: 0 }}>Менеджер экранов</Title>
            </Space>
            <Space>
              <Button icon={<PlusOutlined />} type="primary" onClick={() => setCreateOpen(true)}>Создать</Button>
              <Button icon={<FolderOpenOutlined />} onClick={() => message.info('Выберите .scr файл')}>Открыть</Button>
            </Space>
          </Space>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={8}>
          <Card title="Экраны" size="small" styles={{ body: { padding: 0 } }}>
            {screens.length === 0 ? (
              <Empty description="Нет экранов" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: 24 }} />
            ) : (
              <List
                size="small"
                dataSource={screens}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: 'pointer', background: selectedId === item.id ? '#e6f4ff' : undefined }}
                    onClick={() => setSelectedId(item.id)}
                    actions={[
                      <Button key="edit" size="small" type="text" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); setEditorOpen(true); }} />,
                      <Button key="del" size="small" type="text" danger icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} />,
                    ]}
                  >
                    <div>
                      <Text strong>{item.name}</Text>
                      <div style={{ fontSize: 11, color: '#888' }}>
                        {item.windowCount} окон · {item.created}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col span={16}>
          {selected ? (
            <Card
              title={selected.name}
              size="small"
              extra={
                <Space>
                  <Button size="small" icon={<SaveOutlined />} onClick={() => handleSaveAs(selected)}>Сохранить как</Button>
                  <Button size="small" icon={<EditOutlined />} onClick={() => setEditorOpen(true)}>Редактор</Button>
                </Space>
              }
            >
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {Array.from({ length: Math.max(selected.windowCount, 1) }).map((_, idx) => (
                  <div key={idx} style={{
                    width: 200, height: 120, border: '1px solid #d9d9d9', borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fafafa', flexDirection: 'column', cursor: 'pointer',
                  }}>
                    <MonitorOutlined style={{ fontSize: 24, color: '#bbb' }} />
                    <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>Окно {idx + 1}</Text>
                  </div>
                ))}
                <div style={{
                  width: 200, height: 120, border: '1px dashed #d9d9d9', borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#fafafa', cursor: 'pointer',
                }}>
                  <PlusOutlined style={{ color: '#bbb', fontSize: 24 }} />
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <Empty description="Выберите экран слева" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Card>
          )}
        </Col>
      </Row>

      <ScreenCreateModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <ScreenSaveModal open={saveOpen} screenName={savingScreen?.name ?? ''} onClose={() => { setSaveOpen(false); setSavingScreen(null); }} />
      {selected && (
        <ScreenEditorModal
          open={editorOpen}
          screen={{ id: selected.id, name: selected.name, windows: [] }}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
}
