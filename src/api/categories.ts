import type { TenderCategory, TenderChapter, TenderType } from "@/types/tender"; // Предполагаем, что типы вынесены

const API_BASE_URL = "http://localhost:8080/api/v1";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Ошибка сети" }));
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const getTypes = (): Promise<TenderType[]> => {
  return fetch(`${API_BASE_URL}/tender-types?page_size=100`).then(handleResponse);
};

export const getChapters = (typeId: string): Promise<TenderChapter[]> => {
  return fetch(`${API_BASE_URL}/tender-chapters?tender_type_id=${typeId}`).then(handleResponse);
};

export const getCategories = (): Promise<TenderCategory[]> => {
  return fetch(`${API_BASE_URL}/tender-categories?page_size=100`).then(handleResponse);
};

export const createCategory = (data: { title: string; tender_chapter_id: number }): Promise<TenderCategory> => {
  return fetch(`${API_BASE_URL}/tender-categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const updateCategory = (id: number, data: { title: string; tender_chapter_id: number }): Promise<TenderCategory> => {
  return fetch(`${API_BASE_URL}/tender-categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const deleteCategory = (id: number): Promise<void> => {
  return fetch(`${API_BASE_URL}/tender-categories/${id}`, {
    method: "DELETE",
  }).then(res => {
    if (!res.ok) throw new Error("Ошибка удаления");
  });
};