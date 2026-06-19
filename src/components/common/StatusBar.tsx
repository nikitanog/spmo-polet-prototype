import { useAppStore } from '../../stores/useAppStore';
import { Tag } from 'antd';
import { AimOutlined } from '@ant-design/icons';

export default function StatusBar() {
  const { mode, activeTrajectoryId, trajectories, markers, themes, selectedObjectId, selectedTopicId } = useAppStore();
  const traj = trajectories.find((t) => t.id === activeTrajectoryId);
  const selectedObj = themes.flatMap(t => t.objects).find(o => o.id === selectedObjectId);
  const selectedTopic = themes.find(t => t.id === selectedTopicId);

  return (
    <div style={{ display: 'flex', gap: 16, padding: '2px 12px', background: '#F1EDED', fontSize: 11, borderTop: '1px solid #C0C0C0', height: 22, alignItems: 'center', color: '#000' }}>
      <span>Режим: <Tag color={mode === 'flight' ? 'green' : 'blue'}>{mode === 'flight' ? 'ПОЛЁТ' : 'АНАЛИЗ'}</Tag></span>
      {selectedObj && (
        <span>
          <AimOutlined style={{ marginRight: 4, color: '#1677ff' }} />
          <strong>{selectedObj.name}</strong>
          {selectedTopic && <span style={{ color: '#888' }}> ({selectedTopic.name})</span>}
        </span>
      )}
      {!selectedObj && <span>Объект: не выбран</span>}
      <span>Траектория: {traj?.name || '—'}</span>
      <span>Параметров: {traj?.params.length || 0}</span>
      <span>Маркеров: {markers.length}</span>
    </div>
  );
}
