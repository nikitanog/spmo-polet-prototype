import { useState } from 'react';
import { Row, Col, Card, Button, Typography, Space, Empty, List, Modal, message, Tooltip } from 'antd';
import { PlusOutlined, FolderOpenOutlined, SaveOutlined, DeleteOutlined, EditOutlined, MonitorOutlined } from '@ant-design/icons';
import { useScreenStore } from '../../stores/useScreenStore';
import ScreenEditorModal from '../../modals/ScreenEditorModal';
import ScreenCreateModal from '../../modals/ScreenCreateModal';
import ScreenSaveModal from '../../modals/ScreenSaveModal';

const { Text, Title } = Typography;

export default function ScreenManagerPage() {
  const { screens, selectedId, selectScreen, removeScreen } = useScreenStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [savingScreenId, setSavingScreenId] = useState<string | null>(null);

  const selected = screens.find((s) => s.id === selectedId);

  const handleCreate = (name: string) => {
    useScreenStore.getState().addScreen(name);
    const created = useScreenStore.getState().screens;
    selectScreen(created[created.length - 1].id);
  };

  const handleDelete = (id: string) => {
    const sc = screens.find((s) => s.id === id);
    Modal.confirm({
      title: `Удалить экран «${sc?.name}»?`,
      content: 'Окна экрана будут также удалены.',
      onOk: () => {
        removeScreen(id);
        message.success('Экран удалён');
      },
    });
  };

  const handleSaveAs = (id: string) => {
    setSavingScreenId(id);
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
              <Button icon={<FolderOpenOutlined />} onClick={() => {
                const keys = Object.keys(localStorage).filter(k => k.startsWith('scr_'));
                if (keys.length === 0) { message.info('Нет сохранённых экранов. Используйте "Сохранить как..."'); return; }
                const names = keys.map(k => k.replace('scr_', ''));
                const name = prompt(`Выберите экран (доступны: ${names.join(', ')})`);
                if (!name) return;
                const raw = localStorage.getItem(`scr_${name}`);
                if (!raw) { message.error('Экран не найден'); return; }
                const data = JSON.parse(raw);
                useScreenStore.getState().addScreen(data.name);
                message.success(`Экран «${name}» загружен`);
              }}>Открыть</Button>
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
                    onClick={() => selectScreen(item.id)}
                    actions={[
                      <Tooltip key="edit" title="Редактировать">
                        <Button size="small" type="text" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); selectScreen(item.id); setEditorOpen(true); }} />
                      </Tooltip>,
                      <Tooltip key="del" title="Удалить">
                        <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} />
                      </Tooltip>,
                    ]}
                  >
                    <div>
                      <Text strong>{item.name}</Text>
                      <div style={{ fontSize: 11, color: '#888' }}>
                        {item.windows.length} окон · {item.created}
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
                  <Button size="small" icon={<SaveOutlined />} onClick={() => handleSaveAs(selected.id)}>Сохранить как</Button>
                  <Button size="small" icon={<EditOutlined />} onClick={() => setEditorOpen(true)}>Редактор</Button>
                </Space>
              }
            >
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {selected.windows.length === 0 ? (
                  <Empty description="Нет окон. Откройте редактор для добавления." image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%', padding: 24 }} />
                ) : (
                  selected.windows.map((w, idx) => (
                    <div key={w.id} style={{
                      width: 200, height: 120, border: '1px solid #d9d9d9', borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#fafafa', flexDirection: 'column', cursor: 'pointer',
                    }}>
                      <MonitorOutlined style={{ fontSize: 24, color: '#bbb' }} />
                      <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>
                        Окно {idx + 1} ({w.type}, {w.params.length} парам.)
                      </Text>
                    </div>
                  ))
                )}
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
      <ScreenSaveModal open={saveOpen} screenName={screens.find((s) => s.id === savingScreenId)?.name ?? ''} onClose={() => { setSaveOpen(false); setSavingScreenId(null); }} />
      {selected && (
        <ScreenEditorModal
          open={editorOpen}
          screenId={selected.id}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
}
