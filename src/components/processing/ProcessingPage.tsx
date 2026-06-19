import { useState } from 'react';
import { Row, Col, Card, Table, Tag, Button, Typography, Space, Tabs, Select, InputNumber, Progress, message } from 'antd';
import { PlayCircleOutlined, PlusOutlined, BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import Chart from '../common/Chart';
import { useTaskStore } from '../../stores/useTaskStore';
import CreateTaskModal from '../../modals/CreateTaskModal';

const { Text } = Typography;

const statusColors: Record<string, string> = {
  ready: 'default',
  running: 'processing',
  done: 'success',
  queued: 'warning',
  error: 'error',
};

const statusText: Record<string, string> = {
  ready: 'Готова',
  running: 'Выполняется',
  done: 'Завершена',
  queued: 'В очереди',
  error: 'Ошибка',
};

const fftData = Array.from({ length: 200 }, (_, i) => ({
  freq: i * 5,
  amp: Math.exp(-((i - 40) ** 2) / 200) * 100 + Math.exp(-((i - 100) ** 2) / 400) * 60 + Math.random() * 5,
}));

export default function ProcessingPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const tasks = useTaskStore((s) => s.tasks);
  const runTask = useTaskStore((s) => s.runTask);
  const removeTask = useTaskStore((s) => s.removeTask);

  const taskColumns = [
    { title: 'Задача', dataIndex: 'name', key: 'name' },
    { title: 'Алгоритм', dataIndex: 'algorithm', key: 'algorithm' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColors[s] || 'default'}>{statusText[s] || s}</Tag>,
    },
    {
      title: 'Прогресс',
      dataIndex: 'progress',
      key: 'progress',
      width: 140,
      render: (p: number | undefined, record: any) =>
        record.status === 'running' ? <Progress percent={p || 0} size="small" /> : null,
    },
    {
      title: '',
      key: 'actions',
      width: 180,
      render: (_: unknown, record: any) => (
        <Space>
          {record.status === 'ready' && (
            <Button size="small" icon={<PlayCircleOutlined />} onClick={() => runTask(record.id)}>
              Запустить
            </Button>
          )}
          {record.status === 'done' && (
            <Button size="small" icon={<BarChartOutlined />} onClick={() => message.info(`Результат задачи "${record.name}": ${record.result || 'успешно'}`)}>
              Результат
            </Button>
          )}
          <Button size="small" icon={<DeleteOutlined />} onClick={() => removeTask(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <BarChartOutlined style={{ fontSize: 20 }} />
              <Text strong style={{ fontSize: 16 }}>Вторичная обработка</Text>
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
              Создать задачу
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={24}>
          <Card title="Очередь задач" size="small">
            <Table
              dataSource={tasks}
              columns={taskColumns}
              size="small"
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={12}>
          <Card title="Спектральный анализ (FFT)" size="small">
            <Tabs
              items={[
                {
                  key: 'fft',
                  label: 'Результат FFT',
                  children: (
                    <Chart
                      height={220}
                      option={{
                        tooltip: { trigger: 'axis' },
                        grid: { left: 50, right: 16, top: 16, bottom: 24 },
                        xAxis: { type: 'value', name: 'Частота (Гц)', nameTextStyle: { fontSize: 11 } },
                        yAxis: { type: 'value', name: 'Амплитуда', nameTextStyle: { fontSize: 11 } },
                        series: [{ type: 'line', data: fftData.map((d) => [d.freq, d.amp]), symbol: 'none', lineStyle: { width: 1, color: '#722ed1' }, areaStyle: { color: 'rgba(114,46,209,0.1)' } }],
                        animation: false,
                      }}
                    />
                  ),
                },
                {
                  key: 'params',
                  label: 'Параметры FFT',
                  children: (
                    <Space direction="vertical" style={{ width: '100%', padding: 8 }}>
                      <Space>
                        <Text>Параметр:</Text>
                        <Select defaultValue="V_приборная_км_ч" style={{ width: 180 }} options={['V_приборная_км_ч', 'V_истинная_км_ч', 'Крен_град', 'Темп_1_двиг_C'].map((p) => ({ value: p, label: p }))} />
                      </Space>
                      <Space>
                        <Text>Окно:</Text>
                        <Select defaultValue="hann" style={{ width: 140 }} options={[{ value: 'hann', label: 'Ханна' }, { value: 'hamming', label: 'Хэмминга' }, { value: 'blackman', label: 'Блэкмана' }, { value: 'rect', label: 'Прямоугольное' }]} />
                      </Space>
                      <Space>
                        <Text>Размер БПФ:</Text>
                        <Select defaultValue={1024} style={{ width: 120 }} options={[256, 512, 1024, 2048, 4096].map((n) => ({ value: n, label: String(n) }))} />
                      </Space>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Фильтрация" size="small">
            <Tabs
              items={[
                {
                  key: 'filter',
                  label: 'Настройка фильтра',
                  children: (
                    <Space direction="vertical" style={{ width: '100%', padding: 8 }}>
                      <Space>
                        <Text>Тип фильтра:</Text>
                        <Select defaultValue="butterworth" style={{ width: 200 }} options={[
                          { value: 'butterworth', label: 'Баттерворта ФНЧ' },
                          { value: 'butterworth_hp', label: 'Баттерворта ФВЧ' },
                          { value: 'chebyshev', label: 'Чебышева' },
                          { value: 'median', label: 'Медианный' },
                          { value: 'moving_avg', label: 'Скользящее среднее' },
                        ]} />
                      </Space>
                      <Space>
                        <Text>Частота среза (Гц):</Text>
                        <InputNumber min={1} max={1000} defaultValue={50} />
                      </Space>
                      <Space>
                        <Text>Порядок фильтра:</Text>
                        <InputNumber min={1} max={10} defaultValue={4} />
                      </Space>
                      <Space>
                        <Text>Параметр:</Text>
                        <Select defaultValue="V_приборная_км_ч" style={{ width: 180 }} options={['V_приборная_км_ч', 'V_истинная_км_ч', 'Крен_град', 'Темп_1_двиг_C'].map((p) => ({ value: p, label: p }))} />
                      </Space>
                      <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => message.info('Фильтр применён (имитация)')}>Применить фильтр</Button>
                    </Space>
                  ),
                },
                {
                  key: 'result',
                  label: 'Результат',
                  children: (
                    <Chart
                      key="filter-chart"
                      height={220}
                      option={{
                        tooltip: { trigger: 'axis' },
                        grid: { left: 50, right: 16, top: 16, bottom: 24 },
                        xAxis: { type: 'value' },
                        yAxis: { type: 'value' },
                        series: [
                          { name: 'Исходный', type: 'line', data: Array.from({ length: 300 }, (_, i) => [i, 50 + Math.sin(i / 10) * 20 + (Math.random() - 0.5) * 30]), symbol: 'none', lineStyle: { width: 1, color: '#1677ff', opacity: 0.5 } },
                          { name: 'После фильтрации', type: 'line', data: Array.from({ length: 300 }, (_, i) => [i, 50 + Math.sin(i / 10) * 20]), symbol: 'none', lineStyle: { width: 2, color: '#52c41a' } },
                        ],
                        animation: false,
                      }}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
