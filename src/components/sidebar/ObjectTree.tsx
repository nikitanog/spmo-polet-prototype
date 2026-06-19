import { Tree, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';

interface ObjectTreeProps {
  onCreateTopic?: () => void;
  onCreateObject?: () => void;
}

export default function ObjectTree({ onCreateTopic, onCreateObject }: ObjectTreeProps) {
  const navigate = useNavigate();
  const { themes, selectedTopicId, selectedObjectId, activeTrajectoryId, selectTopic, selectObject, setActiveTrajectory, trajectories } = useAppStore();

  const treeData = themes.map((t) => ({
    title: t.name,
    key: t.id,
    children: t.objects.map((o) => ({
      title: o.name,
      key: o.id,
    })),
  }));

  const trajOptions = trajectories.map((t) => ({ value: t.id, label: t.name }));

  const selectedKeys = selectedObjectId ? [selectedObjectId] : selectedTopicId ? [selectedTopicId] : [];
  const expandedKeys = selectedObjectId
    ? themes.filter((t) => t.objects.some((o) => o.id === selectedObjectId)).map((t) => t.id)
    : [];

  return (
    <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Tree
        treeData={treeData}
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        onSelect={(keys) => {
          if (keys.length === 0) return;
          const key = keys[0] as string;
          const isTopic = themes.some((t) => t.id === key);
          if (isTopic) selectTopic(key);
          else {
            const parentTopic = themes.find(t => t.objects.some(o => o.id === key));
            if (parentTopic) selectTopic(parentTopic.id);
            selectObject(key);
            message.success(`Выбран объект: ${themes.flatMap(t => t.objects).find(o => o.id === key)?.name || key}`);
            navigate('/');
          }
        }}
        defaultExpandAll
      />
      <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Траектории:</div>
        <Select
          style={{ width: '100%' }}
          placeholder="Открыть траекторию"
          options={trajOptions}
          value={activeTrajectoryId}
          onChange={(val) => setActiveTrajectory(val)}
        />
      </div>
      <div style={{ marginTop: 'auto' }}>
        <Button size="small" block type="dashed" onClick={() => {
          if (selectedTopicId) onCreateObject?.();
          else onCreateTopic?.();
        }}>
          + {selectedTopicId ? 'Создать объект' : 'Создать тему'}
        </Button>
      </div>
    </div>
  );
}
