import { useMemo } from 'react';
import { Table, Card, Empty, Tag } from 'antd';
import { useAppStore } from '../../stores/useAppStore';
import type { ColumnsType } from 'antd/es/table';

interface RowData {
  key: string;
  time: number;
  values: Record<string, number | string>;
}

export default function ParamsTable() {
  const { activeTrajectoryId, trajectories } = useAppStore();
  const traj = trajectories.find((t) => t.id === activeTrajectoryId);

  const columns: ColumnsType<RowData> = useMemo(() => {
    if (!traj) return [];
    const paramCols = traj.params.slice(0, 10).map((p) => ({
      title: p,
      dataIndex: ['values', p],
      key: p,
      width: 120,
      align: 'right' as const,
      render: (v: number | string) => {
        if (v === -999) return <Tag color="red">Выброс</Tag>;
        if (v === 999) return <Tag color="orange">Пропуск</Tag>;
        if (typeof v === 'number') return v.toFixed(2);
        return v;
      },
    }));

    return [
      { title: 'Время', dataIndex: 'time', key: 'time', width: 80, fixed: 'left' as const, align: 'right' },
      ...paramCols,
    ];
  }, [traj]);

  const dataSource: RowData[] = useMemo(() => {
    if (!traj) return [];
    const points = 500;
    const skip = Math.floor(3000 / points);
    const rows: RowData[] = [];
    const paramKeys = traj.params.slice(0, 10);

    for (let i = 0; i < 3000; i += skip) {
      const row: RowData = { key: String(i), time: i, values: {} };
      for (const p of paramKeys) {
        row.values[p] = traj.data[p]?.[i] ?? '—';
      }
      rows.push(row);
    }
    return rows;
  }, [traj]);

  if (!traj) {
    return (
      <Card title="Таблица значений параметров" style={{ width: '100%' }}>
        <Empty description="Нет активной траектории" />
      </Card>
    );
  }

  return (
    <Card
      title={`Таблица значений (${traj.params.slice(0, 10).join(', ')}${traj.params.length > 10 ? `... +${traj.params.length - 10}` : ''})`}
      style={{ width: '100%' }}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        scroll={{ x: 'max-content', y: 240 }}
        pagination={{ pageSize: 25, showSizeChanger: false }}
        bordered
      />
    </Card>
  );
}
