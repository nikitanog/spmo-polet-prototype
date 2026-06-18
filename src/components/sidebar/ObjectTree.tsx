import { Tree, Select, Button } from 'antd';
import { useAppStore } from '../../stores/useAppStore';

interface ObjectTreeProps {
  collapsed: boolean;
}

export default function ObjectTree({ collapsed }: ObjectTreeProps) {
  const { themes, selectedTopicId, selectedObjectId, selectTopic, selectObject, setActiveTrajectory, trajectories } = useAppStore();

  const treeData = themes.map((t) => ({
    title: collapsed ? undefined : t.name,
    key: t.id,
    children: t.objects.map((o) => ({
      title: collapsed ? undefined : o.name,
      key: o.id,
    })),
  }));

  const trajOptions = trajectories.map((t) => ({ value: t.id, label: collapsed ? t.name.slice(0, 6) + '…' : t.name }));

  if (collapsed) {
    return (
      <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <Tree
          treeData={themes.map((t) => ({
            title: '📁',
            key: t.id,
            children: t.objects.map((o) => ({ title: '📄', key: o.id })),
          }))}
          selectedKeys={selectedObjectId ? [selectedObjectId] : selectedTopicId ? [selectedTopicId] : []}
          onSelect={(keys) => {
            if (keys.length === 0) return;
            const key = keys[0] as string;
            const isTopic = themes.some((t) => t.id === key);
            if (isTopic) selectTopic(key);
            else selectObject(key);
          }}
          defaultExpandAll
          style={{ width: 40 }}
          blockNode
        />
        <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: 8, width: '100%' }}>
          <Select
            style={{ width: '100%' }}
            placeholder="..."
            options={trajOptions}
            value={useAppStore.getState().activeTrajectoryId}
            onChange={(val) => setActiveTrajectory(val)}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Tree
        treeData={treeData}
        selectedKeys={selectedObjectId ? [selectedObjectId] : selectedTopicId ? [selectedTopicId] : []}
        onSelect={(keys) => {
          if (keys.length === 0) return;
          const key = keys[0] as string;
          const isTopic = themes.some((t) => t.id === key);
          if (isTopic) selectTopic(key);
          else selectObject(key);
        }}
        defaultExpandAll
      />
      <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Траектории:</div>
        <Select
          style={{ width: '100%' }}
          placeholder="Открыть траекторию"
          options={trajOptions}
          value={useAppStore.getState().activeTrajectoryId}
          onChange={(val) => setActiveTrajectory(val)}
        />
      </div>
      <div style={{ marginTop: 'auto' }}>
        <Button size="small" block type="dashed" onClick={() => selectObject('')}>
          + Создать объект
        </Button>
      </div>
    </div>
  );
}
