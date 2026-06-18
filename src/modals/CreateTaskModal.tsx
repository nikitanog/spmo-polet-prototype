import { Modal, Form, Select, Input } from 'antd';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

const algorithmGroups = [
  { label: 'Фильтрация', options: [
    { value: 'butterworth_lpf', label: 'Фильтр Баттерворта ФНЧ' },
    { value: 'butterworth_hpf', label: 'Фильтр Баттерворта ФВЧ' },
    { value: 'chebyshev', label: 'Фильтр Чебышева' },
    { value: 'median', label: 'Медианный фильтр' },
    { value: 'moving_avg', label: 'Скользящее среднее' },
    { value: 'kalman', label: 'Фильтр Калмана' },
  ]},
  { label: 'Спектральный анализ', options: [
    { value: 'fft', label: 'БПФ (FFT)' },
    { value: 'stft', label: 'Коротковременное БПФ' },
    { value: 'welch', label: 'Метод Уэлча' },
    { value: 'cepstrum', label: 'Кепстральный анализ' },
  ]},
  { label: 'Статистика', options: [
    { value: 'stat_basic', label: 'Основные статистики' },
    { value: 'stat_corr', label: 'Корреляционный анализ' },
    { value: 'stat_hist', label: 'Гистограмма' },
  ]},
  { label: 'Расчётные параметры', options: [
    { value: 'calc_formula', label: 'Расчёт по формуле' },
    { value: 'calc_integral', label: 'Интегрирование' },
    { value: 'calc_derivative', label: 'Дифференцирование' },
  ]},
];

const paramOptions = ['Параметр_001', 'Параметр_002', 'Параметр_010', 'Параметр_020', 'Параметр_030', 'Параметр_050']
  .map((p) => ({ value: p, label: p }));

export default function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Создать задачу обработки"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Создать"
      cancelText="Отмена"
      width={480}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item label="Название задачи" name="name" rules={[{ required: true, message: 'Введите название' }]}>
          <Input placeholder="Например: Фильтрация шумов Параметр_001" />
        </Form.Item>
        <Form.Item label="Алгоритм" name="algorithm" rules={[{ required: true, message: 'Выберите алгоритм' }]}>
          <Select
            placeholder="Выберите алгоритм обработки"
            options={algorithmGroups}
            showSearch
          />
        </Form.Item>
        <Form.Item label="Входные параметры" name="params" rules={[{ required: true, message: 'Выберите параметры' }]}>
          <Select mode="multiple" placeholder="Выберите параметры" options={paramOptions} />
        </Form.Item>
        {form.getFieldValue('algorithm')?.startsWith('calc_') && (
          <Form.Item label="Формула/выражение" name="formula">
            <Input placeholder="Например: A + B * 2" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
