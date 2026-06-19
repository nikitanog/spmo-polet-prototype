import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Tag, Typography, Button, Empty, Space, List, Badge, Select } from 'antd';
import { PlusOutlined, SettingOutlined, MonitorOutlined, WarningFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { mockTelemetryValues, mockAlarms } from '../../mock-data';
import { useScreenStore } from '../../stores/useScreenStore';
import { useAppStore } from '../../stores/useAppStore';
import ScreenEditorModal from '../../modals/ScreenEditorModal';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { TelemetryValue, Alarm } from '../../mock-data/types';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

const { Text, Title } = Typography;

const statusIcon = (status: TelemetryValue['status']) => {
  switch (status) {
    case 'ok': return <CheckCircleFilled style={{ color: '#52c41a' }} />;
    case 'warning': return <WarningFilled style={{ color: '#faad14' }} />;
    case 'critical': return <CloseCircleFilled style={{ color: '#ff4d4f' }} />;
  }
};

const statusColor = (status: Alarm['status']) => status === 'critical' ? '#ff4d4f' : '#faad14';

function MiniGraph({ params }: { params: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const traj = useAppStore((s) => {
    const id = s.activeTrajectoryId;
    return id ? s.trajectories.find((t) => t.id === id) : null;
  });

  useEffect(() => {
    if (!ref.current || !traj) return;
    const chart = echarts.init(ref.current);
    chart.setOption({
      grid: { left: 4, right: 4, top: 4, bottom: 4 },
      xAxis: { type: 'value', show: false },
      yAxis: { type: 'value', show: false },
      series: params.filter((p) => traj.data[p]).map((p, i) => ({
        type: 'line',
        data: traj.data[p].map((v, j) => [j, v]),
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1, color: ['#1677ff', '#ff4d4f', '#52c41a', '#faad14'][i % 4] },
      })),
      animation: false,
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => { chart.dispose(); window.removeEventListener('resize', resize); };
  }, [params.join(',')]);

  return <div ref={ref} style={{ width: '100%', height: '100%', minHeight: 120 }} />;
}

export default function ScreenPage() {
  const navigate = useNavigate();
  const { screens, selectedId, selectScreen } = useScreenStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const currentId = selectedId || screens[0]?.id;
  const currentScreen = screens.find((s) => s.id === currentId) || screens[0];
  const activeTrajectoryId = useAppStore((s) => s.activeTrajectoryId);

  if (!currentScreen) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Empty description="Нет доступных экранов. Создайте экран в менеджере.">
          <Button type="primary" onClick={() => navigate('/screens')}>Менеджер экранов</Button>
        </Empty>
      </div>
    );
  }

  const graphWindows = currentScreen.windows.filter((w) => w.type === 'graph');
  const tableWindows = currentScreen.windows.filter((w) => w.type === 'table');
  const otherWindows = currentScreen.windows.filter((w) => w.type === 'video' || w.type === 'map');

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <MonitorOutlined style={{ fontSize: 20 }} />
              <Title level={4} style={{ margin: 0 }}>Экран: {currentScreen.name}</Title>
              <Tag color="blue">СОИ</Tag>
              <Select
                size="small"
                style={{ width: 200 }}
                value={currentId}
                onChange={(v) => selectScreen(v)}
                options={screens.map((s) => ({ value: s.id, label: s.name }))}
              />
            </Space>
            <Space>
              <Button icon={<SettingOutlined />} onClick={() => setEditorOpen(true)}>Настройки экрана</Button>
              <Button icon={<PlusOutlined />} type="primary" onClick={() => navigate('/screens')}>Создать экран</Button>
            </Space>
          </Space>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={6}>
          <Card title="Текущие значения" size="small" styles={{ body: { padding: 8 } }}>
            <List
              size="small"
              dataSource={mockTelemetryValues}
              renderItem={(item) => (
                <List.Item style={{ padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    {statusIcon(item.status)}
                    <Text style={{ fontSize: 12 }}>{item.name}</Text>
                  </Space>
                  <Space size={4}>
                    <Text strong style={{ fontSize: 13, fontFamily: 'monospace' }}>{item.value}</Text>
                    <Text type="secondary" style={{ fontSize: 10 }}>{item.unit}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          {graphWindows.map((w) => (
            <Card key={w.id} title={`График: ${w.params.join(', ')}`} size="small" style={{ marginBottom: 12 }} styles={{ body: { padding: 4 } }}>
              {activeTrajectoryId ? (
                <MiniGraph params={w.params} />
              ) : (
                <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text type="secondary">Нет активной траектории</Text>
                </div>
              )}
            </Card>
          ))}

          {tableWindows.map((w) => (
            <Card key={w.id} title={`Таблица: ${w.params.length} параметров`} size="small" style={{ marginBottom: 12 }} styles={{ body: { padding: 4 } }}>
              <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    <th style={{ padding: '2px 6px', border: '1px solid #f0f0f0', textAlign: 'left' }}>Параметр</th>
                    <th style={{ padding: '2px 6px', border: '1px solid #f0f0f0', textAlign: 'right' }}>Значение</th>
                  </tr>
                </thead>
                <tbody>
                  {w.params.map((p) => (
                    <tr key={p}>
                      <td style={{ padding: '2px 6px', border: '1px solid #f0f0f0' }}>{p}</td>
                      <td style={{ padding: '2px 6px', border: '1px solid #f0f0f0', textAlign: 'right', fontFamily: 'monospace' }}>
                        {activeTrajectoryId ? (Math.random() * 200 - 100).toFixed(2) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ))}

          {otherWindows.map((w) => (
            <Card key={w.id} title={w.type === 'video' ? 'Видеопоток' : 'Карта'} size="small" style={{ marginBottom: 12 }} styles={{ body: { padding: 0 } }}>
              <div style={{
                height: w.type === 'video' ? 280 : 180,
                background: w.type === 'video' ? '#0a0a1a' : '#f0f5ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                borderRadius: 4, color: '#666',
              }}>
                <MonitorOutlined style={{ fontSize: 36, opacity: 0.3 }} />
                <Text type="secondary" style={{ marginTop: 4 }}>
                  {w.type === 'video' ? 'Видеопоток КА-1' : 'Схема расположения КА'}
                </Text>
              </div>
            </Card>
          ))}

          {currentScreen.windows.length === 0 && (
            <Card>
              <Empty description="Окна не настроены. Откройте редактор." image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Card>
          )}
        </Col>

        <Col span={6}>
          <Card
            title="Аварийная сигнализация"
            size="small"
            styles={{ body: { padding: 8 } }}
            extra={<Badge count={mockAlarms.filter((a) => a.status === 'critical').length} style={{ backgroundColor: '#ff4d4f' }} />}
          >
            {mockAlarms.length === 0 ? (
              <Empty description="Нет активных аварий" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                size="small"
                dataSource={mockAlarms}
                renderItem={(item) => (
                  <List.Item style={{ padding: '6px 8px', borderLeft: `3px solid ${statusColor(item.status)}`, marginBottom: 4, background: item.status === 'critical' ? '#fff2f0' : '#fffbe6' }}>
                    <div>
                      <Space>
                        <Tag color={statusColor(item.status)}>{item.status === 'critical' ? 'АВАРИЯ' : 'ВНИМАНИЕ'}</Tag>
                        <Text strong style={{ fontSize: 12 }}>{item.param}</Text>
                      </Space>
                      <div style={{ fontSize: 11, marginTop: 2, color: '#666' }}>
                        {item.message} — {item.value} (порог: {item.threshold})
                      </div>
                      <Text type="secondary" style={{ fontSize: 10 }}>t={item.time} отсчётов</Text>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <ScreenEditorModal
        open={editorOpen}
        screenId={currentScreen.id}
        onClose={() => setEditorOpen(false)}
      />
    </div>
  );
}
