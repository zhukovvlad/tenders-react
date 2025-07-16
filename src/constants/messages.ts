/**
 * Application constants
 * Centralized location for all magic strings and constants
 */

export const MESSAGES = {
  ERROR: {
    NETWORK: 'Ошибка сети',
    UNKNOWN: 'Произошла неизвестная ошибка',
    TENDER_NOT_FOUND: 'Тендер не найден',
    TENDER_ID_MISSING: 'ID тендера не указан в URL.',
    LOADING_DATA: 'Ошибка загрузки данных',
    DELETE_FAILED: 'Ошибка удаления на сервере',
    UPDATE_FAILED: 'Не удалось обновить раздел',
  },
  SUCCESS: {
    CREATED: 'Успешно создано',
    UPDATED: 'Успешно обновлено',
    DELETED: 'Успешно удалено',
  },
  LOADING: {
    DATA: 'Загрузка данных...',
    SUBMITTING: 'Отправка...',
  },
  ACTIONS: {
    CREATE: 'Создать',
    UPDATE: 'Обновить',
    DELETE: 'Удалить',
    CANCEL: 'Отмена',
    SAVE: 'Сохранить',
    EDIT: 'Редактировать',
  }
} as const;

export const UI_TEXT = {
  NO_DATA: 'Нет данных для отображения.',
  NO_LOTS: 'В этом тендере нет лотов.',
  DEVELOPMENT: 'В разработке',
  NOT_AVAILABLE: 'N/A',
} as const;

export const FORM_VALIDATION = {
  REQUIRED_FIELD: 'Это поле обязательно',
  MIN_LENGTH: (min: number) => `Минимальная длина: ${min} символов`,
  MAX_LENGTH: (max: number) => `Максимальная длина: ${max} символов`,
} as const;

export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;