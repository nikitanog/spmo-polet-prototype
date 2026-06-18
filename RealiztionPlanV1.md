# RealizationPlanV1.md — План реализации прототипа СПМО «Полёт» v5

## Цель
Сделать **каждый пункт главного меню** полностью кликабельным, с мок-данными и связями между разделами, чтобы прототип демонстрировал **сквозной рабочий процесс**.

## Структура
План разбит по 10 разделам главного меню. Каждый раздел содержит:
- **Сценарии (US)** из каталога
- **Текущий статус** (✅ готово / ⚠️ частично / ❌ не сделано)
- **Что сделать** — конкретные файлы и компоненты

---

## 1. Объект (US-001..013)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| US-001 — Выбор объекта при старте | ✅ | SelectObjectModal открывается через useEffect |
| US-003 — Выбрать объект из меню | ✅ | Меню → Объект → Выбрать |
| US-004 — Создать тему | ⚠️ | Modal.info. Нужна модалка CreateTopicModal + addTopic в store |
| US-004 — Создать объект | ⚠️ | Modal.info. Нужна модалка CreateObjectModal + addObject в store |
| US-013 — Выход | ✅ | Modal.confirm |
| Дерево тем/объектов | ✅ | ObjectTree отображает темы и объекты из store |
| Обновление дерева после создания | ❌ | Доработать ObjectTree — перерендер при добавлении |

**Файлы:** `modals/CreateTopicModal.tsx`, `modals/CreateObjectModal.tsx`, `stores/useAppStore.ts` (addTopic, addObject), `MainLayout.tsx`

---

## 2. БД СБИ (US-020..050, US-200..210)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| US-020 — Просмотр БД | ✅ | DatabasePage: дерево + таблица + поиск/фильтр |
| US-021 — Открыть БД | ⚠️ | Modal.info. Нужна модалка OpenDbModal с файловым браузером |
| US-022..035 — Редактор БД | ❌ | Страница `/db-editor` с таблицей, меню, диалогами |
| US-036 — Свойства параметра | ✅ | ParamPropertiesModal |
| US-039 — Поиск/фильтр | ✅ | Встроен в DatabasePage |
| US-041 — Импорт Excel | ✅ | ImportDbModal |
| US-042 — Импорт КАМ-500 | ✅ | ImportDbModal |
| US-043 — Экспорт БД | ❌ | Модалка: .txt / .csv |
| US-044 — Сравнение БД | ❌ | DbCompareModal: side-by-side |
| US-045 — Обновление БД | ❌ | DbUpdateModal |
| US-046 — Проверка БД | ❌ | Alert/отчёт |
| US-200..210 — Типы параметров | ✅ | ParameterTypeModal (11 типов) |

**Файлы:** `components/database/DbEditorPage.tsx`, `components/database/DbCompareModal.tsx`, `components/database/DbUpdateModal.tsx`, `modals/OpenDbModal.tsx`, `stores/useDatabaseStore.ts`

---

## 3. Траектория (US-060..073)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| US-060 — Рассчитать траекторию | ✅ | TrajCalcModal (выбор БД + файл, прогресс) |
| US-061 — График траектории | ✅ | TrajectoryChart (ECharts, зум, легенда, тултип) |
| US-062 — Сохранить часть | ❌ | TrajSavePartModal: выбор интервала, имя файла |
| US-063 — Удалить часть | ❌ | TrajDelPartModal: выбор интервала, подтверждение |
| US-064 — Открыть траекторию | ❌ | TrajOpenModal: файловый браузер .trj |
| US-067 — Маркеры | ⚠️ | MarkersPanel ✅, но клик на графике для добавления ❌ |
| US-070 — Выборки | ✅ | SampleModal (сохранение/добавление маркеров) |
| US-071 — Сбои времени ТН | ✅ | FaultsModal (вкладка Time) |
| US-072, 073 — Сбои параметров | ✅ | FaultsModal (вкладка Param + Исправить) |
| US-064 — Список траекторий в боковой панели | ⚠️ | Select в ObjectTree есть, но список открытых траекторий не обновляется динамически |

**Файлы:** `modals/TrajOpenModal.tsx`, `modals/TrajSavePartModal.tsx`, `modals/TrajDelPartModal.tsx`, доработка `TrajectoryChart.tsx` (клик → маркер), доработка `ObjectTree.tsx` (список траекторий)

---

## 4. Экран (US-080..092)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| US-080 — Создать экран | ❌ | ScreenCreateModal: имя + шаблон |
| US-080 — Открыть экран | ❌ | Файловый браузер .scr/.wdw |
| US-080 — Сохранить / Сохранить как | ⚠️ | Toast. Нужна модалка ScreenSaveModal |
| US-082 — Рабочее окно → Добавить | ⚠️ | Modal.info. Нужна модалка выбора типа |
| US-083 — Удалить рабочее окно | ⚠️ | Modal.confirm |
| US-084 — Очистить | ⚠️ | Modal.confirm |
| US-085 — Переименовать | ⚠️ | Modal.info |
| US-086 — Переместить/Копировать | ⚠️ | Modal.info |
| US-092 — Разделить экран | ❌ | Разделение рабочей области на 2 (SplitScreen) |
| ScreenPage | ✅ | Telemetry, alarms, video/map |

**Файлы:** `components/screens/ScreenManagerPage.tsx`, `modals/ScreenCreateModal.tsx`, `modals/ScreenSaveModal.tsx`, `modals/ScreenSplitModal.tsx`, `MainLayout.tsx`

