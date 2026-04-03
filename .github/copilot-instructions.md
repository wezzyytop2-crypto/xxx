# Project Guidelines

## Code Style
- TypeScript strict mode enabled
- Component naming: Screens in `components/screens/`, cards in `components/cards/`, providers in `components/providers/`
- Use `"use client"` directive for all React components
- Tailwind CSS with custom color tokens via CSS variables
- Class name utility: `cn()` for conditional classes

## Architecture
- Next.js 14 App Router (not Pages Router)
- Feature-based structure: `features/sets/`, `features/study/`, `features/shared/`
- Fully offline PWA with IndexedDB storage using idb library
- Global state managed via AppProvider context (no external state libraries)
- SM-2 spaced repetition algorithm for flashcard learning
- Three study modes: flashcards (swipe), learn (difficult cards), write (manual input)
- Service worker for caching static assets and offline fallback

## Features
- 📚 10+ категорий словаря с 250+ словами
- 🎮 Система геймификации (XP, уровни)
- 💾 Экспорт/импорт через CSV
- 📊 Полная статистика и соответствующие ки трендов
- 🗣️ Web Speech API для произношения
- 🔄 Background sync для будущей синхронизации

## Build and Test
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Start production: `npm start`
- No test framework configured

## Key Routes
- `/` - Главный экран с рекомендациями
- `/stats` - Полная статистика и экспорт
- `/sets/new` - Создание набора (с импортом CSV)
- `/sets/[setId]` - Детали набора
- `/sets/[setId]/study` - Сессия обучения
- `/sets/[setId]/edit` - Редактирование набора

## Conventions
- ID generation: Always prefixed (set-, card-, review-, seed-)
- Timestamps: ISO 8601 strings in storage
- Locale: Russian (ru-RU) for UI labels and dates
- Data models: See ../lib/types.ts
- Database operations: Async functions in ../lib/db.ts
- Study logic: Pure functions in ../lib/study.ts
- Utilities: ../lib/utils.ts for formatting and helpers
- Reusable hooks: ../lib/hooks/ for custom logic
- Shared components: ../features/shared/ for cross-feature use

See ../README.md for setup and deployment instructions.</content>
<parameter name="filePath">c:\Users\mellory_2\Desktop\xxx\.github\copilot-instructions.md