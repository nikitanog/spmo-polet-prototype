import { useState } from 'react';
import { Modal, Form, Select, Input, InputNumber, Tabs, Button } from 'antd';

const paramTypes = [
  { value: 'calc', label: 'Вычисляемый' },
  { value: 'calibration', label: 'Градуировка' },
  { value: 'mkio', label: 'МКИО (MIL-STD-1553)' },
  { value: 'arinc429', label: 'ARINC-429' },
  { value: 'irig106', label: 'IRIG-106 KAM-500' },
  { value: 'analog', label: 'Аналоговый' },
  { value: 'rs232', label: 'RS-232/422/485' },
  { value: 'sns', label: 'СНС (ГЛОНАСС/GPS)' },
  { value: 'adc', label: 'АЦП' },
  { value: 'kbla', label: 'КБЛА (Корсар/Форпост)' },
  { value: 'gamma', label: 'ГАММА-1101' },
];

function TypeForm({ type }: { type: string }) {
  const fields: Record<string, React.ReactNode> = {
    calc: (
      <>
        <Form.Item label="Формула"><Input placeholder="Напр.: A + B * 2" /></Form.Item>
        <Form.Item label="Входные параметры"><Select mode="multiple" placeholder="Выберите" options={['V_приборная_км_ч', 'V_истинная_км_ч'].map(p => ({ value: p, label: p }))} /></Form.Item>
        <Form.Item label="Единицы измерения"><Input placeholder="м, с, кг..." /></Form.Item>
      </>
    ),
    calibration: (
      <>
        <Form.Item label="Тип градуировки"><Select options={[{ value: 'linear', label: 'Линейная' }, { value: 'poly', label: 'Полиномиальная' }, { value: 'table', label: 'Табличная' }]} /></Form.Item>
        <Form.Item label="Коэффициенты"><Input placeholder="a0, a1, a2..." /></Form.Item>
        <Form.Item label="Таблица X/Y"><Input.TextArea rows={3} placeholder="X1 Y1; X2 Y2; ..." /></Form.Item>
      </>
    ),
    mkio: (
      <>
        <Form.Item label="Адрес RT"><InputNumber min={0} max={31} /></Form.Item>
        <Form.Item label="Subaddress"><InputNumber min={0} max={31} /></Form.Item>
        <Form.Item label="Тип данных"><Select options={[{ value: 'int16', label: 'INT16' }, { value: 'int32', label: 'INT32' }, { value: 'float', label: 'Float32' }]} /></Form.Item>
      </>
    ),
    arinc429: (
      <>
        <Form.Item label="SDI"><InputNumber min={0} max={3} /></Form.Item>
        <Form.Item label="SSM"><Select options={[{ value: 'normal', label: 'Normal' }, { value: 'test', label: 'Test' }, { value: 'failure', label: 'Failure' }]} /></Form.Item>
        <Form.Item label="Битовая маска"><Input placeholder="0x00FFFFFF" /></Form.Item>
      </>
    ),
    irig106: (
      <>
        <Form.Item label="Chapter"><Select options={[{ value: 'ch4', label: 'Chapter 4' }, { value: 'ch7', label: 'Chapter 7' }, { value: 'ch10', label: 'Chapter 10' }]} /></Form.Item>
        <Form.Item label="Тип пакета"><Input placeholder="Тип пакета KAM-500" /></Form.Item>
      </>
    ),
    analog: (
      <>
        <Form.Item label="АЦП"><Select options={[{ value: '16bit', label: '16 бит' }, { value: '12bit', label: '12 бит' }, { value: '24bit', label: '24 бит' }]} /></Form.Item>
        <Form.Item label="Коэффициент усиления"><InputNumber min={0.001} step={0.1} /></Form.Item>
        <Form.Item label="Смещение"><InputNumber /></Form.Item>
      </>
    ),
    rs232: (
      <>
        <Form.Item label="Скорость (бод)"><Select options={[9600, 19200, 38400, 115200, 921600].map(v => ({ value: v, label: `${v}` }))} /></Form.Item>
        <Form.Item label="Биты данных"><Select options={[7, 8].map(v => ({ value: v, label: `${v}` }))} /></Form.Item>
        <Form.Item label="Чётность"><Select options={[{ value: 'none', label: 'Нет' }, { value: 'even', label: 'Чёт' }, { value: 'odd', label: 'Нечёт' }]} /></Form.Item>
      </>
    ),
    sns: (
      <>
        <Form.Item label="Тип СНС"><Select options={[{ value: 'glonass', label: 'ГЛОНАСС' }, { value: 'gps', label: 'GPS' }, { value: 'combined', label: 'Комбинированный' }]} /></Form.Item>
        <Form.Item label="Система координат"><Select options={[{ value: 'wgs84', label: 'WGS-84' }, { value: 'pz90', label: 'ПЗ-90' }, { value: 'sk42', label: 'СК-42' }]} /></Form.Item>
      </>
    ),
    adc: (
      <>
        <Form.Item label="Тип АЦП"><Select options={[{ value: 'vibration', label: 'Вибрация' }, { value: 'tenso', label: 'Тензо' }, { value: 'thermo', label: 'Термо' }]} /></Form.Item>
        <Form.Item label="Частота (Гц)"><InputNumber min={1} max={100000} /></Form.Item>
        <Form.Item label="Каналы"><InputNumber min={1} max={64} /></Form.Item>
      </>
    ),
    kbla: (
      <>
        <Form.Item label="Тип БЛА"><Select options={[{ value: 'korsar', label: 'Корсар' }, { value: 'forpost', label: 'Форпост' }]} /></Form.Item>
        <Form.Item label="Протокол"><Select options={[{ value: 'v1', label: 'Протокол v1' }, { value: 'v2', label: 'Протокол v2' }]} /></Form.Item>
      </>
    ),
    gamma: (
      <>
        <Form.Item label="10-бит параллельный код"><Input placeholder="0x000..0x3FF" /></Form.Item>
        <Form.Item label="Формат данных"><Select options={[{ value: 'bcd', label: 'BCD' }, { value: 'binary', label: 'Binary' }]} /></Form.Item>
      </>
    ),
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Имя параметра"><Input placeholder="Введите имя параметра" /></Form.Item>
      <Form.Item label="Тип сигнала"><Input value={paramTypes.find(t => t.value === type)?.label || type} disabled /></Form.Item>
      <Form.Item label="Описание"><Input.TextArea rows={2} placeholder="Описание параметра" /></Form.Item>
      {fields[type]}
    </Form>
  );
}

interface ParameterTypeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ParameterTypeModal({ open, onClose }: ParameterTypeModalProps) {
  const [type, setType] = useState('calc');

  return (
    <Modal
      title="Настройка типа параметра"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Закрыть</Button>}
      width={560}
    >
      <Form layout="vertical">
        <Form.Item label="Тип параметра">
          <Select value={type} onChange={setType} options={paramTypes} />
        </Form.Item>
      </Form>
      <Tabs
        activeKey={type}
        onChange={setType}
        items={paramTypes.map(pt => ({ key: pt.value, label: pt.label, children: <TypeForm type={pt.value} /> }))}
        tabPosition="left"
        style={{ minHeight: 320 }}
      />
    </Modal>
  );
}
