import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Tree, List, Typography, message } from 'antd';
import { useAppStore } from '../stores/useAppStore';

const { Text } = Typography;

interface SelectObjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SelectObjectModal({ open, onClose }: SelectObjectModalProps) {
  const navigate = useNavigate();
  const { themes, selectedTopicId, selectedObjectId, selectTopic, selectObject } = useAppStore();
  const [localTopicId, setLocalTopicId] = useState<string | null>(selectedTopicId);
  const [localObjectId, setLocalObjectId] = useState<string | null>(selectedObjectId);

  const topicTree = themes.map((t) => ({
    title: t.name,
    key: t.id,
  }));

  const currentTopic = themes.find((t) => t.id === localTopicId);
  const objects = currentTopic?.objects || [];

  const handleOk = () => {
    if (localTopicId) selectTopic(localTopicId);
    if (localObjectId) {
      selectObject(localObjectId);
      const objName = themes.flatMap(t => t.objects).find(o => o.id === localObjectId)?.name || localObjectId;
      message.success(`Выбран объект: ${objName}`);
    }
    onClose();
    navigate('/');
  };

  return (
    <Modal
      title="Выбор объекта"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Выбрать"
      cancelText="Отмена"
      width={640}
      styles={{ body: { padding: '12px 0' } }}
    >
      <div style={{ display: 'flex', gap: 16, minHeight: 300 }}>
        <div style={{ width: 240, borderRight: '1px solid #d9d9d9', paddingRight: 12 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>Темы</Text>
          <Tree
            treeData={topicTree}
            selectedKeys={localTopicId ? [localTopicId] : []}
            onSelect={(keys) => {
              if (keys.length) {
                setLocalTopicId(keys[0] as string);
                setLocalObjectId(null);
              }
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>Объекты</Text>
          {objects.length === 0 ? (
            <Text type="secondary">Выберите тему слева</Text>
          ) : (
            <List
              size="small"
              dataSource={objects}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  onClick={() => setLocalObjectId(item.id)}
                  style={{
                    cursor: 'pointer',
                    background: localObjectId === item.id ? '#e6f4ff' : undefined,
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  {item.name}
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
