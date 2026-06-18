export const mockTopics = [
  { id: '1', name: 'ЛИ-2024', objects: [{ id: '1-1', name: 'Борт 001' }, { id: '1-2', name: 'Борт 002' }] },
  { id: '2', name: 'ЛИ-2025', objects: [{ id: '2-1', name: 'Борт 003' }, { id: '2-2', name: 'Борт 004' }] },
];

export const mockParams = Array.from({ length: 120 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `Параметр_${String(i + 1).padStart(3, '0')}`,
  type: ['Analog', 'Discrete', 'ARINC-429', 'MKIO', 'SNS'][i % 5],
  unit: ['м', 'с', 'кг', '°C', 'Па', '%', 'А', 'В'][i % 8],
  min: -100 + i * 10,
  max: 100 + i * 10,
  description: `Описание параметра ${i + 1}`,
  subdivision: `Подразделение ${Math.floor(i / 20) + 1}`,
  category: `Категория ${Math.floor(i / 30) + 1}`,
}));

export const generateTimeSeries = (points = 3000, seed = 1) => {
  const data: number[] = [];
  let v = seed;
  for (let i = 0; i < points; i++) {
    v += (Math.random() - 0.5) * 10;
    v = Math.max(-200, Math.min(200, v));
    if (i > 500 && i < 510) v = -999;
    if (i > 1500 && i < 1520) v = 999;
    data.push(Math.round(v * 100) / 100);
  }
  return data;
};

const genAll = () => ({
  'Параметр_001': generateTimeSeries(3000, 50),
  'Параметр_002': generateTimeSeries(3000, 100),
  'Параметр_010': generateTimeSeries(3000, 200),
  'Параметр_020': generateTimeSeries(3000, -50),
  'Параметр_030': generateTimeSeries(3000, 90),
  'Параметр_050': generateTimeSeries(3000, 150),
});

export const mockTrajectories: {
  id: string; name: string; params: string[]; data: Record<string, number[]>;
}[] = [
  {
    id: 'trj-1',
    name: 'flight_001',
    params: ['Параметр_001', 'Параметр_002', 'Параметр_010', 'Параметр_020', 'Параметр_050'],
    data: genAll(),
  },
  {
    id: 'trj-2',
    name: 'flight_002',
    params: ['Параметр_001', 'Параметр_002', 'Параметр_030'],
    data: genAll(),
  },
];

export const mockMarkers = [
  { id: 'm1', time: 500, comment: 'Взлёт' },
  { id: 'm2', time: 1200, comment: 'Набор высоты' },
  { id: 'm3', time: 2000, comment: 'Крейсерский режим' },
  { id: 'm4', time: 2500, comment: 'Снижение' },
  { id: 'm5', time: 2900, comment: 'Посадка' },
];

export const mockFaults = [
  { id: 'f1', start: 502, end: 508, type: 'Выброс', param: 'Параметр_001' },
  { id: 'f2', start: 1503, end: 1518, type: 'Пропуск', param: 'Параметр_002' },
  { id: 'f3', start: 2010, end: 2015, type: 'Шум', param: 'Параметр_010' },
];

export const mockTimeFaults = [
  { id: 'tf1', start: 100, end: 105, duration: 5, type: 'Сбой метки времени' },
  { id: 'tf2', start: 800, end: 802, duration: 2, type: 'Сбой метки времени' },
  { id: 'tf3', start: 2200, end: 2210, duration: 10, type: 'Пропуск данных' },
];

export const mockScreens = [
  { id: 's1', name: 'Основной экран', windows: [{ type: 'graph', params: ['Параметр_001', 'Параметр_002'] }, { type: 'table', params: ['Параметр_001'] }] },
  { id: 's2', name: 'Детальный анализ', windows: [{ type: 'graph', params: ['Параметр_010', 'Параметр_020', 'Параметр_050'] }] },
];

export const mockTasks = [
  { id: 't1', name: 'Фильтрация шумов', algorithm: 'Butterworth LPF', status: 'ready' },
  { id: 't2', name: 'Расчёт статистики', algorithm: 'Statistics', status: 'running' },
  { id: 't3', name: 'Спектральный анализ', algorithm: 'FFT', status: 'done' },
];

export const mockLibrary = [
  { id: 'lib1', name: 'Стандартные фильтры', version: '1.0' },
  { id: 'lib2', name: 'Тензо-расчёты', version: '2.1' },
];

export const mockUsers = [
  { id: 'u1', name: 'Иванов И.И.', role: 'Оператор' },
  { id: 'u2', name: 'Петров П.П.', role: 'Аналитик' },
  { id: 'u3', name: 'Сидоров С.С.', role: 'Администратор БДП' },
];
