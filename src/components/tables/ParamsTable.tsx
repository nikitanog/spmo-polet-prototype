import { useMemo } from 'react';
import { Table, Card, Empty, Tag } from 'antd';
import { useAppStore } from '../../stores/useAppStore';
import { useTableStore } from '../../stores/useTableStore';
import { mockParams } from '../../mock-data';
import type { ColumnsType } from 'antd/es/table';

interface RowData {
  key: string;
  time: number;
  values: Record<string, number | string>;
}

export default function ParamsTable() {
  const { activeTrajectoryId, trajectories } = useAppStore();
  const tableSettings = useTableStore();
  const traj = trajectories.find((t) => t.id === activeTrajectoryId);

  const numberFormat = useMemo(() => {
    const parts = tableSettings.numberFormat.split('.');
    return parts[1] ? parts[1].length : 2;
  }, [tableSettings.numberFormat]);

  const selectedParamNames = useMemo(() => {
    return tableSettings.selectedParamIds
      .map(id => mockParams.find((p) => p.id === id)?.name)
      .filter(Boolean) as string[];
  }, [tableSettings.selectedParamIds]);

  const columns: ColumnsType<RowData> = useMemo(() => {
    if (!traj) return [];
    const params = selectedParamNames.length > 0 ? selectedParamNames : traj.params.slice(0, 10);
    const paramCols = params.map((p) => ({
      title: p,
      dataIndex: ['values', p],
      key: p,
      width: 120,
      align: 'right' as const,
      sorter: (a: RowData, b: RowData) => {
        const av = a.values[p], bv = b.values[p];
        if (typeof av === 'number' && typeof bv === 'number') return av - bv;
        return String(av).localeCompare(String(bv));
      },
      render: (v: number | string) => {
        if (v === -999) return <Tag color="red">Выброс</Tag>;
        if (v === 999) return <Tag color="orange">Пропуск</Tag>;
        if (typeof v === 'number') return v.toFixed(numberFormat);
        return v;
      },
    }));

    return [
      { title: 'Время', dataIndex: 'time', key: 'time', width: 80, fixed: 'left' as const, align: 'right', sorter: (a: RowData, b: RowData) => a.time - b.time },
      ...paramCols,
    ];
  }, [traj, selectedParamNames, numberFormat]);

  const dataSource: RowData[] = useMemo(() => {
    if (!traj) return [];
    const params = selectedParamNames.length > 0 ? selectedParamNames : traj.params.slice(0, 10);
    const skip = Math.max(1, tableSettings.stepSize);
    const rows: RowData[] = [];

    for (let i = 0; i < 3000; i += skip) {
      const row: RowData = { key: String(i), time: i, values: {} };
      for (const p of params) {
        row.values[p] = traj.data[p]?.[i] ?? '—';
      }
      rows.push(row);
    }
    return rows;
  }, [traj, selectedParamNames, tableSettings.stepSize]);

  if (!traj) {
    return (
      <Card title="Таблица значений параметров" style={{ width: '100%' }}>
        <Empty description="Нет активной траектории" />
      </Card>
    );
  }

  const totalParams = selectedParamNames.length > 0 ? selectedParamNames.length : Math.min(10, traj.params.length);

  return (
    <Card
      title={`Таблица значений (${dataSource.length} строк · ${totalParams} параметров)`}
      style={{ width: '100%' }}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        scroll={{ x: 'max-content', y: 240 }}
        pagination={{ pageSize: 25, showSizeChanger: true, pageSizeOptions: ['10', '25', '50', '100'] }}
        bordered
      />
    </Card>
  );
}
