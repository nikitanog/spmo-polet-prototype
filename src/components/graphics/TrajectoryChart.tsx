import { useRef, useEffect, useState, useCallback } from 'react';
import { Card, Select, Empty, Typography, Modal, Input } from 'antd';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent, MarkLineComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useAppStore } from '../../stores/useAppStore';
import { useViewStore } from '../../stores/useViewStore';

const { confirm } = Modal;

echarts.use([LineChart, GridComponent, TooltipComponent, DataZoomComponent, MarkLineComponent, CanvasRenderer]);

const { Text } = Typography;

export default function TrajectoryChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const { activeTrajectoryId, trajectories, markers } = useAppStore();
  const { scalesVisible, gridVisible, cursorMode } = useViewStore();
  const [selectedParams, setSelectedParams] = useState<string[]>([]);

  const traj = trajectories.find((t) => t.id === activeTrajectoryId);
  const data = traj?.data || {};
  const allParams = traj?.params || [];

  useEffect(() => {
    if (allParams.length > 0 && selectedParams.length === 0) {
      setSelectedParams(allParams.slice(0, 3));
    }
  }, [allParams.join(',')]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
    }
    const chart = instanceRef.current;

    if (selectedParams.length === 0 || !traj) {
      chart.clear();
      return;
    }

    const timeData = Array.from({ length: 3000 }, (_, i) => i);
    const colors = ['#1677ff', '#ff4d4f', '#52c41a', '#faad14', '#722ed1', '#13c2c2'];

    const series = selectedParams.map((param, idx) => ({
      name: param,
      type: 'line' as const,
      data: data[param]
        ? data[param].map((v, i) => [timeData[i], v])
        : [],
      smooth: false,
      symbol: 'none',
      lineStyle: { width: 1.5 },
      itemStyle: { color: colors[idx % colors.length] },
    }));

    chart.off('click');
    chart.on('click', (params: any) => {
      const time = params.data?.[0] ?? params.value?.[0] ?? Math.round(params.xValue ?? 0);
      if (time == null || typeof time !== 'number') return;
      let comment = '';
      confirm({
        title: 'Установить маркер',
        content: (
          <div style={{ marginTop: 8 }}>
            <div style={{ marginBottom: 4, fontSize: 12, color: '#888' }}>Время: {Math.round(time)} отсчётов</div>
            <Input
              placeholder="Комментарий (например: Взлёт)"
              onChange={(e) => { comment = e.target.value; }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        ),
        onOk: () => {
          if (comment.trim()) {
            useAppStore.getState().addMarker({
              id: `m${Date.now()}`,
              time: Math.round(time),
              comment: comment.trim(),
            });
          }
        },
        okText: 'Добавить',
        cancelText: 'Отмена',
      });
    });

    const markerLines = markers.map((m) => ({
      xAxis: m.time,
      label: { formatter: m.comment, position: 'start' as const, fontSize: 10 },
      lineStyle: { color: '#faad14', type: 'dashed' as const, width: 1 },
    }));

    const axisPointer: any = cursorMode === 'cross'
      ? { link: [{ xAxisIndex: 0 }], label: { show: true } }
      : cursorMode === 'crossVal'
        ? { link: [{ xAxisIndex: 0 }], label: { show: true, formatter: (p: any) => `${p.seriesName}: ${p.value}` } }
        : cursorMode === 'vline'
          ? { type: 'line', snap: true, label: { show: true } }
          : undefined;

    chart.setOption({
      tooltip: {
        trigger: 'axis',
        confine: true,
        textStyle: { fontSize: 11 },
        axisPointer: cursorMode === 'arrow' ? undefined : { type: 'cross' },
      },
      grid: { left: 50, right: 16, top: 40, bottom: 60 },
      xAxis: {
        type: 'value',
        name: 'Время (отсчёты)',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { fontSize: 11 },
        show: scalesVisible,
        splitLine: { show: gridVisible, lineStyle: { type: 'dashed', color: '#f0f0f0' } },
      },
      yAxis: {
        type: 'value',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: { fontSize: 11 },
        show: scalesVisible,
        splitLine: { show: gridVisible, lineStyle: { type: 'dashed', color: '#f0f0f0' } },
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { type: 'slider', start: 0, end: 100, height: 24, bottom: 4 },
      ],
      series: [
        ...series,
        {
          name: 'Маркеры',
          type: 'line',
          data: [],
          markLine: { silent: true, data: markerLines },
        },
      ],
      animation: false,
    });

    return () => {
      chart.dispose();
      instanceRef.current = null;
    };
  }, [selectedParams, traj, markers, scalesVisible, gridVisible, cursorMode]);

  const handleResize = () => {
    instanceRef.current?.resize();
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!traj) {
    return (
      <Card title="График траектории" style={{ width: '100%' }}>
        <Empty description="Нет активной траектории" />
      </Card>
    );
  }

  return (
    <Card
      title="График траектории"
      extra={
        <Select
          mode="multiple"
          size="small"
          style={{ minWidth: 200 }}
          placeholder="Выберите параметры"
          value={selectedParams}
          onChange={setSelectedParams}
          options={allParams.map((p) => ({ value: p, label: p }))}
        />
      }
      style={{ width: '100%' }}
    >
      <div ref={chartRef} style={{ width: '100%', height: 400 }} />
      <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
        Жёлтые пунктиры — маркеры событий. Зум: колесо мыши или слайдер снизу.
      </Text>
    </Card>
  );
}
