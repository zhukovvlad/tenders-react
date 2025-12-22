import type { TenderPageData } from "@/types/tender";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { MESSAGES, HTTP_CODES } from "@/constants/messages";
import { apiFetch } from "./fetchClient";

export async function fetchTenderById(id: string): Promise<TenderPageData> {
  const response = await apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.TENDERS, id));
  if (!response.ok) {
    if (response.status === HTTP_CODES.NOT_FOUND) throw new Error(MESSAGES.ERROR.TENDER_NOT_FOUND);
    throw new Error(`${MESSAGES.ERROR.NETWORK}: ${response.status}`);
  }
  return await response.json();
}
