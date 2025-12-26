import { apiFetch } from "./fetchClient";
import { API_CONFIG } from "@/config/api";
import type { ProposalFullDetails } from "@/types/proposal";
import type { Proposal } from "@/types/tender";

/**
 * Получить список предложений для конкретного лота
 */
export async function getProposalsByLot(lotId: number): Promise<Proposal[]> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}${API_CONFIG.ENDPOINTS.LOTS}/${lotId}/proposals`
  );
  
  if (!response.ok) {
    let errorMessage = `Не удалось загрузить предложения для лота ${lotId}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage += ` - ${errorData.message}`;
      }
    } catch {
      // If response body is not JSON, use statusText only
    }
    throw new Error(errorMessage);
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
    let errorMessage = `Не удалось загрузить детали предложения ${proposalId}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage += ` - ${errorData.message}`;
      }
    } catch {
      // If response body is not JSON, use statusText only
    }
    throw new Error(errorMessage);
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
    let errorMessage = `Не удалось создать предложение для лота ${lotId}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage += ` - ${errorData.message}`;
      }
    } catch {
      // If response body is not JSON, use statusText only
    }
    throw new Error(errorMessage);
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
    let errorMessage = `Не удалось обновить предложение ${proposalId}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage += ` - ${errorData.message}`;
      }
    } catch {
      // If response body is not JSON, use statusText only
    }
    throw new Error(errorMessage);
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
    let errorMessage = `Не удалось удалить предложение ${proposalId}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage += ` - ${errorData.message}`;
      }
    } catch {
      // If response body is not JSON, use statusText only
    }
    throw new Error(errorMessage);
  }
}
