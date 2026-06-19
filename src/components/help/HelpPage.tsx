import { useState, useMemo } from 'react';
import { Row, Col, Input, Typography, Card, Space, Tag, Empty } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

interface HelpSection {
  key: string;
  title: string;
  content: string;
  tags: string[];
}

const sections: HelpSection[] = [
  { key: 'intro', title: 'Введение', tags: ['спмо', 'полёт', 'назначение'],
    content: 'СПМО «Полёт» — система полётной метрологической обработки. Предназначена для сбора, обработки и анализа полётных данных. Прототип UI версии 5 реализует основные сценарии работы оператора.' },
  { key: 'main', title: 'Главное окно', tags: ['интерфейс', 'окно', 'рабочее'],
    content: 'Главное окно состоит из строки меню, панели инструментов, боковой панели (дерево объектов и список траекторий) и рабочей области. В рабочей области отображаются графики, таблицы, экраны.' },
  { key: 'object', title: 'Объект', tags: ['тема', 'объект', 'выбрать', 'создать'],
    content: 'Раздел «Объект» позволяет выбрать тему и объект испытаний, создать новую тему или объект. Выбор объекта определяет, с какими данными работает система.' },
  { key: 'db', title: 'База данных СБИ', tags: ['бд', 'параметры', 'база', 'сби'],
    content: 'БД СБИ содержит параметры, сгруппированные по подразделениям и категориям. Просмотр, редактирование, импорт и экспорт параметров. Текущая БД — активная версия, Расчётная — версия для расчёта траектории.' },
  { key: 'trajectory', title: 'Траектория', tags: ['траектория', 'расчёт', 'маркер', 'сбой'],
    content: 'Раздел «Траектория»: расчёт траектории по данным из БД и файлам, открытие/сохранение, анализ сбоев времени и параметров, установка и удаление маркеров событий, работа с выборками (.smp).' },
  { key: 'screen', title: 'Экран', tags: ['экран', 'окно', 'рабочее'],
    content: 'Раздел «Экран»: создание и управление рабочими окнами (экранами). Добавление графиков и таблиц в окна, разбивка на подобласти, сохранение шаблонов (.wdw).' },
  { key: 'view', title: 'Вид', tags: ['шкалы', 'курсор', 'значения', 'сетка'],
    content: 'Настройки отображения графиков: шкалы параметров (показать/скрыть), текущие значения (список/таблица/скрыты), курсор (перекрестие/стрелка/вертикальная линия), сетка.' },
  { key: 'graph', title: 'График', tags: ['функция', 'пределы', 'авто', 'оси'],
    content: 'Управление графиками: добавление функции (выбор параметра, цвет, толщина, тип линии), настройка пределов, авто-масштаб, настройка осей, сохранение графика (PNG/SVG/PDF).' },
  { key: 'tables', title: 'Таблицы', tags: ['таблица', 'значения', 'статистика', 'экспорт'],
    content: 'Просмотр таблицы значений параметров, настройка колонок, экспорт в CSV/Excel/Word, предпросмотр и печать, расчёт статистики.' },
  { key: 'processing', title: 'Вторичная обработка', tags: ['обработка', 'задача', 'fft', 'фильтр'],
    content: 'Спектральный анализ (FFT), фильтрация сигналов, расчёт тензопараметров, расчётных параметров, графический редактор шаблонов.' },
  { key: 'service', title: 'Сервис', tags: ['настройки', 'экспорт', 'синхронизация'],
    content: 'Настройки программы (общие, каталоги, оформление, расчёт), экспорт данных, синхронизация с БД, импорт файлов.' },
  { key: 'tips', title: 'Быстрые советы', tags: ['совет', 'горячие', 'клавиши'],
    content: 'Ctrl+O — открыть траекторию. Ctrl+S — сохранить. F5 — расчёт. Del — удалить. Esc — отмена режима маркеров. Двойной клик по объекту в дереве — быстрый переход на рабочее место.' },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState<string>('intro');

  const filtered = useMemo(() => {
    if (!search.trim()) return sections;
    const q = search.toLowerCase();
    return sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q) || s.tags.some((t) => t.includes(q))
    );
  }, [search]);

  const active = sections.find((s) => s.key === activeSection);

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space>
            <BookOutlined style={{ fontSize: 20 }} />
            <Title level={4} style={{ margin: 0 }}>Справка СПМО «Полёт» v5</Title>
          </Space>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={6}>
          <Input
            placeholder="Поиск по справке..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ marginBottom: 8 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map((s) => (
              <div
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  background: activeSection === s.key ? '#e6f4ff' : 'transparent',
                  fontWeight: activeSection === s.key ? 600 : 400,
                }}
              >
                {s.title}
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <Empty description="Ничего не найдено" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
        <Col span={18}>
          {active ? (
            <Card>
              <Title level={5}>{active.title}</Title>
              <Paragraph style={{ fontSize: 14, lineHeight: 1.8 }}>{active.content}</Paragraph>
              <Space style={{ marginTop: 12 }}>
                {active.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </Space>
            </Card>
          ) : (
            <Empty description="Выберите раздел слева" />
          )}
        </Col>
      </Row>
    </div>
  );
}