---

## 5. Вид (US-174)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| Шкалы параметров | ❌ | Toast. Нужен Zustand viewStore.scalesVisible |
| Текущие значения → Список | ❌ | Toast. viewStore.valuesMode = 'list' |
| Текущие значения → Таблица | ❌ | Toast. viewStore.valuesMode = 'table' |
| Текущие значения → Не отображать | ❌ | Toast. viewStore.valuesMode = 'hidden' |
| Курсор → Перекрестье | ❌ | Toast. viewStore.cursorMode = 'cross' |
| Курсор → Перекрестье со значениями | ❌ | Toast. viewStore.cursorMode = 'crossVal' |
| Курсор → Стрелка | ❌ | Toast. viewStore.cursorMode = 'arrow' |
| Курсор → Вертикальная линия | ❌ | Toast. viewStore.cursorMode = 'vline' |
| Применить настройки к графику | ❌ | TrajectoryChart читает viewStore |

**Файлы:** `stores/useViewStore.ts`, доработка `TrajectoryChart.tsx`, `MainLayout.tsx`

---

## 6. График (US-100..108)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| US-105 — Добавить функцию | ❌ | Toast. Нужна AddFuncModal: дерево параметров, настройки |
| US-106 — Добавить значение | ❌ | Toast. AddValueModal |
| US-100 — Пределы функции | ❌ | Toast. GraphLimitsModal |
| US-101 — Автопостроение | ❌ | Toast. GraphAutoModal |
| US-102 — Свойства шкалы оси X | ❌ | Toast. GraphAxisModal |
| US-103 — Сетка | ❌ | Toast → viewStore.grid |
| US-108 — Сохранить в файл | ❌ | Toast. GraphSaveModal |

**Файлы:** `modals/AddFuncModal.tsx`, `modals/GraphLimitsModal.tsx`, `modals/GraphAutoModal.tsx`, `modals/GraphAxisModal.tsx`, `modals/GraphSaveModal.tsx`, `stores/useGraphStore.ts`

---

## 7. Таблицы (US-110..115)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| US-110 — Таблица значений | ✅ | ParamsTable (на workspace) |
| US-111 — Настройка таблицы | ❌ | TableSettingsModal: колонки, шаг, формат |
| US-112 — Сохранить таблицу | ❌ | TableExportModal: .csv/.xlsx/.docx |
| US-113 — Предпросмотр печати | ❌ | PrintPreviewModal |
| US-114 — Печать | ⚠️ | Toast |
| US-115 — Статистика | ✅ | StatisticsModal |

**Файлы:** `modals/TableSettingsModal.tsx`, `modals/TableExportModal.tsx`, `modals/PrintPreviewModal.tsx`

---

## 8. Вторичная обработка (US-120..133, US-220)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| US-120 — Расчётные параметры | ✅ | CalcParamsModal (формула, операторы, прогресс) |
| US-121..125 — Задачи | ✅ | ProcessingPage (список, создание, прогресс, статусы) |
| US-124 — Загрузить задание | ❌ | Модалка загрузки .tsk |
| US-125 — Сохранить задание | ❌ | Модалка сохранения .tsk |
| US-130..133 — Графический редактор | ✅ | GraphicsEditorModal |
| US-220 — Тензопараметры | ✅ | TensoParamsModal |

**Файлы:** `modals/TaskLoadModal.tsx`, `modals/TaskSaveModal.tsx`

---

## 9. Сервис (US-140..161, US-170..177, US-175)

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| US-140..143 — Импорт | ✅ | ImportWizardModal (4 формата) |
| US-150..152 — Экспорт | ✅ | ExportModal (3 формата) |
| US-160 — Авто-синхронизация | ✅ | SyncModal (Auto) |
| US-161 — Ручная синхронизация | ✅ | SyncModal (Manual) |
| US-170..173 — Настройки | ✅ | SettingsModal (4 вкладки) |
| US-176 — Управление ПИВ | ✅ | PivControlModal |
| US-177 — Пакетная обработка | ✅ | BatchProcessingModal |
| US-175 — Снимок экрана | ✅ | Кнопка в тулбаре |

---

## 10. Справка

| Сценарий | Статус | Что сделать |
|----------|--------|-------------|
| По СПМО «Полёт» | ✅ | Modal.info |
| О программе | ✅ | Modal.info |

---

## Этапы реализации

| Шаг | Раздел | Что делаем |
|-----|--------|------------|
| 1 | 3. Траектория | TrajOpenModal, TrajSavePartModal, TrajDelPartModal, клик→маркер на графике |
| 2 | 1. Объект | CreateTopicModal, CreateObjectModal, addTopic/addObject в store |
| 3 | 2. БД СБИ | OpenDbModal, DbEditorPage (страница), DbCompareModal, DbUpdateModal |
| 4 | 4. Экран | ScreenManagerPage, ScreenCreateModal, ScreenSaveModal, SplitScreen |
| 5 | 5. Вид | useViewStore, доработка TrajectoryChart |
| 6 | 6. График | AddFuncModal, GraphLimitsModal, GraphAutoModal, GraphAxisModal, GraphSaveModal, useGraphStore |
| 7 | 7. Таблицы | TableSettingsModal, TableExportModal, PrintPreviewModal |
| 8 | 8. Вторичная обработка | TaskLoadModal, TaskSaveModal |

---

**Итого:** ~30 новых файлов (модалки + страницы + store) + доработка ~10 существующих.
