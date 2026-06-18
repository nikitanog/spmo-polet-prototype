import { useState } from 'react';
import { Card, List, Button, InputNumber, Input, Modal, Tag, Empty, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppStore } from '../../stores/useAppStore';

const { Text } = Typography;

export default function MarkersPanel() {
  const { markers, addMarker, removeMarker } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTime, setNewTime] = useState<number>(0);
  const [newComment, setNewComment] = useState('');

  const handleAdd = () => {
    if (!newComment.trim()) return;
    addMarker({ id: `m${Date.now()}`, time: newTime, comment: newComment.trim() });
    setNewTime(0);
    setNewComment('');
    setShowAdd(false);
  };

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
          dataSource={[...markers].sort((a, b) => a.time - b.time)}
          renderItem={(item) => (
            <List.Item
              actions={[
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
    </Card>
  );
}
