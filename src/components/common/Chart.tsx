import { useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

interface ChartProps {
  option: echarts.EChartsCoreOption;
  style?: React.CSSProperties;
  height?: number;
}

export default function Chart({ option, style, height = 200 }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
    }
    instanceRef.current.setOption(option, { notMerge: true });
    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [option]);

  useEffect(() => {
    const handler = () => instanceRef.current?.resize();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height, ...style }} />;
}
