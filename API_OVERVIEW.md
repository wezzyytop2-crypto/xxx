# API Overview

В проекте нет внешнего API — все операции происходят локально через IndexedDB (idb) и асинхронные функции из lib/db.ts.

## Основные функции (lib/db.ts)
- `getSets()` — получить все наборы
- `addSet(set)` — добавить набор
- `updateSet(set)` — обновить набор
- `deleteSet(setId)` — удалить набор
- `getCards(setId)` — получить все карточки набора
- `addCard(card)` — добавить карточку
- `updateCard(card)` — обновить карточку
- `deleteCard(cardId)` — удалить карточку
- `importCSV(file)` — импортировать набор из CSV
- `exportCSV(setId)` — экспортировать набор в CSV
- `getStats()` — получить статистику
- `updateStats(stats)` — обновить статистику

## Пример использования
```ts
import { getSets, addSet, getCards } from '../lib/db'

async function example() {
  const sets = await getSets();
  await addSet({ id: 'set-1', name: 'Test', cards: [] });
  const cards = await getCards('set-1');
}
```

## Архитектурные соглашения
- Все id имеют префиксы: set-, card-, review-
- Даты — ISO 8601 строки
- Локаль — ru-RU
- Все операции асинхронные

## Расширение
- Для интеграции с внешними сервисами использовать background sync и сервис-воркер
- Для новых форматов импорта/экспорта реализовать парсеры в features/shared/

---

# TODO
- Добавить OpenAPI-описание при появлении внешнего API
- Диаграммы потоков данных (см. ARCHITECTURE.md)
