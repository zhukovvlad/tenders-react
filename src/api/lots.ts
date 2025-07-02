export async function updateLotKeyParameters(lotId: number, params: Record<string, string>) {
  const res = await fetch(`http://localhost:8080/api/v1/lots/${lotId}/key-parameters`, {
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
