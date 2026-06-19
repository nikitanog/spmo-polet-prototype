import { useState } from 'react';
import { Card, List, Button, InputNumber, Input, Modal, Tag, Empty, Typography, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAppStore } from '../../stores/useAppStore';

const { Text } = Typography;

interface EditState {
  id: string;
  time: number;
  comment: string;
}

export default function MarkersPanel() {
  const { markers, addMarker, removeMarker } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTime, setNewTime] = useState<number>(0);
  const [newComment, setNewComment] = useState('');
  const [edit, setEdit] = useState<EditState | null>(null);

  const handleAdd = () => {
    if (!newComment.trim()) return;
    addMarker({ id: `m${Date.now()}`, time: newTime, comment: newComment.trim() });
    setNewTime(0);
    setNewComment('');
    setShowAdd(false);
  };

  const handleEditSave = () => {
    if (!edit) return;
    removeMarker(edit.id);
    addMarker({ id: edit.id, time: edit.time, comment: edit.comment.trim() || `Маркер @${edit.time}` });
    setEdit(null);
  };

  const sorted = [...markers].sort((a, b) => a.time - b.time);

  return (
    <Card
      title="Маркеры событий"
      size="small"
      extra={
        <Button size="small" icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>
          Добавить
        </Button>
      }
      style={{ width: '100%' }}
    >
      {markers.length === 0 ? (
        <Empty description="Нет маркеров" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          size="small"
          dataSource={sorted}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tooltip key="edit" title="Редактировать">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => setEdit({ id: item.id, time: item.time, comment: item.comment })}
                  />
                </Tooltip>,
                <Button
                  key="del"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeMarker(item.id)}
                />,
              ]}
            >
              <div>
                <Tag color="gold">t={item.time}</Tag>
                <Text>{item.comment}</Text>
              </div>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Добавить маркер"
        open={showAdd}
        onOk={handleAdd}
        onCancel={() => setShowAdd(false)}
        okText="Добавить"
        cancelText="Отмена"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Время (отсчёт)</Text>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={2999}
              value={newTime}
              onChange={(v) => setNewTime(v ?? 0)}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Комментарий</Text>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Например: Взлёт, Набор высоты"
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Редактировать маркер"
        open={!!edit}
        onOk={handleEditSave}
        onCancel={() => setEdit(null)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Время (отсчёт)</Text>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={2999}
              value={edit?.time}
              onChange={(v) => setEdit(e => e ? { ...e, time: v ?? 0 } : null)}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Комментарий</Text>
            <Input
              value={edit?.comment}
              onChange={(e) => setEdit(prev => prev ? { ...prev, comment: e.target.value } : null)}
              placeholder="Комментарий маркера"
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
}
