import { Modal, Descriptions, Tag, Typography, Divider, InputNumber, Button, Form } from 'antd';

const { Text } = Typography;

interface ParamPropertiesModalProps {
  open: boolean;
  param: { key: string; name: string; type: string; unit: string; min: number; max: number; subdivision: string; category: string; description: string } | null;
  onClose: () => void;
}

export default function ParamPropertiesModal({ open, param, onClose }: ParamPropertiesModalProps) {
  if (!param) return null;

  const typeColors: Record<string, string> = {
    Analog: 'blue',
    Discrete: 'purple',
    'ARINC-429': 'cyan',
    MKIO: 'orange',
    SNS: 'green',
  };

  return (
    <Modal
      title={`Свойства параметра: ${param.name}`}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>Закрыть</Button>,
        <Button key="edit" type="primary">Редактировать</Button>,
      ]}
      width={520}
    >
      <Descriptions column={2} size="small" bordered style={{ marginTop: 8 }}>
        <Descriptions.Item label="Наименование" span={2}>{param.name}</Descriptions.Item>
        <Descriptions.Item label="Тип">
          <Tag color={typeColors[param.type] || 'default'}>{param.type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Единица измерения">{param.unit}</Descriptions.Item>
        <Descriptions.Item label="Минимум">{param.min}</Descriptions.Item>
        <Descriptions.Item label="Максимум">{param.max}</Descriptions.Item>
        <Descriptions.Item label="Подразделение" span={2}>{param.subdivision}</Descriptions.Item>
        <Descriptions.Item label="Категория" span={2}>{param.category}</Descriptions.Item>
        <Descriptions.Item label="Описание" span={2}>{param.description}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Text strong>Градуировка</Text>
      <Form layout="inline" style={{ marginTop: 8, gap: 8 }}>
        <Form.Item label="Коэфф.">
          <InputNumber defaultValue={1.0} step={0.01} />
        </Form.Item>
        <Form.Item label="Смещение">
          <InputNumber defaultValue={0.0} step={0.01} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
