import { useState, useEffect, useCallback } from "react";
import * as api from "@/api/categories";
import type { TenderCategory, TenderChapter, TenderType } from "@/types/tender";

export function useTenderCategories() {
  const [categories, setCategories] = useState<TenderCategory[]>([]);
  const [chapters, setChapters] = useState<TenderChapter[]>([]);
  const [types, setTypes] = useState<TenderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getTypes(), loadAllCategories()])
      .then(([typesData]) => setTypes(typesData))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [loadAllCategories]);

  const loadChapters = useCallback(async (typeId: string) => {
    if (!typeId) {
      setChapters([]);
      return;
    }
    try {
      const data = await api.getChapters(typeId);
      setChapters(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const addCategory = useCallback(
    async (data: { title: string; tender_chapter_id: number }) => {
      await api.createCategory(data);
      await loadAllCategories();
    },
    [loadAllCategories]
  );

  const updateCategoryItem = useCallback(
    async (id: number, data: { title: string; tender_chapter_id: number }) => {
      await api.updateCategory(id, data);
      await loadAllCategories();
    },
    [loadAllCategories]
  );

  // ✅ Эта функция идеально подходит под сигнатуру onDelete: () => Promise<void>
  const deleteCategoryItem = useCallback(async (id: number) => {
    try {
      await api.deleteCategory(id);
      // Оптимистичное обновление: удаляем из списка сразу после успешного запроса
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError((e as Error).message);
      // Пробрасываем ошибку дальше, чтобы компонент Actions мог ее обработать
      throw e;
    }
  }, []);

  return {
    categories,
    types,
    chapters,
    loading,
    error,
    loadChapters,
    addCategory,
    updateCategoryItem,
    deleteCategoryItem,
  };
}
