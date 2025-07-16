import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";
import type { TenderType, TenderChapter } from "@/types/tender";

interface AddCategoryFormProps {
  types: TenderType[];
  chapters: TenderChapter[];
  onTypeChange: (typeId: string) => void;
  onAdd: (data: { title: string; tender_chapter_id: number }) => Promise<void>;
  onCancel: () => void;
}

export function AddCategoryForm({ types, chapters, onTypeChange, onAdd, onCancel }: AddCategoryFormProps) {
  const [title, setTitle] = useState("");
  const [typeId, setTypeId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onTypeChange(typeId);
    setChapterId(""); // Сбрасываем раздел при смене типа
  }, [typeId, onTypeChange]);

  const handleSubmit = async () => {
    if (!title || !chapterId) return;
    setIsSubmitting(true);
    try {
      await onAdd({ title, tender_chapter_id: parseInt(chapterId) });
      onCancel(); // Закрываем форму только после успеха
    } catch (error) {
      console.error("Failed to add category:", error);
      // Оставляем форму открытой при ошибке, чтобы пользователь мог исправить данные
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
      <div className="grid md:grid-cols-2 gap-4">
        {/* --- СЕЛЕКТ ТИПА --- */}
        <Select value={typeId} onValueChange={setTypeId} disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="1. Выберите тип" />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t.id} value={t.id.toString()}>
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* --- СЕЛЕКТ РАЗДЕЛА --- */}
        <Select value={chapterId} onValueChange={setChapterId} disabled={!typeId || isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="2. Выберите раздел" />
          </SelectTrigger>
          <SelectContent>
            {chapters.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
        {/* --- ПОЛЕ ВВОДА НАЗВАНИЯ --- */}
        <Input
          placeholder="3. Введите название новой категории"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!chapterId || isSubmitting}
        />
        {/* --- КНОПКИ --- */}
        <div className="flex gap-2 justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting || !title || !chapterId}>
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}