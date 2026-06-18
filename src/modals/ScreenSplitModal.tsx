import { useState } from 'react';
import { Modal, Radio, Button, Alert, Typography, Space, Tag } from 'antd';

const { Text } = Typography;

interface ScreenSplitModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ScreenSplitModal({ open, onClose }: ScreenSplitModalProps) {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
  };

  const handleClose = () => {
    setDirection('horizontal');
    setApplied(false);
    onClose();
  };

  return (
    <Modal
      title="Разделить экран"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {!applied ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Text>Выберите направление разделения рабочей области:</Text>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', margin: '8px 0' }}>
            <div
              style={{
                width: 120, height: 100, border: direction === 'horizontal' ? '2px solid #1677ff' : '1px solid #d9d9d9',
                borderRadius: 6, cursor: 'pointer', display: 'flex', flexDirection: 'column',
                overflow: 'hidden', background: direction === 'horizontal' ? '#e6f4ff' : '#fafafa',
              }}
              onClick={() => setDirection('horizontal')}
            >
              <div style={{ flex: 1, borderBottom: '2px dashed #888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>График 1</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>График 2</div>
            </div>

            <div
              style={{
                width: 100, height: 120, border: direction === 'vertical' ? '2px solid #1677ff' : '1px solid #d9d9d9',
                borderRadius: 6, cursor: 'pointer', display: 'flex',
                overflow: 'hidden', background: direction === 'vertical' ? '#e6f4ff' : '#fafafa',
              }}
              onClick={() => setDirection('vertical')}
            >
              <div style={{ width: '50%', borderRight: '2px dashed #888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>Гр.1</div>
              <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>Гр.2</div>
            </div>
          </div>

          <Tag color="blue" style={{ alignSelf: 'center' }}>
            {direction === 'horizontal' ? 'Горизонтальное (сверху/снизу)' : 'Вертикальное (слева/справа)'}
          </Tag>

          <Space style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="primary" onClick={handleApply}>
              Разделить
            </Button>
          </Space>
        </div>
      ) : (
        <Alert
          type="success"
          showIcon
          message="Экран разделён"
          description={`Рабочая область разделена ${direction === 'horizontal' ? 'горизонтально' : 'вертикально'} на 2 части.`}
          action={<Button size="small" onClick={handleClose}>Закрыть</Button>}
        />
      )}
    </Modal>
  );
}
