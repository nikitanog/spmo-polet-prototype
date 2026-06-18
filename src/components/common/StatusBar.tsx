import { useAppStore } from '../../stores/useAppStore';
import { Tag } from 'antd';

export default function StatusBar() {
  const { mode, activeTrajectoryId, trajectories, markers } = useAppStore();
  const traj = trajectories.find((t) => t.id === activeTrajectoryId);

  return (
    <div style={{ display: 'flex', gap: 16, padding: '4px 16px', background: '#f0f2f5', fontSize: 12, borderTop: '1px solid #d9d9d9' }}>
      <span>Режим: <Tag color={mode === 'flight' ? 'green' : 'blue'}>{mode === 'flight' ? 'ПОЛЁТ' : 'АНАЛИЗ'}</Tag></span>
      <span>Траектория: {traj?.name || '—'}</span>
      <span>Параметров: {traj?.params.length || 0}</span>
      <span>Маркеров: {markers.length}</span>
    </div>
  );
}
