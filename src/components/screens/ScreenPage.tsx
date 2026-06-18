import { useState } from 'react';
import { Row, Col, Card, Tag, Typography, Button, Empty, Space, List, Badge } from 'antd';
import { PlusOutlined, SettingOutlined, MonitorOutlined, WarningFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { mockTelemetryValues, mockAlarms, mockScreens } from '../../mock-data';
import ScreenEditorModal from '../../modals/ScreenEditorModal';
import type { TelemetryValue, Alarm } from '../../mock-data/types';

const { Text, Title } = Typography;

const statusIcon = (status: TelemetryValue['status']) => {
  switch (status) {
    case 'ok': return <CheckCircleFilled style={{ color: '#52c41a' }} />;
    case 'warning': return <WarningFilled style={{ color: '#faad14' }} />;
    case 'critical': return <CloseCircleFilled style={{ color: '#ff4d4f' }} />;
  }
};

const statusColor = (status: Alarm['status']) => status === 'critical' ? '#ff4d4f' : '#faad14';

export default function ScreenPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const currentScreen = mockScreens[0];

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <MonitorOutlined style={{ fontSize: 20 }} />
              <Title level={4} style={{ margin: 0 }}>Экран: {currentScreen.name}</Title>
              <Tag color="blue">СОИ</Tag>
            </Space>
            <Space>
              <Button icon={<SettingOutlined />} onClick={() => setEditorOpen(true)}>Настройки экрана</Button>
              <Button icon={<PlusOutlined />} type="primary">Создать экран</Button>
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
          <Card
            title="Видео/телеметрия"
            size="small"
            extra={<Tag color="green">LIVE</Tag>}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{
              height: 360, background: '#0a0a1a', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              color: '#666', borderRadius: 4,
            }}>
              <MonitorOutlined style={{ fontSize: 48, opacity: 0.3 }} />
              <Text type="secondary" style={{ marginTop: 8 }}>Видеопоток КА-1</Text>
              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                {['ТГ-1', 'ТГ-2', 'ТВ-1'].map((cam) => (
                  <div key={cam} style={{
                    width: 120, height: 80, background: '#1a1a3e', borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid #333', cursor: 'pointer', fontSize: 11, color: '#888',
                  }}>
                    {cam}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Мини-карта" size="small" style={{ marginTop: 12 }} styles={{ body: { padding: 0 } }}>
            <div style={{
              height: 160, background: '#f0f5ff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', borderRadius: 4,
            }}>
              <Text type="secondary">Схема расположения КА</Text>
            </div>
          </Card>
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
        screen={currentScreen}
        onClose={() => setEditorOpen(false)}
      />
    </div>
  );
}
