# Стандарты разработки проекта Tenders React

## Обзор

Этот документ описывает стандарты разработки и рекомендации по улучшению качества кода для проекта Tenders React.

## Архитектура проекта

### Структура папок
```
src/
├── api/           # API вызовы и сетевые функции
├── components/    # React компоненты
├── config/        # Конфигурационные файлы
├── constants/     # Константы приложения
├── hooks/         # Пользовательские React хуки
├── pages/         # Компоненты страниц
├── types/         # TypeScript типы
└── utils/         # Утилитарные функции
```

## Исправленные проблемы

### 1. Критические ошибки линтинга
- ✅ **Исправлены нарушения React Hooks**: условный вызов хука `useTenderData`
- ✅ **Удалены неиспользуемые переменные**: параметры `onUpdate`, `onDelete` в ProposalCard
- ✅ **Исправлена обработка ошибок**: переименована переменная `error` во избежание конфликтов

### 2. Конфигурация API
- ✅ **Централизация API URLs**: создан `src/config/api.ts`
- ✅ **Переменные окружения**: добавлен `.env.example`
- ✅ **Функция buildApiUrl**: унифицированное построение URL

### 3. Константы приложения
- ✅ **Файл констант**: создан `src/constants/messages.ts`
- ✅ **Замена магических строк**: централизованы сообщения об ошибках и UI тексты

### 4. Улучшенная ESLint конфигурация
- ✅ **Строгие правила TypeScript**: дополнительные проверки качества кода
- ✅ **Консистентная обработка неиспользуемых переменных**
- ✅ **Предупреждения о console.log**: разрешены только warn и error

## Рекомендации по улучшению

### Высокий приоритет

1. **Добавить обработку ошибок сети**
   ```typescript
   // Плохо
   const response = await fetch(url);
   
   // Хорошо
   try {
     const response = await fetch(url);
     if (!response.ok) {
       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
     }
   } catch (error) {
     // Логирование и обработка ошибки
   }
   ```

2. **Использовать TypeScript типы вместо any**
   ```typescript
   // Плохо
   const data: any = await response.json();
   
   // Хорошо
   const data: TenderPageData = await response.json();
   ```

3. **Добавить валидацию данных**
   - Использовать библиотеки типа Zod для валидации API ответов
   - Проверять обязательные поля перед отправкой

### Средний приоритет

4. **Оптимизация производительности**
   - Разделение кода (code splitting) для уменьшения размера бандла
   - Мемоизация компонентов с React.memo
   - useMemo и useCallback для оптимизации

5. **Улучшение UX**
   - Индикаторы загрузки для всех асинхронных операций
   - Обработка состояний ошибок
   - Оптимистичные обновления

6. **Тестирование**
   - Добавить unit тесты для утилитарных функций
   - Интеграционные тесты для API вызовов
   - E2E тесты для критических пользовательских сценариев

### Низкий приоритет

7. **Документация**
   - JSDoc комментарии для сложных функций
   - README с инструкциями по запуску
   - Storybook для компонентов UI

8. **Инструменты разработки**
   - Prettier для автоформатирования
   - Husky для pre-commit хуков
   - Commitizen для стандартизации коммитов

## Стандарты кодирования

### TypeScript
- Использовать строгую типизацию (`strict: true`)
- Избегать `any`, использовать `unknown` при необходимости
- Определять интерфейсы для всех API ответов

### React
- Использовать функциональные компоненты
- Хуки должны быть на верхнем уровне компонента
- Избегать встраивания объектов в JSX (выносить в переменные)

### Именование
- Компоненты: PascalCase (`TenderCard`)
- Функции и переменные: camelCase (`fetchTenderData`)
- Константы: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Файлы: kebab-case для утилит, PascalCase для компонентов

### Организация импортов
```typescript
// 1. Внешние библиотеки
import React from 'react';
import { useState } from 'react';

// 2. Внутренние модули (абсолютные пути)
import { Button } from '@/components/ui/button';
import { API_CONFIG } from '@/config/api';

// 3. Относительные импорты
import './styles.css';
```

## Производительность

### Предупреждения сборки
- Размер бандла превышает 500KB
- Рекомендуется использовать динамические импорты для разделения кода

### Рекомендации
1. Вынести тяжелые компоненты в отдельные чанки
2. Использовать React.lazy для ленивой загрузки страниц
3. Оптимизировать изображения и ресурсы

## Безопасность

1. **Валидация входных данных** на клиенте и сервере
2. **Санитизация пользовательского ввода**
3. **HTTPS для всех API вызовов** в продакшене
4. **Скрытие чувствительной информации** в переменных окружения

## Мониторинг качества кода

### Метрики
- Покрытие тестами: цель 80%+
- ESLint ошибки: 0
- TypeScript ошибки: 0
- Размер бандла: < 500KB для основного чанка

### Инструменты
- ESLint для проверки стиля кода
- TypeScript для типизации
- Bundle analyzer для анализа размера
- Lighthouse для проверки производительности