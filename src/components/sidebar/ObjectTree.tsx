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
      <div style={{ padding: '8px 4px', height: '100%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ fontSize: 10, color: '#888', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', width: '100%', textAlign: 'center' }}>Темы</div>
        {themes.map(t => (
          <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div
              onClick={() => selectTopic(t.id)}
              style={{ cursor: 'pointer', fontSize: 18, lineHeight: 1, opacity: selectedTopicId === t.id ? 1 : 0.5 }}
              title={t.name}
            >
              📁
            </div>
            {t.objects.map(o => (
              <div
                key={o.id}
                onClick={() => selectObject(o.id)}
                style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1, opacity: selectedObjectId === o.id ? 1 : 0.4 }}
                title={o.name}
              >
                📄
              </div>
            ))}
          </div>
        ))}
        <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: 8, marginTop: 'auto', width: '100%', textAlign: 'center' }}>
          <div
            onClick={() => {
              const active = useAppStore.getState().activeTrajectoryId;
              if (active) setActiveTrajectory(active === trajectories[0]?.id ? trajectories[1]?.id : trajectories[0]?.id);
            }}
            style={{ cursor: 'pointer', fontSize: 18 }}
            title="Переключить траекторию"
          >
            🔄
          </div>
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
