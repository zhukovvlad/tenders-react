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
    throw new Error(`Не удалось загрузить предложения: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Получить детальную информацию о предложении с полной сметой
 */
export async function getProposalDetails(proposalId: number): Promise<ProposalFullDetails> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}/proposals/${proposalId}/details`
  );
  
  if (!response.ok) {
    throw new Error(`Не удалось загрузить детали предложения: ${response.statusText}`);
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
    throw new Error(`Не удалось создать предложение: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Обновить существующее предложение
 */
export async function updateProposal(proposalId: number, data: Partial<Proposal>): Promise<Proposal> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}/proposals/${proposalId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  
  if (!response.ok) {
    throw new Error(`Не удалось обновить предложение: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Удалить предложение
 */
export async function deleteProposal(proposalId: number): Promise<void> {
  const response = await apiFetch(
    `${API_CONFIG.API_BASE}/proposals/${proposalId}`,
    {
      method: "DELETE",
    }
  );
  
  if (!response.ok) {
    throw new Error(`Не удалось удалить предложение: ${response.statusText}`);
  }
}
