import { Modal, Tabs, Form, Input, InputNumber, Select, Switch, Radio } from 'antd';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useAppStore } from '../stores/useAppStore';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const settings = useSettingsStore();
  const setAppMode = useAppStore((s) => s.setMode);

  const tabs = [
    {
      key: 'general',
      label: 'Общие',
      children: (
        <Form layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item label="Режим запуска">
            <Radio.Group value={settings.mode} onChange={(e) => { settings.set({ mode: e.target.value }); setAppMode(e.target.value); }}>
              <Radio value="analysis">Анализ</Radio>
              <Radio value="flight">Полёт</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Язык интерфейса">
            <Select value={settings.language} onChange={(v) => settings.set({ language: v })} style={{ width: 200 }}>
              <Select.Option value="ru">Русский</Select.Option>
              <Select.Option value="en">English</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Автосохранение траекторий">
            <Switch checked={settings.autosave} onChange={(v) => settings.set({ autosave: v })} />
          </Form.Item>
          <Form.Item label="Интервал автосохранения (мин)">
            <InputNumber min={1} max={60} value={settings.autosaveInterval} onChange={(v) => settings.set({ autosaveInterval: v ?? 5 })} />
          </Form.Item>
          <Form.Item label="Количество открытых траекторий в истории">
            <InputNumber min={1} max={50} value={settings.historyLength} onChange={(v) => settings.set({ historyLength: v ?? 10 })} />
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
            <Input value={settings.polletPath} onChange={(e) => settings.set({ polletPath: e.target.value })} addonAfter="..." />
          </Form.Item>
          <Form.Item label="Путь к каталогу объектов">
            <Input value={settings.objectsPath} onChange={(e) => settings.set({ objectsPath: e.target.value })} addonAfter="..." />
          </Form.Item>
          <Form.Item label="Путь к БД СБИ">
            <Input value={settings.dbPath} onChange={(e) => settings.set({ dbPath: e.target.value })} addonAfter="..." />
          </Form.Item>
          <Form.Item label="Путь к файлам траекторий">
            <Input value={settings.trajectoriesPath} onChange={(e) => settings.set({ trajectoriesPath: e.target.value })} addonAfter="..." />
          </Form.Item>
          <Form.Item label="Путь к протоколам">
            <Input value={settings.logsPath} onChange={(e) => settings.set({ logsPath: e.target.value })} addonAfter="..." />
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
            <Select value={settings.colorScheme} onChange={(v) => {
              settings.set({ colorScheme: v, bgColor: v === 'dark' ? '#1a1a2e' : '#ffffff' });
            }} style={{ width: 200 }}>
              <Select.Option value="light">Светлая</Select.Option>
              <Select.Option value="dark">Тёмная</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Шрифт">
            <Select value={settings.font} onChange={(v) => settings.set({ font: v })} style={{ width: 200 }}>
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
                  onClick={() => settings.set({ bgColor: c })}
                  style={{
                    width: 28, height: 28, borderRadius: 4, cursor: 'pointer',
                    background: c, border: settings.bgColor === c ? '2px solid #1677ff' : '1px solid #d9d9d9',
                  }}
                />
              ))}
            </div>
          </Form.Item>
          <Form.Item label="Показывать сетку на графиках">
            <Switch checked={settings.showGrid} onChange={(v) => settings.set({ showGrid: v })} />
          </Form.Item>
          <Form.Item label="Толщина линий графиков">
            <Radio.Group value={settings.lineThickness} onChange={(e) => settings.set({ lineThickness: e.target.value })}>
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
            <Select value={settings.interpolation} onChange={(v) => settings.set({ interpolation: v })} style={{ width: 200 }}>
              <Select.Option value="linear">Линейная</Select.Option>
              <Select.Option value="spline">Сплайн</Select.Option>
              <Select.Option value="nearest">Ближайший сосед</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Порог отбраковки выбросов (σ)">
            <InputNumber min={1} max={10} step={0.5} value={settings.outlierSigma} onChange={(v) => settings.set({ outlierSigma: v ?? 3 })} />
          </Form.Item>
          <Form.Item label="Тип фильтрации по умолчанию">
            <Select value={settings.defaultFilter} onChange={(v) => settings.set({ defaultFilter: v })} style={{ width: 200 }}>
              <Select.Option value="butterworth">Фильтр Баттерворта</Select.Option>
              <Select.Option value="chebyshev">Фильтр Чебышева</Select.Option>
              <Select.Option value="median">Медианный фильтр</Select.Option>
              <Select.Option value="none">Без фильтрации</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Частота дискретизации (Гц) по умолчанию">
            <InputNumber min={1} max={10000} value={settings.sampleRate} onChange={(v) => settings.set({ sampleRate: v ?? 100 })} />
          </Form.Item>
          <Form.Item label="Автоматический расчёт при открытии траектории">
            <Switch checked={settings.autoCalc} onChange={(v) => settings.set({ autoCalc: v })} />
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
