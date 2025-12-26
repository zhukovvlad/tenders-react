import type { NullableString } from "@/types/tender";

// Вспомогательная функция для безопасного отображения nullable-строк из Go
export const displayNullableString = (value: NullableString | undefined, fallback: string = "–") => {
  return value && value.Valid ? value.String : fallback;
};

/**
 * Форматирование валюты (для отображения с символом рубля)
 */
export const formatCurrency = (value: string | number | null | undefined) => {
  if (value == null || value === "") return "—";
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Форматирование числа как валюты без символа (для таблиц)
 */
export const formatDecimal = (value: string | undefined | null) => {
  if (!value) return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return "—";
  
  if (num >= 1000) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Форматирование nullable поля как валюту
 * Упрощает работу с nullable полями из Go backend
 */
export const formatNullableCurrency = (field: NullableString | undefined) => {
  const value = displayNullableString(field, "");
  return formatCurrency(value || null);
};