import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KeyParametersListProps {
  parameters: Record<string, string>
  onChange?: (params: Record<string, string>) => void
}

export function KeyParametersList({ parameters, onChange }: KeyParametersListProps) {
  const [localParams, setLocalParams] = useState<[string, string][]>(
    Object.entries(parameters).sort(([a], [b]) => a.localeCompare(b))
  )
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingNewKey, setEditingNewKey] = useState("")
  const [editingValue, setEditingValue] = useState("")

  const emitChange = (entries: [string, string][]) => {
    const updated: Record<string, string> = {}
    for (const [k, v] of entries) updated[k] = v
    onChange?.(updated)
  }

  const handleDelete = (key: string) => {
    const filtered = localParams.filter(([k]) => k !== key)
    setLocalParams(filtered as [string, string][])
    emitChange(filtered as [string, string][])
  }

  const handleAdd = () => {
    if (!newKey.trim()) return
    const updated = [...localParams, [newKey, newValue]] as [string, string][]
    setLocalParams(updated)
    setNewKey("")
    setNewValue("")
    emitChange(updated)
  }

  const handleEdit = (key: string, value: string) => {
    setEditingKey(key)
    setEditingNewKey(key)
    setEditingValue(value)
  }

  const handleEditSave = () => {
    if (editingKey === null) return
    const updated = localParams.map(([k, v]) =>
      k === editingKey ? [editingNewKey, editingValue] : [k, v]
    ) as [string, string][]
    setLocalParams(updated)
    setEditingKey(null)
    emitChange(updated)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...localParams] as [string, string][]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setLocalParams(updated)
    emitChange(updated)
  }

  const moveDown = (index: number) => {
    if (index === localParams.length - 1) return
    const updated = [...localParams] as [string, string][]
    ;[updated[index + 1], updated[index]] = [updated[index], updated[index + 1]]
    setLocalParams(updated)
    emitChange(updated)
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Ключевые параметры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {localParams.map(([key, value], index) => (
          <div key={key} className="flex flex-wrap items-center gap-2">
            <div className="flex flex-row gap-1">
              <Button variant="ghost" size="icon" onClick={() => moveUp(index)}>
                <ArrowUp size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveDown(index)}>
                <ArrowDown size={16} />
              </Button>
            </div>

            {editingKey === key ? (
              <>
                <Input
                  value={editingNewKey}
                  onChange={(e) => setEditingNewKey(e.target.value)}
                  className="w-[200px]"
                  placeholder="Ключ"
                />
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="w-[200px]"
                  placeholder="Значение"
                />
                <Button size="sm" onClick={handleEditSave}>
                  Сохранить
                </Button>
              </>
            ) : (
              <>
                <span className="text-muted-foreground min-w-[200px]">
                  {key}: {value}
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(key, value)}>
                  Редактировать
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(key)}>
                  Удалить
                </Button>
              </>
            )}
          </div>
        ))}

        <div className="border-t pt-4 mt-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              placeholder="Ключ"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Input
              placeholder="Значение"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <Button onClick={handleAdd}>Добавить</Button>
        </div>
      </CardContent>
    </Card>
  )
}
