import { apiFetch } from "./fetchClient";
import { API_CONFIG } from "@/config/api";
import type { ProposalFullDetails } from "@/types/proposal";
import type { Proposal } from "@/types/tender";

/**
 * Обработка ошибок API с парсингом тела ответа
 */
async function handleApiError(response: Response, baseMessage: string): Promise<never> {
  let errorMessage = `${baseMessage}: ${response.statusText}`;
  try {
    const errorData = await response.json();
    if (errorData?.message) {
      errorMessage += ` - ${errorData.message}`;
    }
  } catch (parseError) {
    // If response body is not JSON, log parsing error and use statusText only
    console.error("Failed to parse error response as JSON:", parseError);
  }
  throw new Error(errorMessage);
}

/**
 * Получить список предложений для конкретного лота
 */
export async function getProposalsByLot(lotId: number): Promise<Proposal[]> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}${API_CONFIG.ENDPOINTS.LOTS}/${lotId}/proposals`
  );
  
  if (!response.ok) {
    await handleApiError(response, `Не удалось загрузить предложения для лота ${lotId}`);
  }
  
  return response.json();
}

/**
 * Получить детальную информацию о предложении с полной сметой
 */
export async function getProposalDetails(proposalId: number): Promise<ProposalFullDetails> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}${API_CONFIG.ENDPOINTS.PROPOSALS}/${proposalId}/details`
  );
  
  if (!response.ok) {
    await handleApiError(response, `Не удалось загрузить детали предложения ${proposalId}`);
  }
  
  return response.json();
}

/**
 * Создать новое предложение
 */
export async function createProposal(lotId: number, data: Partial<Proposal>): Promise<Proposal> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}${API_CONFIG.ENDPOINTS.LOTS}/${lotId}/proposals`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  
  if (!response.ok) {
    await handleApiError(response, `Не удалось создать предложение для лота ${lotId}`);
  }
  
  return response.json();
}

/**
 * Обновить существующее предложение
 */
export async function updateProposal(proposalId: number, data: Partial<Proposal>): Promise<Proposal> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}${API_CONFIG.ENDPOINTS.PROPOSALS}/${proposalId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  
  if (!response.ok) {
    await handleApiError(response, `Не удалось обновить предложение ${proposalId}`);
  }
  
  return response.json();
}

/**
 * Удалить предложение
 */
export async function deleteProposal(proposalId: number): Promise<void> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}${API_CONFIG.ENDPOINTS.PROPOSALS}/${proposalId}`,
    {
      method: "DELETE",
    }
  );
  
  if (!response.ok) {
    await handleApiError(response, `Не удалось удалить предложение ${proposalId}`);
  }
}
