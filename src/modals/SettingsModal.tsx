import { Modal, Tabs, Form, Input, InputNumber, Select, Switch, Radio } from 'antd';
import { useAppStore } from '../stores/useAppStore';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { mode, setMode } = useAppStore();

  const tabs = [
    {
      key: 'general',
      label: 'Общие',
      children: (
        <Form layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="Режим запуска">
            <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
              <Radio value="analysis">Анализ</Radio>
              <Radio value="flight">Полёт</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Язык интерфейса">
            <Select value="ru" style={{ width: 200 }}>
              <Select.Option value="ru">Русский</Select.Option>
              <Select.Option value="en">English</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Автосохранение траекторий">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Интервал автосохранения (мин)">
            <InputNumber min={1} max={60} defaultValue={5} />
          </Form.Item>
          <Form.Item label="Количество открытых траекторий в истории">
            <InputNumber min={1} max={50} defaultValue={10} />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'paths',
      label: 'Каталоги',
      children: (
        <Form layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="Путь к каталогу ПОЛЕТ">
            <Input defaultValue="/opt/spmo-polet/data" addonAfter="..." />
          </Form.Item>
          <Form.Item label="Путь к каталогу объектов">
            <Input defaultValue="/opt/spmo-polet/objects" addonAfter="..." />
          </Form.Item>
          <Form.Item label="Путь к БД СБИ">
            <Input defaultValue="/opt/spmo-polet/db/sbi_v5" addonAfter="..." />
          </Form.Item>
          <Form.Item label="Путь к файлам траекторий">
            <Input defaultValue="/opt/spmo-polet/trajectories" addonAfter="..." />
          </Form.Item>
          <Form.Item label="Путь к протоколам">
            <Input defaultValue="/opt/spmo-polet/logs" addonAfter="..." />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'appearance',
      label: 'Оформление',
      children: (
        <Form layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="Цветовая схема">
            <Select value={mode}>
              <Select.Option value="analysis">Анализ (светлая)</Select.Option>
              <Select.Option value="flight">Полёт (тёмная)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Шрифт">
            <Select value="system" style={{ width: 200 }}>
              <Select.Option value="system">Системный</Select.Option>
              <Select.Option value="mono">Моноширинный</Select.Option>
              <Select.Option value="large">Крупный</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Цвет фона рабочей области">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['#ffffff', '#f5f5f5', '#1a1a2e', '#16213e', '#2d2d44'].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 28, height: 28, borderRadius: 4, cursor: 'pointer',
                    background: c, border: mode === 'flight' && c === '#1a1a2e' ? '2px solid #1677ff' : '1px solid #d9d9d9',
                  }}
                />
              ))}
            </div>
          </Form.Item>
          <Form.Item label="Показывать сетку на графиках">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Толщина линий графиков">
            <Radio.Group defaultValue="normal">
              <Radio value="thin">Тонкая</Radio>
              <Radio value="normal">Средняя</Radio>
              <Radio value="thick">Толстая</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'calc',
      label: 'Расчёт',
      children: (
        <Form layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="Метод интерполяции по умолчанию">
            <Select value="spline" style={{ width: 200 }}>
              <Select.Option value="linear">Линейная</Select.Option>
              <Select.Option value="spline">Сплайн</Select.Option>
              <Select.Option value="nearest">Ближайший сосед</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Порог отбраковки выбросов (σ)">
            <InputNumber min={1} max={10} step={0.5} defaultValue={3} />
          </Form.Item>
          <Form.Item label="Тип фильтрации по умолчанию">
            <Select value="butterworth" style={{ width: 200 }}>
              <Select.Option value="butterworth">Фильтр Баттерворта</Select.Option>
              <Select.Option value="chebyshev">Фильтр Чебышева</Select.Option>
              <Select.Option value="median">Медианный фильтр</Select.Option>
              <Select.Option value="none">Без фильтрации</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Частота дискретизации (Гц) по умолчанию">
            <InputNumber min={1} max={10000} defaultValue={100} />
          </Form.Item>
          <Form.Item label="Автоматический расчёт при открытии траектории">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Modal
      title="Настройки"
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
    >
      <Tabs items={tabs} type="card" style={{ minHeight: 400 }} />
    </Modal>
  );
}
