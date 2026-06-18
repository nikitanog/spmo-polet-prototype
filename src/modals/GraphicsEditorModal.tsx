import { Modal, Button, Typography, Space } from 'antd';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

const { Text } = Typography;

interface GraphicsEditorModalProps {
  open: boolean;
  onClose: () => void;
}

const templateGrids = [
  { key: '1x1', label: '1x1' },
  { key: '1x2', label: '1x2' },
  { key: '2x1', label: '2x1' },
  { key: '2x2', label: '2x2' },
];

export default function GraphicsEditorModal({ open, onClose }: GraphicsEditorModalProps) {
  return (
    <Modal
      title="Графический редактор шаблонов"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Закрыть</Button>}
      width={780}
    >
      <Space style={{ marginBottom: 12 }}>
        <Button>Создать файл шаблона</Button>
        <Button>Открыть...</Button>
        <Button>Сохранить</Button>
      </Space>
      <Space style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap' }}>
        <Text>Добавить:</Text>
        {templateGrids.map(g => <Button key={g.key} size="small">{g.label}</Button>)}
        <Button size="small">Легенду</Button>
        <Button size="small">Линию</Button>
        <Button size="small">Текст</Button>
        <Button size="small">Выноску</Button>
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 8 }}>
        <ReactEChartsCore
          echarts={echarts}
          option={{
            grid: [
              { left: 50, right: 16, top: 16, height: '35%' },
              { left: 50, right: 16, bottom: 16, height: '35%' },
            ],
            xAxis: [{ type: 'value', gridIndex: 0 }, { type: 'value', gridIndex: 1 }],
            yAxis: [{ type: 'value', gridIndex: 0 }, { type: 'value', gridIndex: 1 }],
            series: [
              { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 50 + Math.sin(i / 20) * 20]), symbol: 'none', lineStyle: { width: 1.5, color: '#1677ff' }, xAxisIndex: 0, yAxisIndex: 0 },
              { type: 'line', data: Array.from({ length: 200 }, (_, i) => [i, 30 + Math.cos(i / 15) * 15]), symbol: 'none', lineStyle: { width: 1.5, color: '#ff4d4f' }, xAxisIndex: 1, yAxisIndex: 1 },
            ],
            animation: false,
          }}
          style={{ height: 300 }}
        />
      </div>
    </Modal>
  );
}
