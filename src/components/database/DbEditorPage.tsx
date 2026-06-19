import { useState, useMemo } from 'react';
import { Row, Col, Tree, Input, Select, Table, Tag, Button, Typography, Space, Modal, message, Tabs, Form, InputNumber } from 'antd';
import {
  SearchOutlined, PlusOutlined, SaveOutlined, CheckCircleOutlined, DeleteOutlined, EditOutlined,
} from '@ant-design/icons';
import { mockParams, mockTopics } from '../../mock-data';
import type { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;
const { confirm } = Modal;

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

export default function DbEditorPage() {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [params, setParams] = useState<ParamRow[]>(
    () => mockParams.map((p) => ({ key: p.id, ...p }))
  );
  const [editingParam, setEditingParam] = useState<ParamRow | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('params');

  const typeOptions = useMemo(
    () => [...new Set(params.map((p) => p.type))].map((t) => ({ value: t, text: t })),
    [params],
  );

  const filtered = useMemo(() => {
    return params.filter((p) => {
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase()) && !p.description.toLowerCase().includes(searchText.toLowerCase())) return false;
      if (typeFilter && p.type !== typeFilter) return false;
      return true;
    });
  }, [searchText, typeFilter, params]);

  const columns: ColumnsType<ParamRow> = [
    { title: 'Параметр', dataIndex: 'name', key: 'name', width: 160, fixed: 'left', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Тип', dataIndex: 'type', key: 'type', width: 100, render: (v) => <Tag>{v}</Tag> },
    { title: 'Ед.изм.', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: 'Мин', dataIndex: 'min', key: 'min', width: 80, align: 'right' },
    { title: 'Макс', dataIndex: 'max', key: 'max', width: 80, align: 'right' },
    { title: 'Подразделение', dataIndex: 'subdivision', key: 'subdivision', width: 160 },
    { title: 'Категория', dataIndex: 'category', key: 'category', width: 140 },
    { title: 'Описание', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Действия', key: 'actions', width: 100, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const handleEdit = (record: ParamRow) => {
    setEditingParam({ ...record });
    setEditModalOpen(true);
  };

  const handleDelete = (record: ParamRow) => {
    confirm({
      title: 'Удалить параметр?',
      content: `Параметр «${record.name}» будет удалён из БД.`,
      onOk: () => {
        setParams((prev) => prev.filter((p) => p.key !== record.key));
        message.success(`Параметр «${record.name}» удалён`);
      },
    });
  };

  const handleSaveEdit = () => {
    if (!editingParam) return;
    setParams((prev) =>
      prev.map((p) => (p.key === editingParam.key ? editingParam : p))
    );
    setEditModalOpen(false);
    setEditingParam(null);
    message.success('Параметр обновлён');
  };

  const handleAddParam = () => {
    const newKey = `p${Date.now()}`;
    const newParam: ParamRow = {
      key: newKey,
      name: `Новый_параметр_${params.length + 1}`,
      type: 'Analog',
      unit: 'м',
      min: 0,
      max: 100,
      subdivision: 'Подразделение 1',
      category: 'Категория 1',
      description: 'Новый параметр',
    };
    setParams((prev) => [...prev, newParam]);
    setEditingParam(newParam);
    setEditModalOpen(true);
    message.info('Новый параметр добавлен. Заполните свойства.');
  };

  const treeData = mockTopics.map((t) => ({
    title: t.name,
    key: t.id,
    children: t.objects.map((o) => ({
      title: o.name,
      key: o.id,
    })),
  }));

  const tabItems = [
    {
      key: 'params',
      label: 'Параметры',
      children: (
        <>
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
            <Text type="secondary">{filtered.length} из {params.length}</Text>
          </Space>
          <Space style={{ marginBottom: 8 }}>
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAddParam}>Создать</Button>
            <Button icon={<SaveOutlined />}>Сохранить</Button>
            <Button icon={<CheckCircleOutlined />}>Проверить</Button>
          </Space>
          <Table
            dataSource={filtered}
            columns={columns}
            size="small"
            scroll={{ x: 1100, y: 480 }}
            pagination={{ pageSize: 50, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'] }}
            bordered
          />
        </>
      ),
    },
    {
      key: 'structure',
      label: 'Структура',
      children: (
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ width: 240 }}>
            <Text strong>Подразделения</Text>
            <Tree
              treeData={[
                { title: 'Подразделение 1', key: 'sub1', children: [
                  { title: 'Категория 1', key: 'cat1' },
                  { title: 'Категория 2', key: 'cat2' },
                ]},
                { title: 'Подразделение 2', key: 'sub2', children: [
                  { title: 'Категория 3', key: 'cat3' },
                ]},
              ]}
              defaultExpandAll
              style={{ marginTop: 8 }}
            />
          </div>
          <div>
            <Text strong>Информация</Text>
            <div style={{ marginTop: 8, color: '#888', fontSize: 13 }}>
              <p>Всего параметров: {params.length}</p>
              <p>Подразделений: {new Set(params.map(p => p.subdivision)).size}</p>
              <p>Категорий: {new Set(params.map(p => p.category)).size}</p>
              <p>Типов: {new Set(params.map(p => p.type)).size}</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Title level={4} style={{ margin: 0 }}>Редактор БД СБИ</Title>
          <Text type="secondary">Создание, редактирование и проверка базы данных параметров</Text>
        </Col>
      </Row>
      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={5}>
          <Tree
            treeData={treeData}
            defaultExpandAll
            style={{ background: 'transparent' }}
            onSelect={(keys) => {
              if (keys.length === 0) return;
              const key = keys[0] as string;
              const topic = mockTopics.find(t => t.id === key);
              if (topic) {
                setSearchText('');
                setTypeFilter(undefined);
                setActiveTab('params');
              } else {
                const obj = mockTopics.flatMap(t => t.objects).find(o => o.id === key);
                if (obj) {
                  setSearchText(obj.name);
                  setActiveTab('params');
                }
              }
            }}
          />
        </Col>
        <Col span={19}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        </Col>
      </Row>

      <Modal
        title="Редактировать параметр"
        open={editModalOpen}
        onCancel={() => { setEditModalOpen(false); setEditingParam(null); }}
        onOk={handleSaveEdit}
        okText="Сохранить"
        cancelText="Отмена"
        width={500}
      >
        {editingParam && (
          <Form layout="vertical" style={{ marginTop: 8 }}>
            <Form.Item label="Наименование">
              <Input
                value={editingParam.name}
                onChange={(e) => setEditingParam({ ...editingParam, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Тип">
              <Select
                value={editingParam.type}
                onChange={(v) => setEditingParam({ ...editingParam, type: v })}
                options={['Analog', 'Discrete', 'ARINC-429', 'MKIO', 'SNS'].map((t) => ({ value: t, label: t }))}
              />
            </Form.Item>
            <Space>
              <Form.Item label="Ед. изм.">
                <Input
                  value={editingParam.unit}
                  onChange={(e) => setEditingParam({ ...editingParam, unit: e.target.value })}
                  style={{ width: 100 }}
                />
              </Form.Item>
              <Form.Item label="Мин">
                <InputNumber
                  value={editingParam.min}
                  onChange={(v) => setEditingParam({ ...editingParam, min: v ?? 0 })}
                  style={{ width: 100 }}
                />
              </Form.Item>
              <Form.Item label="Макс">
                <InputNumber
                  value={editingParam.max}
                  onChange={(v) => setEditingParam({ ...editingParam, max: v ?? 100 })}
                  style={{ width: 100 }}
                />
              </Form.Item>
            </Space>
            <Form.Item label="Подразделение">
              <Input
                value={editingParam.subdivision}
                onChange={(e) => setEditingParam({ ...editingParam, subdivision: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Категория">
              <Input
                value={editingParam.category}
                onChange={(e) => setEditingParam({ ...editingParam, category: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Описание">
              <Input.TextArea
                value={editingParam.description}
                onChange={(e) => setEditingParam({ ...editingParam, description: e.target.value })}
                rows={3}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
