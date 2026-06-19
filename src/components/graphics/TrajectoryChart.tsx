import { useRef, useEffect, useCallback, useState } from 'react';
import { Card, Select, Empty, Typography, Modal, Input, Button, Tooltip, Space, message as msg } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent, MarkLineComponent, MarkAreaComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useAppStore } from '../../stores/useAppStore';
import { useGraphStore } from '../../stores/useGraphStore';
import { useViewStore } from '../../stores/useViewStore';
import TrajSavePartModal from '../../modals/TrajSavePartModal';

const { confirm } = Modal;

echarts.use([LineChart, GridComponent, TooltipComponent, DataZoomComponent, MarkLineComponent, MarkAreaComponent, CanvasRenderer]);

const { Text } = Typography;

const COLORS = ['#1677ff', '#ff4d4f', '#52c41a', '#faad14', '#722ed1', '#13c2c2'];

export default function TrajectoryChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const { activeTrajectoryId, trajectories, markers, faults, markerSetMode, setMarkerSetMode, addMarker, removeMarker } = useAppStore();
  const { scalesVisible, gridVisible, cursorMode, valuesMode } = useViewStore();
  const graphFunctions = useGraphStore((s) => s.functions);
  const { addFunction, removeFunction, xAxisParam } = useGraphStore();
  const [sampleRange, setSampleRange] = useState<[number, number]>([0, 2999]);
  const [savePartOpen, setSavePartOpen] = useState(false);

  const traj = trajectories.find((t) => t.id === activeTrajectoryId);
  const data = traj?.data || {};
  const allParams = traj?.params || [];

  useEffect(() => {
    if (allParams.length > 0 && graphFunctions.length === 0) {
      allParams.slice(0, 3).forEach((p, i) => {
        addFunction({
          id: `gf-auto-${p}`,
          paramName: p,
          color: COLORS[i % COLORS.length],
          thickness: 1.5,
          lineType: 'solid',
          scale: 'left',
          baseline: 0,
          visible: true,
        });
      });
    }
  }, [traj?.params?.join(',')]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
    }
    const chart = instanceRef.current;

    const visibleFns = graphFunctions.filter((f) => f.visible);
    if (visibleFns.length === 0 || !traj) {
      chart.clear();
      return;
    }

    const timeData = Array.from({ length: 3000 }, (_, i) => i);

    const hasRightScale = visibleFns.some(f => f.scale === 'right');

    const leftFns = visibleFns.filter(f => f.scale !== 'right');
    const rightFns = visibleFns.filter(f => f.scale === 'right');

    const calcAxisMin = (fns: typeof visibleFns) => {
      const vals = fns.map(f => f.yMin).filter((v): v is number => v != null);
      return vals.length > 0 ? Math.min(...vals) : undefined;
    };
    const calcAxisMax = (fns: typeof visibleFns) => {
      const vals = fns.map(f => f.yMax).filter((v): v is number => v != null);
      return vals.length > 0 ? Math.max(...vals) : undefined;
    };
    const leftMin = calcAxisMin(leftFns);
    const leftMax = calcAxisMax(leftFns);
    const rightMin = calcAxisMin(rightFns);
    const rightMax = calcAxisMax(rightFns);

    const series = visibleFns.map((fn) => {
      const raw = data[fn.paramName] ? data[fn.paramName] : [];
      const yIdx = fn.scale === 'right' && hasRightScale ? 1 : 0;

      let xData: number[];
      if (xAxisParam && data[xAxisParam]) {
        xData = data[xAxisParam];
      } else {
        xData = timeData;
      }

      const baseline = fn.baseline || 0;
      return {
        name: fn.paramName,
        type: 'line' as const,
        data: xData.length === raw.length
          ? raw.map((v, i) => [xData[i], v - baseline])
          : raw.map((v, i) => [timeData[i], v - baseline]),
        smooth: false,
        symbol: 'none',
        yAxisIndex: yIdx,
        lineStyle: { width: fn.thickness, type: fn.lineType },
        itemStyle: { color: fn.color },
      };
    });

    chart.off('click');
    chart.on('click', (params: any) => {
      const time = params.data?.[0] ?? params.value?.[0] ?? Math.round(params.xValue ?? 0);
      if (time == null || typeof time !== 'number') return;

      if (markerSetMode === 'set') {
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
            addMarker({ id: `m${Date.now()}`, time: Math.round(time), comment: comment.trim() || `Маркер @${Math.round(time)}` });
            setMarkerSetMode('off');
            msg.success('Маркер добавлен');
          },
          okText: 'Добавить',
          cancelText: 'Отмена',
        });
      } else if (markerSetMode === 'del') {
        const nearest = markers.reduce<{ id: string; dist: number } | null>((best, m) => {
          const d = Math.abs(m.time - time);
          if (d < 50 && (!best || d < best.dist)) return { id: m.id, dist: d };
          return best;
        }, null);
        if (nearest) {
          removeMarker(nearest.id);
          msg.success('Маркер удалён');
        } else {
          msg.info('Рядом нет маркера');
        }
        setMarkerSetMode('off');
      }
      // В обычном режиме клик по графику не добавляет маркер — используйте меню Траектория → Маркеры
    });

    chart.off('dataZoom');
    chart.on('dataZoom', () => {
      const opt = chart.getOption();
      const dz: any = Array.isArray(opt.dataZoom) ? opt.dataZoom[0] : null;
      if (dz && dz.start != null && dz.end != null) {
        const total = 3000;
        const start = Math.round(total * dz.start / 100);
        const end = Math.round(total * dz.end / 100);
        setSampleRange([start, end]);
      }
    });

    const markerLines = markers.map((m) => ({
      xAxis: m.time,
      label: { formatter: m.comment, position: 'start' as const, fontSize: 10 },
      lineStyle: { color: '#faad14', type: 'dashed' as const, width: 1 },
    }));

    const visibleParamNames = new Set(visibleFns.map(f => f.paramName));
    const faultColors: Record<string, string> = {
      'Выброс': 'rgba(255,77,79,0.08)',
      'Пропуск': 'rgba(255,77,79,0.15)',
      'Шум': 'rgba(250,173,20,0.12)',
    };
    const faultAreas = faults
      .filter(f => visibleParamNames.has(f.param))
      .map(f => ([
        { xAxis: f.start, itemStyle: { color: faultColors[f.type] || 'rgba(255,77,79,0.1)' } },
        { xAxis: f.end },
      ]));

    const axisPtrType = cursorMode === 'cross' ? 'cross'
      : cursorMode === 'vline' ? 'line'
      : cursorMode === 'arrow' ? 'shadow'
      : cursorMode === 'crossVal' ? 'cross'
      : 'line';

    const showLabel = valuesMode !== 'hidden';
    const axisPtrLabel = showLabel
      ? { show: true, formatter: (p: any) => Array.isArray(p) ? p.map((s: any) => `${s.seriesName}: ${s.value}`).join(', ') : `${p.value}` }
      : { show: false };

    chart.setOption({
      tooltip: {
        trigger: 'axis',
        confine: true,
        textStyle: { fontSize: 11 },
        axisPointer: { type: axisPtrType, label: axisPtrLabel },
      },
      grid: { left: 50, right: hasRightScale ? 50 : 16, top: 40, bottom: 60 },
      xAxis: {
        type: 'value',
        name: 'Время (отсчёты)',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { fontSize: 11 },
        show: scalesVisible,
        splitLine: { show: gridVisible, lineStyle: { type: 'dashed', color: '#f0f0f0' } },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Левая шкала',
          nameLocation: 'middle',
          nameGap: 40,
          nameTextStyle: { fontSize: 11 },
          show: scalesVisible,
          splitLine: { show: gridVisible, lineStyle: { type: 'dashed', color: '#f0f0f0' } },
          axisLine: { show: true, lineStyle: { color: '#1677ff' } },
          ...(leftMin != null ? { min: leftMin } : {}),
          ...(leftMax != null ? { max: leftMax } : {}),
        },
        ...(hasRightScale ? [{
          type: 'value',
          name: 'Правая шкала',
          nameLocation: 'middle',
          nameGap: 40,
          nameTextStyle: { fontSize: 11 },
          show: scalesVisible,
          splitLine: { show: false },
          axisLine: { show: true, lineStyle: { color: '#ff4d4f' } },
          position: 'right' as const,
          ...(rightMin != null ? { min: rightMin } : {}),
          ...(rightMax != null ? { max: rightMax } : {}),
        }] : []),
      ],
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { type: 'slider', start: 0, end: 100, height: 24, bottom: 4 },
      ],
      series: [
        ...series,
        ...(faultAreas.length > 0 ? [{
          name: 'Сбои параметров',
          type: 'line' as const,
          data: [],
          markArea: { silent: true, data: faultAreas },
        }] : []),
        {
          name: 'Маркеры',
          type: 'line' as const,
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
  }, [graphFunctions, traj, markers, faults, markerSetMode, scalesVisible, gridVisible, cursorMode, valuesMode, xAxisParam]);

  const handleResize = useCallback(() => {
    instanceRef.current?.resize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

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
        <Space wrap>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Выборка: [{sampleRange[0]}–{sampleRange[1]}]
          </Text>
          <Tooltip title="Сохранить видимый диапазон как выборку">
            <Button size="small" icon={<SaveOutlined />} onClick={() => setSavePartOpen(true)}>
              Сохранить
            </Button>
          </Tooltip>
          <Select
            mode="multiple"
            size="small"
            style={{ minWidth: 200 }}
            placeholder="Параметры на графике"
            value={graphFunctions.filter((f) => f.visible).map((f) => f.paramName)}
            onChange={(vals) => {
              allParams.forEach((p) => {
                const existing = graphFunctions.find((f) => f.paramName === p);
                if (vals.includes(p) && !existing) {
                  addFunction({
                    id: `gf-${p}`,
                    paramName: p,
                    color: COLORS[graphFunctions.length % COLORS.length],
                    thickness: 1.5,
                    lineType: 'solid',
                    scale: 'left',
                    baseline: 0,
                    visible: true,
                  });
                }
                if (!vals.includes(p) && existing) {
                  removeFunction(existing.id);
                }
              });
            }}
            options={allParams.map((p) => ({ value: p, label: p }))}
          />
        </Space>
      }
      style={{ width: '100%' }}
    >
      <div ref={chartRef} style={{ width: '100%', height: 400 }} />
      {markerSetMode !== 'off' && (
        <Text type="warning" style={{ fontSize: 12, display: 'block', marginTop: 4, color: '#faad14' }}>
          Режим {markerSetMode === 'set' ? 'установки' : 'удаления'} маркеров. Esc — отмена.
        </Text>
      )}
      <TrajSavePartModal
        open={savePartOpen}
        timeFrom={sampleRange[0]}
        timeTo={sampleRange[1]}
        onClose={() => setSavePartOpen(false)}
      />
    </Card>
  );
}
