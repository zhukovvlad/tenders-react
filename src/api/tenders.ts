import type { TenderPageData } from "@/types/tender";

export async function fetchTenderById(id: string): Promise<TenderPageData> {
  const response = await fetch(`http://localhost:8080/api/v1/tenders/${id}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error("Тендер не найден");
    throw new Error(`Ошибка сети: ${response.status}`);
  }
  return await response.json();
}
