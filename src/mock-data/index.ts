import type { Alarm, TelemetryValue, Screen } from './types';

export const mockTopics = [
  { id: '1', name: 'ЛИ-2024', objects: [
    { id: '1-1', name: 'Борт 001' },
    { id: '1-2', name: 'Борт 002' },
    { id: '1-3', name: 'Борт 003' },
  ]},
  { id: '2', name: 'ЛИ-2025', objects: [
    { id: '2-1', name: 'Борт 004' },
    { id: '2-2', name: 'Борт 005' },
    { id: '2-3', name: 'Борт 006' },
  ]},
  { id: '3', name: 'ЛИ-2026', objects: [
    { id: '3-1', name: 'Борт 007' },
    { id: '3-2', name: 'Борт 008' },
  ]},
  { id: '4', name: 'Архив 2023', objects: [
    { id: '4-1', name: 'Борт 010' },
    { id: '4-2', name: 'Борт 011' },
  ]},
];

const aviationParams = [
  // Аэродинамика
  { id: 'p1',  name: 'V_приборная_км_ч',   type: 'Analog',   unit: 'км/ч',   min: 0,    max: 1200,  subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p2',  name: 'V_истинная_км_ч',     type: 'Analog',   unit: 'км/ч',   min: 0,    max: 1400,  subdivision: 'Аэродинамика',       category: 'Расчётные значения' },
  { id: 'p3',  name: 'V_вертикальная_м_с',  type: 'Analog',   unit: 'м/с',    min: -50,  max: 50,    subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p4',  name: 'Число_М',             type: 'Analog',   unit: '',       min: 0,    max: 2.5,   subdivision: 'Аэродинамика',       category: 'Расчётные значения' },
  { id: 'p5',  name: 'H_барометрическая_м', type: 'Analog',   unit: 'м',      min: 0,    max: 20000, subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p6',  name: 'H_относительная_м',   type: 'Analog',   unit: 'м',      min: 0,    max: 15000, subdivision: 'Аэродинамика',       category: 'Расчётные значения' },
  { id: 'p7',  name: 'H_радиометрическая_м',type: 'Analog',   unit: 'м',      min: 0,    max: 3000,  subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p8',  name: 'Крен_град',           type: 'Analog',   unit: 'град',   min: -180, max: 180,   subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p9',  name: 'Тангаж_град',         type: 'Analog',   unit: 'град',   min: -90,  max: 90,    subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p10', name: 'Курс_град',           type: 'Analog',   unit: 'град',   min: 0,    max: 360,   subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p11', name: 'Угол_атаки_град',     type: 'Analog',   unit: 'град',   min: -10,  max: 30,    subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p12', name: 'Угол_скольжения_град',type: 'Analog',   unit: 'град',   min: -20,  max: 20,    subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p13', name: 'n_x_g',               type: 'Analog',   unit: 'g',      min: -5,   max: 8,     subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p14', name: 'n_y_g',               type: 'Analog',   unit: 'g',      min: -5,   max: 8,     subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p15', name: 'n_z_g',               type: 'Analog',   unit: 'g',      min: -2,   max: 5,     subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p16', name: 'ω_x_град_с',          type: 'Analog',   unit: 'град/с', min: -50,  max: 50,    subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p17', name: 'ω_y_град_с',          type: 'Analog',   unit: 'град/с', min: -50,  max: 50,    subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  { id: 'p18', name: 'ω_z_град_с',          type: 'Analog',   unit: 'град/с', min: -50,  max: 50,    subdivision: 'Аэродинамика',       category: 'Истинные значения' },
  // Силовая установка
  { id: 'p20', name: 'Обороты_1_двиг_об_мин', type: 'Analog', unit: 'об/мин', min: 0,   max: 30000,  subdivision: 'Силовая установка',  category: 'Истинные значения' },
  { id: 'p21', name: 'Обороты_2_двиг_об_мин', type: 'Analog', unit: 'об/мин', min: 0,   max: 30000,  subdivision: 'Силовая установка',  category: 'Истинные значения' },
  { id: 'p22', name: 'Темп_1_двиг_C',         type: 'Analog', unit: '°C',      min: -50, max: 1200,  subdivision: 'Силовая установка',  category: 'Истинные значения' },
  { id: 'p23', name: 'Темп_2_двиг_C',         type: 'Analog', unit: '°C',     min: -50,  max: 1200,  subdivision: 'Силовая установка',  category: 'Истинные значения' },
  { id: 'p24', name: 'Расход_топлива_кг_ч',   type: 'Analog', unit: 'кг/ч',   min: 0,    max: 5000,  subdivision: 'Силовая установка',  category: 'Истинные значения' },
  { id: 'p25', name: 'Давление_масла_1_кгс_см2', type: 'Analog', unit: 'кгс/см²', min: 0, max: 20, subdivision: 'Силовая установка', category: 'Истинные значения' },
  { id: 'p26', name: 'Вибрация_1_двиг_мм_с', type: 'Analog',   unit: 'мм/с',  min: 0,    max: 100,   subdivision: 'Силовая установка',  category: 'Истинные значения' },
  { id: 'p27', name: 'Вибрация_2_двиг_мм_с', type: 'Analog',   unit: 'мм/с',  min: 0,    max: 100,   subdivision: 'Силовая установка',  category: 'Истинные значения' },
  { id: 'p28', name: 'Режим_двиг_1',          type: 'Discrete', unit: '',       min: 0,    max: 7,     subdivision: 'Силовая установка',  category: 'Дискретные сигналы' },
  { id: 'p29', name: 'Режим_двиг_2',          type: 'Discrete', unit: '',       min: 0,    max: 7,     subdivision: 'Силовая установка',  category: 'Дискретные сигналы' },
  // Системы управления
  { id: 'p30', name: 'Отклонение_РВ_град',    type: 'Analog',   unit: 'град',  min: -30,  max: 30,    subdivision: 'Системы управления', category: 'Истинные значения' },
  { id: 'p31', name: 'Отклонение_ЭМ_град',    type: 'Analog',   unit: 'град',  min: -25,  max: 25,    subdivision: 'Системы управления', category: 'Истинные значения' },
  { id: 'p32', name: 'Отклонение_РН_град',    type: 'Analog',   unit: 'град',  min: -25,  max: 25,    subdivision: 'Системы управления', category: 'Истинные значения' },
  { id: 'p33', name: 'Положение_РУД_град',    type: 'Analog',   unit: 'град',  min: 0,    max: 130,   subdivision: 'Системы управления', category: 'Истинные значения' },
  { id: 'p34', name: 'Шаг_винта_град',        type: 'Analog',   unit: 'град',  min: 0,    max: 90,    subdivision: 'Системы управления', category: 'Истинные значения' },
  { id: 'p35', name: 'Статус_САУ',            type: 'Discrete', unit: '',       min: 0,    max: 15,    subdivision: 'Системы управления', category: 'Дискретные сигналы' },
  { id: 'p36', name: 'Режим_автопилота',      type: 'Discrete', unit: '',       min: 0,    max: 7,     subdivision: 'Системы управления', category: 'Дискретные сигналы' },
  { id: 'p37', name: 'Сигнал_Тренога',         type: 'Discrete', unit: '',       min: 0,    max: 1,     subdivision: 'Системы управления', category: 'Дискретные сигналы' },
  // Навигация
  { id: 'p40', name: 'Широта_град',           type: 'SNS',      unit: 'град',  min: -90,  max: 90,    subdivision: 'Навигация',          category: 'Истинные значения' },
  { id: 'p41', name: 'Долгота_град',          type: 'SNS',      unit: 'град',  min: -180, max: 180,   subdivision: 'Навигация',          category: 'Истинные значения' },
  { id: 'p42', name: 'Высота_ГЛОНАСС_м',      type: 'SNS',      unit: 'м',     min: 0,    max: 25000, subdivision: 'Навигация',          category: 'Истинные значения' },
  { id: 'p43', name: 'Путевая_скорость_км_ч', type: 'SNS',      unit: 'км/ч',  min: 0,    max: 1500,  subdivision: 'Навигация',          category: 'Расчётные значения' },
  { id: 'p44', name: 'Ветер_скорость_м_с',    type: 'Analog',  unit: 'м/с',    min: 0,    max: 50,    subdivision: 'Навигация',          category: 'Расчётные значения' },
  { id: 'p45', name: 'Ветер_направление_град',type: 'Analog',  unit: 'град',   min: 0,    max: 360,   subdivision: 'Навигация',          category: 'Расчётные значения' },
  { id: 'p46', name: 'Система_СНС_статус',    type: 'SNS',      unit: '',       min: 0,    max: 3,     subdivision: 'Навигация',          category: 'Служебные' },
  // Шасси
  { id: 'p50', name: 'Положение_шасси',       type: 'Discrete', unit: '',       min: 0,    max: 3,     subdivision: 'Шасси',              category: 'Дискретные сигналы' },
  { id: 'p51', name: 'Давление_пневматиков_кгс_см2', type: 'Analog', unit: 'кгс/см²', min: 0, max: 20, subdivision: 'Шасси', category: 'Истинные значения' },
  { id: 'p52', name: 'Тормозное_давление_кгс_см2', type: 'Analog',  unit: 'кгс/см²', min: 0, max: 150, subdivision: 'Шасси', category: 'Истинные значения' },
  { id: 'p53', name: 'Скорость_колеса_1_об_мин', type: 'Analog',  unit: 'об/мин', min: 0, max: 3000,  subdivision: 'Шасси',  category: 'Истинные значения' },
  { id: 'p54', name: 'Сигнал_обжатия_стоек',  type: 'Discrete', unit: '',       min: 0,    max: 1,     subdivision: 'Шасси',              category: 'Дискретные сигналы' },
  // БРЭО
  { id: 'p60', name: 'Напряжение_БС_В',        type: 'Analog',  unit: 'В',      min: 18,   max: 32,    subdivision: 'БРЭО',               category: 'Истинные значения' },
  { id: 'p61', name: 'Ток_БС_А',              type: 'Analog',   unit: 'А',      min: 0,    max: 200,   subdivision: 'БРЭО',               category: 'Истинные значения' },
  { id: 'p62', name: 'Напряжение_АКБ_В',      type: 'Analog',   unit: 'В',      min: 18,   max: 30,    subdivision: 'БРЭО',               category: 'Истинные значения' },
  { id: 'p63', name: 'Температура_БРЭО_C',    type: 'Analog',   unit: '°C',     min: -40,  max: 85,    subdivision: 'БРЭО',               category: 'Истинные значения' },
  { id: 'p64', name: 'Сбой_ПН1',              type: 'Discrete', unit: '',       min: 0,    max: 1,     subdivision: 'БРЭО',               category: 'Дискретные сигналы' },
  { id: 'p65', name: 'Сбой_ПН2',              type: 'Discrete', unit: '',       min: 0,    max: 1,     subdivision: 'БРЭО',               category: 'Дискретные сигналы' },
  { id: 'p66', name: 'Статус_БРЭО',           type: 'Discrete', unit: '',       min: 0,    max: 255,   subdivision: 'БРЭО',               category: 'Служебные' },
  { id: 'p67', name: 'ARINC_429_слово_1',     type: 'ARINC-429', unit: '',      min: 0,    max: 0xFFFFFFFF, subdivision: 'БРЭО',           category: 'Служебные' },
  { id: 'p68', name: 'ARINC_429_слово_2',     type: 'ARINC-429', unit: '',      min: 0,    max: 0xFFFFFFFF, subdivision: 'БРЭО',           category: 'Служебные' },
  { id: 'p69', name: 'МКИО_адрес_1',          type: 'MKIO',     unit: '',       min: 0,    max: 0xFFFF, subdivision: 'БРЭО',               category: 'Служебные' },
  { id: 'p70', name: 'МКИО_адрес_2',          type: 'MKIO',     unit: '',       min: 0,    max: 0xFFFF, subdivision: 'БРЭО',               category: 'Служебные' },
  // Телеметрия
  { id: 'p80', name: 'Уровень_сигнала_ТМ_дБ', type: 'Analog',   unit: 'дБ',    min: -120, max: 0,     subdivision: 'Телеметрия',         category: 'Истинные значения' },
  { id: 'p81', name: 'Частота_ТМ_МГц',        type: 'Analog',   unit: 'МГц',   min: 1400, max: 1600,  subdivision: 'Телеметрия',         category: 'Истинные значения' },
  { id: 'p82', name: 'Поток_ТМ_кбит_с',       type: 'Analog',   unit: 'кбит/с', min: 0,   max: 20000, subdivision: 'Телеметрия',         category: 'Истинные значения' },
  { id: 'p83', name: 'Статус_ТМ',             type: 'Discrete', unit: '',       min: 0,    max: 3,     subdivision: 'Телеметрия',         category: 'Дискретные сигналы' },
  { id: 'p84', name: 'RS485_канал_1',         type: 'RS-485',   unit: '',       min: 0,    max: 65535, subdivision: 'Телеметрия',         category: 'Служебные' },
  { id: 'p85', name: 'RS485_канал_2',         type: 'RS-485',   unit: '',       min: 0,    max: 65535, subdivision: 'Телеметрия',         category: 'Служебные' },
];

export const mockParams = aviationParams.map(p => ({
  ...p,
  description: `${p.name} — ${p.subdivision}, категория ${p.category.toLowerCase()}`,
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

const flight1Params = ['V_приборная_км_ч','V_истинная_км_ч','Число_М','Крен_град','Тангаж_град','Курс_град','H_барометрическая_м','n_z_g','Расход_топлива_кг_ч','Обороты_1_двиг_об_мин','Отклонение_РВ_град','Положение_РУД_град','Напряжение_БС_В'];
const flight2Params = ['V_приборная_км_ч','H_относительная_м','Курс_град','Угол_атаки_град','n_x_g','n_z_g','Темп_1_двиг_C','Обороты_1_двиг_об_мин','Отклонение_ЭМ_град','Положение_шасси','Расход_топлива_кг_ч','Статус_САУ'];
const flight3Params = ['V_приборная_км_ч','V_вертикальная_м_с','H_барометрическая_м','Крен_град','Тангаж_град','Число_М','n_y_g','ω_z_град_с','Темп_2_двиг_C','Вибрация_1_двиг_мм_с','Шаг_винта_град','Статус_БРЭО'];
const flight4Params = ['H_барометрическая_м','V_истинная_км_ч','Курс_град','Крен_град','Тангаж_град','n_z_g','Давление_масла_1_кгс_см2','Отклонение_РН_град','Напряжение_АКБ_В','Уровень_сигнала_ТМ_дБ','Давление_пневматиков_кгс_см2'];

const genAll = (names: string[]) => {
  const result: Record<string, number[]> = {};
  names.forEach((name, i) => { result[name] = generateTimeSeries(3000, (i + 1) * 30); });
  return result;
};

export const mockTrajectories: {
  id: string; name: string; topicId: string; objectId: string; params: string[]; data: Record<string, number[]>;
}[] = [
  { id: 'trj-1', name: 'flight_001', topicId: '1', objectId: '1-1', params: flight1Params, data: genAll(flight1Params) },
  { id: 'trj-2', name: 'flight_002', topicId: '1', objectId: '1-2', params: flight2Params, data: genAll(flight2Params) },
  { id: 'trj-3', name: 'flight_003', topicId: '2', objectId: '2-1', params: flight3Params, data: genAll(flight3Params) },
  { id: 'trj-4', name: 'flight_004', topicId: '2', objectId: '2-2', params: flight4Params, data: genAll(flight4Params) },
];

export const mockMarkers = [
  { id: 'm1', time: 500,  comment: 'Взлёт' },
  { id: 'm2', time: 1200, comment: 'Набор высоты 5000 м' },
  { id: 'm3', time: 2000, comment: 'Крейсерский режим М=0.78' },
  { id: 'm4', time: 2500, comment: 'Начало снижения' },
  { id: 'm5', time: 2900, comment: 'Посадка' },
  { id: 'm6', time: 800,  comment: 'Уборка шасси' },
  { id: 'm7', time: 1800, comment: 'Дозаправка в воздухе' },
  { id: 'm8', time: 2700, comment: 'Выпуск шасси' },
];

export const mockFaults = [
  { id: 'f1', start: 502, end: 508,   type: 'Выброс',   param: 'Крен_град' },
  { id: 'f2', start: 1503, end: 1518, type: 'Пропуск',  param: 'V_приборная_км_ч' },
  { id: 'f3', start: 2010, end: 2015, type: 'Шум',      param: 'Темп_1_двиг_C' },
  { id: 'f4', start: 700, end: 705,   type: 'Выброс',   param: 'Расход_топлива_кг_ч' },
  { id: 'f5', start: 2300, end: 2310, type: 'Пропуск',  param: 'Отклонение_РВ_град' },
];

export const mockTimeFaults = [
  { id: 'tf1', start: 100, end: 105,  duration: 5,  type: 'Сбой метки времени' },
  { id: 'tf2', start: 800, end: 802,  duration: 2,  type: 'Сбой метки времени' },
  { id: 'tf3', start: 2200, end: 2210, duration: 10, type: 'Пропуск данных' },
  { id: 'tf4', start: 1400, end: 1401, duration: 1,  type: 'Двойная метка' },
];

export const mockScreens: Screen[] = [
  { id: 's1', name: 'Основной полётный экран', created: '2026-01-15', windows: [
    { id: 'w1', type: 'graph', params: ['V_приборная_км_ч', 'V_истинная_км_ч', 'Число_М'] },
    { id: 'w2', type: 'graph', params: ['H_барометрическая_м', 'Крен_град', 'Тангаж_град'] },
    { id: 'w3', type: 'table', params: ['n_z_g', 'Курс_град', 'Расход_топлива_кг_ч'] },
  ]},
  { id: 's2', name: 'Детальный анализ', created: '2026-02-20', windows: [
    { id: 'w4', type: 'graph', params: ['Обороты_1_двиг_об_мин', 'Темп_1_двиг_C', 'Вибрация_1_двиг_мм_с'] },
    { id: 'w5', type: 'graph', params: ['Угол_атаки_град', 'Угол_скольжения_град', 'ω_z_град_с'] },
  ]},
  { id: 's3', name: 'Сравнение траекторий', created: '2026-03-10', windows: [
    { id: 'w6', type: 'graph', params: ['V_приборная_км_ч', 'H_барометрическая_м', 'n_z_g'] },
    { id: 'w7', type: 'graph', params: ['Курс_град', 'Крен_град', 'Тангаж_град'] },
    { id: 'w8', type: 'table', params: ['Число_М', 'Путевая_скорость_км_ч', 'Расход_топлива_кг_ч'] },
  ]},
  { id: 's4', name: 'Мониторинг БРЭО', created: '2026-04-05', windows: [
    { id: 'w9',  type: 'graph', params: ['Напряжение_БС_В', 'Ток_БС_А', 'Напряжение_АКБ_В'] },
    { id: 'w10', type: 'graph', params: ['Температура_БРЭО_C', 'Уровень_сигнала_ТМ_дБ', 'Поток_ТМ_кбит_с'] },
    { id: 'w11', type: 'table', params: ['Статус_БРЭО', 'Сбой_ПН1', 'Сбой_ПН2', 'Статус_ТМ'] },
  ]},
  { id: 's5', name: 'Спектральный анализ', created: '2026-05-01', windows: [
    { id: 'w12', type: 'graph', params: ['n_x_g', 'n_y_g', 'n_z_g'] },
    { id: 'w13', type: 'graph', params: ['ω_x_град_с', 'ω_y_град_с', 'ω_z_град_с'] },
  ]},
];

export const mockTasks = [
  { id: 't1', name: 'Фильтрация шумов V_приборная', algorithm: 'Butterworth LPF', status: 'ready' },
  { id: 't2', name: 'Расчёт статистики полёта', algorithm: 'Statistics', status: 'running' },
  { id: 't3', name: 'Спектральный анализ вибрации', algorithm: 'FFT', status: 'done' },
  { id: 't4', name: 'Расчёт тензопараметров крыла', algorithm: 'Tenso v2.1', status: 'ready' },
  { id: 't5', name: 'Корреляция параметров двигателя', algorithm: 'Correlation', status: 'queued' },
  { id: 't6', name: 'Интегрирование перегрузки', algorithm: 'Integration', status: 'ready' },
];

export const mockLibrary = [
  { id: 'lib1', name: 'Стандартные фильтры', version: '1.0' },
  { id: 'lib2', name: 'Тензо-расчёты', version: '2.1' },
  { id: 'lib3', name: 'Спектральный анализ', version: '1.3' },
  { id: 'lib4', name: 'Статистические методы', version: '2.0' },
];

export const mockUsers = [
  { id: 'u1', name: 'Иванов И.И.', role: 'Оператор' },
  { id: 'u2', name: 'Петров П.П.', role: 'Аналитик' },
  { id: 'u3', name: 'Сидоров С.С.', role: 'Администратор БДП' },
];

export const mockAlarms: Alarm[] = [
  { id: 'a1', param: 'Темп_1_двиг_C', value: 1150, threshold: 1100, status: 'critical', time: 1450, message: 'Превышение температуры двигателя 1' },
  { id: 'a2', param: 'Вибрация_1_двиг_мм_с', value: 82, threshold: 70, status: 'warning', time: 1620, message: 'Вибрация двигателя выше нормы' },
  { id: 'a3', param: 'Напряжение_БС_В', value: 19.2, threshold: 20, status: 'critical', time: 1780, message: 'Падение напряжения бортсети' },
  { id: 'a4', param: 'Давление_масла_1_кгс_см2', value: 1.2, threshold: 1.5, status: 'warning', time: 1900, message: 'Давление масла близко к минимуму' },
  { id: 'a5', param: 'H_радиометрическая_м', value: 50, threshold: 100, status: 'critical', time: 300, message: 'Опасная высота по радиовысотомеру' },
];

export const mockTelemetryValues: TelemetryValue[] = [
  { id: 'tv1', name: 'Высота барометрическая', value: 10500, unit: 'м', status: 'ok' },
  { id: 'tv2', name: 'Скорость приборная', value: 780, unit: 'км/ч', status: 'ok' },
  { id: 'tv3', name: 'Температура двигателя 1', value: 845, unit: '°C', status: 'warning' },
  { id: 'tv4', name: 'Число М', value: 0.78, unit: '', status: 'ok' },
  { id: 'tv5', name: 'Напряжение БС', value: 27.4, unit: 'В', status: 'ok' },
  { id: 'tv6', name: 'Расход топлива', value: 2450, unit: 'кг/ч', status: 'ok' },
  { id: 'tv7', name: 'Вибрация двигателя 1', value: 45.2, unit: 'мм/с', status: 'ok' },
  { id: 'tv8', name: 'Обороты двигателя 1', value: 28500, unit: 'об/мин', status: 'ok' },
  { id: 'tv9', name: 'Перегрузка n_z', value: 1.2, unit: 'g', status: 'ok' },
  { id: 'tv10', name: 'СПМО статус', value: 1, unit: '', status: 'ok' },
];
