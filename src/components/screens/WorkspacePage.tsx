import { Row, Col, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AimOutlined, RocketOutlined } from '@ant-design/icons';
import { useAppStore } from '../../stores/useAppStore';
import TrajectoryChart from '../graphics/TrajectoryChart';
import ParamsTable from '../tables/ParamsTable';
import MarkersPanel from '../common/MarkersPanel';

const { Text, Title } = Typography;

export default function WorkspacePage() {
  const navigate = useNavigate();
  const { activeTrajectoryId, themes, selectedTopicId, selectedObjectId, exited, resetExit } = useAppStore();
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

  if (!activeTrajectoryId) {
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
