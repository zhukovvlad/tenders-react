import { buildApiUrl, API_CONFIG } from '../config/api'

export async function updateLotKeyParameters(lotId: number, params: Record<string, string>) {
  const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOTS, lotId) + '/key-parameters', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ lot_key_parameters: params })
  })

  if (!res.ok) {
    throw new Error("Ошибка при обновлении ключевых параметров")
  }

  return res.json()
}
