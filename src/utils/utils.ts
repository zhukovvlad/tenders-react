import type { NullableString } from "@/types/tender";

// Вспомогательная функция для безопасного отображения nullable-строк из Go
export const displayNullableString = (value: NullableString | undefined) => {
  return value && value.Valid ? value.String : "–"; // Возвращаем прочерк, если данных нет
};