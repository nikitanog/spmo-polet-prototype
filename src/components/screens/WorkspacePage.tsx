import { Row, Col } from 'antd';
import { useAppStore } from '../../stores/useAppStore';
import TrajectoryChart from '../graphics/TrajectoryChart';
import ParamsTable from '../tables/ParamsTable';
import MarkersPanel from '../common/MarkersPanel';

export default function WorkspacePage() {
  const { activeTrajectoryId } = useAppStore();

  if (!activeTrajectoryId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0 }}>Добро пожаловать в СПМО «Полёт» версия 5</h2>
        <p style={{ color: '#888' }}>Выберите объект и откройте траекторию: <b>Объект → Выбрать</b>, затем <b>Траектория → Рассчитать</b></p>
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
