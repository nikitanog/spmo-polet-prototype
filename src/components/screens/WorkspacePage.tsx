import { Row, Col, Button, Typography, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AimOutlined, RocketOutlined } from '@ant-design/icons';
import { useAppStore } from '../../stores/useAppStore';
import TrajectoryChart from '../graphics/TrajectoryChart';
import ParamsTable from '../tables/ParamsTable';
import MarkersPanel from '../common/MarkersPanel';

const { Text, Title } = Typography;

export default function WorkspacePage() {
  const navigate = useNavigate();
  const { activeTrajectoryId, themes, selectedTopicId, selectedObjectId, exited, resetExit, trajectories, setActiveTrajectory } = useAppStore();
  const selectedObj = themes.flatMap(t => t.objects).find(o => o.id === selectedObjectId);
  const selectedTopic = themes.find(t => t.id === selectedTopicId);

  if (exited) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
        <RocketOutlined style={{ fontSize: 48, color: '#888', opacity: 0.5 }} />
        <h2 style={{ margin: 0 }}>Сеанс работы завершён</h2>
        <p style={{ color: '#888' }}>СПМО «Полёт» версия 5 остановлена. Для продолжения работы начните новый сеанс.</p>
        <Button type="primary" onClick={() => { resetExit(); navigate('/'); }}>
          Начать новый сеанс
        </Button>
      </div>
    );
  }

  if (trajectories.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
        <RocketOutlined style={{ fontSize: 48, color: '#1677ff', opacity: 0.6 }} />
        <Title level={4} style={{ margin: 0 }}>СПМО «Полёт» версия 5</Title>
        {selectedObj ? (
          <div>
            <AimOutlined style={{ marginRight: 6, color: '#1677ff' }} />
            <Text strong>{selectedObj.name}</Text>
            {selectedTopic && <Text type="secondary"> ({selectedTopic.name})</Text>}
          </div>
        ) : (
          <p style={{ color: '#888' }}>Выберите объект: <b>Объект → Выбрать</b></p>
        )}
        <p style={{ color: '#888' }}>Откройте траекторию: <b>Траектория → Рассчитать</b> или <b>Траектория → Открыть</b></p>
      </div>
    );
  }

  return (
    <div>
      {trajectories.length > 1 && (
        <Tabs
          activeKey={activeTrajectoryId || undefined}
          onChange={(key) => setActiveTrajectory(key)}
          type="card"
          size="small"
          style={{ marginBottom: 8 }}
          items={trajectories.map((t) => ({
            key: t.id,
            label: t.name,
            closable: trajectories.length > 1,
            onClose: () => {
              if (activeTrajectoryId === t.id) {
                const others = trajectories.filter((tr) => tr.id !== t.id);
                if (others.length > 0) setActiveTrajectory(others[0].id);
              }
              useAppStore.getState().addTrajectory({ id: '__remove__', name: '', params: [], data: {} });
            },
          }))}
          onEdit={(targetKey, action) => {
            if (action === 'remove') {
              const idx = trajectories.findIndex((t) => t.id === targetKey);
              if (activeTrajectoryId === targetKey) {
                const remaining = trajectories.filter((t) => t.id !== targetKey);
                if (remaining.length > 0) setActiveTrajectory(remaining[Math.min(idx, remaining.length - 1)].id);
              }
              useAppStore.setState((s) => ({ trajectories: s.trajectories.filter((t) => t.id !== targetKey) }));
            }
          }}
        />
      )}
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <TrajectoryChart />
        </Col>
      </Row>
      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={16}>
          <ParamsTable />
        </Col>
        <Col span={8}>
          <MarkersPanel />
        </Col>
      </Row>
    </div>
  );
}
