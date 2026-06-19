import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Tree, Input, Select, Table, Tag, Button, Typography, Space, Badge, message } from 'antd';
import { SearchOutlined, PlusOutlined, ImportOutlined, ExportOutlined, EditOutlined, DatabaseOutlined } from '@ant-design/icons';
import { mockParams, mockTopics } from '../../mock-data';
import ParamPropertiesModal from '../../modals/ParamPropertiesModal';
import ImportDbModal from '../../modals/ImportDbModal';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

const { Text } = Typography;

interface ParamRow {
  key: string;
  name: string;
  type: string;
  unit: string;
  min: number;
  max: number;
  subdivision: string;
  category: string;
  description: string;
}

export default function DatabasePage() {
  const [searchParams] = useSearchParams();
  const dbType = searchParams.get('db');
  const openedFile = searchParams.get('opened');
  const dbTitle = dbType === 'current' ? 'Текущая БД СБИ'
    : dbType === 'calc' ? 'Расчётная БД СБИ'
    : openedFile ? `БД СБИ: ${openedFile}`
    : 'База данных СБИ';

  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [subdivisionFilter, setSubdivisionFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    dbType === 'current' ? 'Истинные значения' : dbType === 'calc' ? 'Расчётные значения' : undefined
  );
  const [selectedParam, setSelectedParam] = useState<ParamRow | null>(null);
  const [propsOpen, setPropsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['all', ...mockTopics.map(t => t.id)]);

  const subdivisions = useMemo(
    () => [...new Set(mockParams.map(p => p.subdivision))].sort(),
    []
  );

  const treeData: DataNode[] = useMemo(() => [{
    title: <Text strong>{dbTitle}</Text>,
    key: 'all',
    children: mockTopics.map(topic => ({
      title: <Text strong style={{ fontSize: 13 }}>{topic.name}</Text>,
      key: topic.id,
      isLeaf: false,
      children: topic.objects.map(obj => ({
        title: <Text>{obj.name}</Text>,
        key: obj.id,
        isLeaf: false,
        children: subdivisions.map(sub => ({
          title: sub,
          key: `sub-${obj.id}-${sub}`,
          isLeaf: false,
          children: [...new Set(
            mockParams.filter(p => p.subdivision === sub).map(p => p.category)
          )].map(cat => ({
            title: cat,
            key: `cat-${obj.id}-${sub}-${cat}`,
            isLeaf: true,
          })),
        })),
      })),
    })),
  }], [dbTitle]);

  const allParams: ParamRow[] = useMemo(
    () => mockParams.map((p) => ({ key: p.id, ...p })),
    [],
  );

  const typeOptions = useMemo(
    () => [...new Set(allParams.map((p) => p.type))].map((t) => ({ value: t, text: t })),
    [],
  );

  const subdivisionOptions = useMemo(
    () => subdivisions.map((s) => ({ value: s, text: s })),
    [],
  );

  const categoryOptions = useMemo(
    () => [...new Set(allParams.map((p) => p.category))].map((c) => ({ value: c, text: c })),
    [],
  );

  const filtered = useMemo(() => {
    return allParams.filter((p) => {
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase()) && !p.description.toLowerCase().includes(searchText.toLowerCase())) return false;
      if (typeFilter && p.type !== typeFilter) return false;
      if (subdivisionFilter && p.subdivision !== subdivisionFilter) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      return true;
    });
  }, [searchText, typeFilter, subdivisionFilter, categoryFilter]);

  const columns: ColumnsType<ParamRow> = [
    { title: 'Параметр', dataIndex: 'name', key: 'name', width: 160, fixed: 'left', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Тип', dataIndex: 'type', key: 'type', width: 100, render: (v) => <Tag>{v}</Tag> },
    { title: 'Ед.изм.', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: 'Мин', dataIndex: 'min', key: 'min', width: 80, align: 'right' },
    { title: 'Макс', dataIndex: 'max', key: 'max', width: 80, align: 'right' },
    { title: 'Подразделение', dataIndex: 'subdivision', key: 'subdivision', width: 160 },
    { title: 'Категория', dataIndex: 'category', key: 'category', width: 140 },
    { title: 'Описание', dataIndex: 'description', key: 'description', ellipsis: true },
  ];

  const handleRowDoubleClick = (record: ParamRow) => {
    setSelectedParam(record);
    setPropsOpen(true);
  };

  const handleTreeSelect = (keys: React.Key[]) => {
    if (keys.length === 0) return;
    const key = keys[0] as string;
    if (key === 'all') {
      setSubdivisionFilter(undefined);
      setCategoryFilter(undefined);
      setSearchText('');
    } else if (key.startsWith('cat-')) {
      const parts = key.split('-');
      const sub = parts[2];
      const cat = parts.slice(3).join('-');
      setSubdivisionFilter(sub);
      setCategoryFilter(cat);
      setSearchText('');
      message.info(`Параметры: ${sub} → ${cat}`);
    } else if (key.startsWith('sub-')) {
      const sub = key.split('-').slice(2).join('-');
      setSubdivisionFilter(sub);
      setCategoryFilter(undefined);
      setSearchText('');
    } else {
      const isTopic = mockTopics.some(t => t.id === key);
      const isObject = mockTopics.flatMap(t => t.objects).some(o => o.id === key);
      if (isObject) {
        setSubdivisionFilter(undefined);
        setCategoryFilter(undefined);
        setSearchText('');
        const obj = mockTopics.flatMap(t => t.objects).find(o => o.id === key);
        message.info(`Выбран объект: ${obj?.name} — ${mockParams.length} доступных параметров`);
      } else if (isTopic) {
        const topic = mockTopics.find(t => t.id === key);
        message.info(`Тема: ${topic?.name} — ${topic?.objects.length} бортов`);
      }
    }
  };

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space>
            <DatabaseOutlined style={{ fontSize: 20 }} />
            <Text strong style={{ fontSize: 16 }}>{dbTitle}</Text>
            <Tag color={dbType === 'current' ? 'blue' : dbType === 'calc' ? 'purple' : 'default'}>
              {dbType === 'current' ? 'Истинные значения' : dbType === 'calc' ? 'Расчётные значения' : 'Полный набор'}
            </Tag>
            <Text type="secondary">{subdivisions.length} подразделений, {allParams.length} параметров</Text>
          </Space>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
        <Col span={5}>
          <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            style={{ background: 'transparent' }}
            selectedKeys={['all']}
            onSelect={handleTreeSelect}
          />
        </Col>
        <Col span={19}>
          <Space style={{ marginBottom: 8, width: '100%' }} wrap>
            <Input
              placeholder="Поиск параметра..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240 }}
              allowClear
            />
            <Select
              placeholder="Тип"
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeOptions}
              allowClear
              style={{ width: 140 }}
            />
            <Select
              placeholder="Подразделение"
              value={subdivisionFilter}
              onChange={setSubdivisionFilter}
              options={subdivisionOptions}
              allowClear
              style={{ width: 180 }}
            />
            <Select
              placeholder="Категория"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              allowClear
              style={{ width: 180 }}
            />
            <Badge count={allParams.length - filtered.length > 0 ? allParams.length - filtered.length : 0} style={{ backgroundColor: '#1677ff' }}>
              <Text type="secondary">{filtered.length} из {allParams.length}</Text>
            </Badge>
          </Space>

          <Space style={{ marginBottom: 8 }}>
            <Button icon={<EditOutlined />} onClick={() => handleRowDoubleClick(filtered[0] || allParams[0])}>Редактор</Button>
            <Button icon={<ImportOutlined />} onClick={() => setImportOpen(true)}>Импорт</Button>
            <Button icon={<ExportOutlined />} onClick={() => message.info('Экспорт данных БД')}>Экспорт</Button>
            <Button icon={<PlusOutlined />} type="dashed" onClick={() => { setSelectedParam(null); setPropsOpen(true); }}>Создать параметр</Button>
          </Space>

          <Table
            dataSource={filtered}
            columns={columns}
            size="small"
            scroll={{ x: 1000, y: 480 }}
            pagination={{ pageSize: 50, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'] }}
            bordered
            onRow={(record) => ({
              onDoubleClick: () => handleRowDoubleClick(record),
              style: { cursor: 'pointer' },
            })}
          />
        </Col>
      </Row>

      <ParamPropertiesModal
        open={propsOpen}
        param={selectedParam}
        onClose={() => setPropsOpen(false)}
      />
      <ImportDbModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
