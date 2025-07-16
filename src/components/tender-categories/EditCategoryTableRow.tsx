import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { TenderCategory, TenderChapter } from "@/types/tender";

interface EditProps {
  category: TenderCategory;
  chapters: TenderChapter[];
  onSave: (id: number, data: { title: string; tender_chapter_id: number }) => Promise<void>;
  onCancel: () => void;
  loadChaptersForEdit: (typeId: string) => void;
}

export function EditCategoryTableRow({ category, chapters, onSave, onCancel, loadChaptersForEdit }: EditProps) {
  const [title, setTitle] = useState(category.title);
  const [chapterId, setChapterId] = useState(category.tender_chapter_id.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Загружаем нужные разделы для выпадающего списка при первом рендере
    if (category.tender_type_id) {
      loadChaptersForEdit(category.tender_type_id.toString());
    }
  }, [category.tender_type_id, loadChaptersForEdit]);

  const handleSave = async () => {
    if (!title || !chapterId) return;
    setIsSubmitting(true);
    try {
      await onSave(category.id, { title, tender_chapter_id: parseInt(chapterId) });
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TableRow className="bg-muted/40">
      <TableCell>
        <Badge variant="outline">{category.id}</Badge>
      </TableCell>
      <TableCell colSpan={2}>
        <div className="flex items-center gap-2 min-w-0">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Select value={chapterId} onValueChange={setChapterId} disabled={isSubmitting}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Выберите раздел" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((ch) => (
                <SelectItem key={ch.id} value={ch.id.toString()}>
                  {ch.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button size="sm" onClick={handleSave} disabled={isSubmitting || !title || !chapterId}>
            Сохранить
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Отмена
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}