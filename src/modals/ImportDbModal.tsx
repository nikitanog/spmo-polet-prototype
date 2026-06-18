import { Modal, Steps, Select, Upload, Button, Alert, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text } = Typography;
const { Dragger } = Upload;

interface ImportDbModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportDbModal({ open, onClose }: ImportDbModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sourceType, setSourceType] = useState<string | null>(null);

  const handleReset = () => {
    setCurrentStep(0);
    setSourceType(null);
    onClose();
  };

  const steps = [
    {
      title: 'Источник',
      content: (
        <div style={{ minHeight: 200, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <Text>Выберите формат исходных данных:</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Формат файла"
            value={sourceType}
            onChange={setSourceType}
            options={[
              { value: 'excel', label: 'Microsoft Excel (.xlsx, .xls)' },
              { value: 'csv', label: 'Текстовый файл (.csv, .txt)' },
              { value: 'kam500', label: 'КАМ-500' },
              { value: 'dbf', label: 'DBF' },
              { value: 'dirac', label: 'DIRAC' },
            ]}
          />
          {sourceType && (
            <Alert
              type="info"
              message={sourceType === 'excel' ? 'Будет выполнен импорт листов Excel в структуру БД СБИ' : `Выбран формат: ${sourceType}`}
              showIcon
            />
          )}
        </div>
      ),
    },
    {
      title: 'Файл',
      content: (
        <div style={{ minHeight: 200, paddingTop: 16 }}>
          <Dragger
            name="file"
            multiple={false}
            showUploadList={true}
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Перетащите файл сюда или кликните для выбора</p>
            <p className="ant-upload-hint">
              Поддерживаемые форматы: .xlsx, .xls, .csv, .txt, .dbf
            </p>
          </Dragger>
        </div>
      ),
    },
    {
      title: 'Результат',
      content: (
        <div style={{ minHeight: 200, paddingTop: 16 }}>
          <Alert
            type="success"
            message="Импорт завершён"
            description="В базу данных СБИ добавлено 15 новых параметров. 3 параметра обновлены. 0 ошибок."
            showIcon
          />
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Мастер импорта БД"
      open={open}
      onCancel={handleReset}
      footer={
        currentStep < steps.length - 1
          ? [
              <Button key="cancel" onClick={handleReset}>Отмена</Button>,
              <Button key="next" type="primary" disabled={!sourceType} onClick={() => setCurrentStep(currentStep + 1)}>Далее</Button>,
            ]
          : [
              <Button key="close" onClick={handleReset}>Закрыть</Button>,
            ]
      }
      width={560}
    >
      <Steps current={currentStep} items={steps.map((s) => ({ title: s.title }))} style={{ marginBottom: 16 }} />
      {steps[currentStep].content}
    </Modal>
  );
}
