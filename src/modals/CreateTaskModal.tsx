import { Modal, Form, Select, Input, message } from 'antd';
import { useTaskStore } from '../stores/useTaskStore';

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

const paramOptions = ['V_приборная_км_ч', 'V_истинная_км_ч', 'Крен_град', 'Тангаж_град', 'Расход_топлива_кг_ч', 'Темп_1_двиг_C']
  .map((p) => ({ value: p, label: p }));

export default function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
  const [form] = Form.useForm();
  const addTask = useTaskStore((s) => s.addTask);

  const handleOk = () => {
    const values = form.getFieldsValue();
    form.validateFields().then(() => {
      addTask({
        name: values.name,
        algorithm: algorithmGroups
          .flatMap((g) => g.options)
          .find((o) => o.value === values.algorithm)?.label || values.algorithm,
        status: 'ready',
      });
      message.success(`Задача «${values.name}» создана`);
      form.resetFields();
      onClose();
    }).catch(() => {});
  };

  const algorithm = Form.useWatch('algorithm', form);

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
          <Input placeholder="Например: Фильтрация шумов V_приборная_км_ч" />
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
        {algorithm?.startsWith('calc_') && (
          <Form.Item label="Формула/выражение" name="formula">
            <Input placeholder="Например: A + B * 2" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
