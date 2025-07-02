import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Вспомогательная функция для "умного" поиска значения по префиксу ключа
export const findValueByKeyPrefix = (
  // Принимает объект additional_info (или null)
  data: Record<string, string | null> | null, 
  // И префикс, который мы ищем (например, "Аванс")
  prefix: string
): string | null => {
  // Если данных нет, возвращаем null
  if (!data) {
    return null;
  }

  // Приводим префикс к нижнему регистру для регистронезависимого поиска
  const lowerCasePrefix = prefix.toLowerCase();

  // Ищем первый ключ в объекте, который после приведения к нижнему регистру
  // и удаления пробелов по краям начинается с нашего префикса
  const key = Object.keys(data).find(k => 
    k.trim().toLowerCase().startsWith(lowerCasePrefix)
  );

  // Если ключ найден, возвращаем его значение. Если нет - null.
  return key ? data[key] : null;
};
