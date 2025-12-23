import type { Winner, CreateWinnerRequest } from "@/types/tender";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { apiFetch } from "./fetchClient";

const WINNERS_ENDPOINT = "/winners";

export const WinnerAPI = {
  /**
   * Создать победителя для лота
   */
  create: async (lotId: number, data: CreateWinnerRequest): Promise<Winner> => {
    const res = await apiFetch(
      buildApiUrl(API_CONFIG.ENDPOINTS.LOTS, lotId) + "/winners",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error(`Ошибка при создании победителя: ${res.status}`);
    }

    return res.json();
  },

  /**
   * Обновить данные победителя (PATCH)
   */
  update: async (
    winnerId: number,
    data: Partial<CreateWinnerRequest>
  ): Promise<Winner> => {
    const res = await apiFetch(buildApiUrl(WINNERS_ENDPOINT, winnerId), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Ошибка при обновлении победителя: ${res.status}`);
    }

    return res.json();
  },

  /**
   * Удалить победителя
   */
  delete: async (winnerId: number): Promise<void> => {
    const res = await apiFetch(buildApiUrl(WINNERS_ENDPOINT, winnerId), {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Ошибка при удалении победителя: ${res.status}`);
    }
  },
};
