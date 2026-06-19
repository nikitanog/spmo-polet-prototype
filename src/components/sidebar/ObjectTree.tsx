import { Tree, Select, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  FolderOutlined,
  PlusOutlined,
  FileAddOutlined,
  RocketOutlined,
  AimOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/useAppStore';

const { Text } = Typography;

interface ObjectTreeProps {
  onCreateTopic?: () => void;
  onCreateObject?: () => void;
}

export default function ObjectTree({ onCreateTopic, onCreateObject }: ObjectTreeProps) {
  const navigate = useNavigate();
  const {
    themes, selectedTopicId, selectedObjectId,
    selectTopic, selectObject,
    activeTrajectoryId, setActiveTrajectory, trajectories,
  } = useAppStore();

  const selectedObj = themes.flatMap(t => t.objects).find(o => o.id === selectedObjectId);
  const selectedTopic = themes.find(t => t.id === selectedTopicId);

  const trajOptions = trajectories.map((t) => ({ value: t.id, label: t.name }));

  const selectedKeys = selectedObjectId ? [selectedObjectId] : [];
  const expandedKeys = themes.map(t => t.id);

  const treeData = themes.map((t) => ({
    key: t.id,
    icon: <FolderOutlined style={{ fontSize: 14 }} />,
    title: (
      <span style={{ fontWeight: selectedTopicId === t.id ? 700 : 400 }}>
        {t.name}
      </span>
    ),
    children: t.objects.map((o) => ({
      key: o.id,
      icon: <RocketOutlined style={{ fontSize: 13, color: '#1677ff' }} />,
      title: (
        <span
          style={{
            fontWeight: selectedObjectId === o.id ? 700 : 400,
            borderLeft: selectedObjectId === o.id ? '3px solid #1677ff' : '3px solid transparent',
            paddingLeft: 6,
          }}
        >
          {o.name}
        </span>
      ),
    })),
  }));

  return (
    <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
      {selectedObj && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 6px', borderRadius: 4, background: '#e6f4ff',
            marginBottom: 4, fontSize: 11,
          }}
        >
          <AimOutlined style={{ color: '#1677ff' }} />
          <Text style={{ fontSize: 11, flex: 1 }}>
            <Text strong style={{ fontSize: 11 }}>{selectedObj.name}</Text>
            {selectedTopic && (
              <Text type="secondary" style={{ fontSize: 10 }}> ({selectedTopic.name})</Text>
            )}
          </Text>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Tree
          showIcon
          treeData={treeData}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={(keys) => {
            if (keys.length === 0) return;
            const key = keys[0] as string;
            const isTopic = themes.some((t) => t.id === key);
            if (isTopic) {
              selectTopic(key);
            } else {
              const parentTopic = themes.find(t => t.objects.some(o => o.id === key));
              if (parentTopic) selectTopic(parentTopic.id);
              selectObject(key);
              message.success(`Выбран объект: ${themes.flatMap(t => t.objects).find(o => o.id === key)?.name || key}`);
              navigate('/');
            }
          }}
          defaultExpandAll
        />
      </div>

      <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: 6 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Траектории:</div>
        <Select
          style={{ width: '100%' }}
          size="small"
          placeholder="Открыть траекторию"
          options={trajOptions}
          value={activeTrajectoryId}
          onChange={(val) => setActiveTrajectory(val)}
        />
      </div>

      <div style={{ display: 'flex', gap: 4, borderTop: '1px solid #e8e8e8', paddingTop: 6 }}>
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={() => onCreateTopic?.()}
          style={{ flex: 1 }}
        >
          Тема
        </Button>
        <Button
          size="small"
          icon={<FileAddOutlined />}
          type={selectedTopicId ? 'primary' : 'default'}
          disabled={!selectedTopicId}
          onClick={() => onCreateObject?.()}
          style={{ flex: 1 }}
        >
          Объект
        </Button>
      </div>
    </div>
  );
}
