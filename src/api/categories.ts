import type { TenderCategory, TenderChapter, TenderType } from "@/types/tender"; // Предполагаем, что типы вынесены
import { API_CONFIG, buildApiUrl } from "@/config/api";
import { apiFetch } from "./fetchClient";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Ошибка сети" }));
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const getTypes = (): Promise<TenderType[]> => {
  return apiFetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES)}?page_size=100`).then(handleResponse);
};

export const getChapters = (typeId: string): Promise<TenderChapter[]> => {
  return apiFetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CHAPTERS)}?tender_type_id=${typeId}`).then(handleResponse);
};

export const getCategories = (): Promise<TenderCategory[]> => {
  return apiFetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CATEGORIES)}?page_size=100`).then(handleResponse);
};

export const createCategory = (data: { title: string; tender_chapter_id: number }): Promise<TenderCategory> => {
  return apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CATEGORIES), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const updateCategory = (id: number, data: { title: string; tender_chapter_id: number }): Promise<TenderCategory> => {
  return apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CATEGORIES, id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const deleteCategory = (id: number): Promise<void> => {
  return apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CATEGORIES, id), {
    method: "DELETE",
  }).then(res => {
    if (!res.ok) throw new Error("Ошибка удаления");
  });
};