import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, LoaderCircle } from "lucide-react";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { TenderChapterActions } from "@/components/actions/TenderChapterActions";
import { apiFetch } from "@/api/fetchClient";

// --- Определяем типы данных ---

interface TenderChapter {
  id: number;
  title: string;
  tender_type_id: number;
  tender_type_title: string;
  created_at: string;
}

interface TenderType {
  id: number;
  title: string;
}

// --- Вспомогательные компоненты для строк таблицы ---

// Компонент для отображения обычной строки
const DisplayChapterRow = ({
  chapter,
  onEdit,
  onDelete,
}: {
  chapter: TenderChapter;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) => (
  <TableRow>
    <TableCell>
      <Badge variant="outline">{chapter.id}</Badge>
    </TableCell>
    <TableCell className="font-medium">{chapter.title}</TableCell>
    <TableCell className="text-muted-foreground">
      {chapter.tender_type_title}
    </TableCell>
    <TableCell className="text-right">
      <TenderChapterActions
        chapterTitle={chapter.title}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </TableCell>
  </TableRow>
);

// Компонент для отображения строки в режиме редактирования
const EditChapterRow = ({
  chapter,
  tenderTypes,
  onSave,
  onCancel,
  isSubmitting,
}: {
  chapter: TenderChapter;
  tenderTypes: TenderType[];
  onSave: (id: number, newTitle: string, newTypeId: number) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  const [editedTitle, setEditedTitle] = useState(chapter.title);
  const [editedTypeId, setEditedTypeId] = useState(
    chapter.tender_type_id.toString()
  );

  return (
    <TableRow className="bg-muted/50">
      <TableCell>
        <Badge variant="secondary">{chapter.id}</Badge>
      </TableCell>
      <TableCell>
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </TableCell>
      <TableCell>
        <Select
          onValueChange={setEditedTypeId}
          defaultValue={editedTypeId}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tenderTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            onClick={() =>
              onSave(chapter.id, editedTitle, parseInt(editedTypeId))
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              "Сохранить"
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// --- Основной компонент страницы ---

export function TenderChaptersPage() {
  const [chapters, setChapters] = useState<TenderChapter[]>([]);
  const [tenderTypes, setTenderTypes] = useState<TenderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newChapterTitle, setNewChapterTitle] = useState<string>("");
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);

  const fetchTenderChapters = useCallback(async () => {
    // Не включаем здесь setLoading(true), чтобы таблица не "моргала" при обновлении
    try {
      const response = await apiFetch(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CHAPTERS)}?page_size=100`
      );
      if (!response.ok) throw new Error(`Ошибка сети при загрузке разделов`);
      const data: TenderChapter[] = await response.json();
      setChapters(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Не удалось обновить список разделов"
      );
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [chaptersResponse, typesResponse] = await Promise.all([
          apiFetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CHAPTERS)}?page_size=100`),
          apiFetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES)}?page_size=100`),
        ]);
        if (!chaptersResponse.ok || !typesResponse.ok)
          throw new Error(`Ошибка сети`);

        setChapters(await chaptersResponse.json());
        setTenderTypes(await typesResponse.json());
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Произошла ошибка при начальной загрузке"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [fetchTenderChapters]);

  const handleCreate = async () => {
    if (!newChapterTitle.trim() || !selectedTypeId)
      return alert("Название и тип должны быть выбраны.");
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await apiFetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CHAPTERS),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newChapterTitle,
            tender_type_id: parseInt(selectedTypeId),
          }),
        }
      );
      if (!response.ok)
        throw new Error(`Ошибка сохранения: ${response.status}`);
      await fetchTenderChapters();
      setNewChapterTitle("");
      setSelectedTypeId("");
      setIsAdding(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось сохранить раздел");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    id: number,
    newTitle: string,
    newTypeId: number
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await apiFetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CHAPTERS, id),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, tender_type_id: newTypeId }),
        }
      );
      if (!response.ok) throw new Error("Не удалось обновить раздел");
      await fetchTenderChapters();
      setEditingChapterId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка обновления");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const originalChapters = [...chapters];
    setChapters((prev) => prev.filter((c) => c.id !== id));
    setError(null);
    try {
      const response = await apiFetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CHAPTERS, id),
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Ошибка удаления на сервере");
    } catch {
      setError("Не удалось удалить раздел. Восстанавливаем список.");
      setChapters(originalChapters);
    }
  };

  if (loading) return <div className="p-4">Загрузка данных...</div>;
  if (error) return <div className="p-4 text-destructive">Ошибка: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Справочник: Разделы тендеров (по типам)
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-2 cursor-pointer"
          variant="destructive"
          onClick={() => {
            setIsAdding((prev) => !prev);
            setEditingChapterId(null);
          }}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Добавить раздел тендера</span>
        </Button>
      </div>

      {isAdding && (
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] items-center gap-4 p-3 border rounded-lg bg-muted/20 animate-in fade-in-50">
          <Input
            placeholder="Название нового раздела..."
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <Select
            onValueChange={setSelectedTypeId}
            value={selectedTypeId}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите родительский тип" />
            </SelectTrigger>
            <SelectContent>
              {tenderTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleCreate}
              disabled={isSubmitting || !newChapterTitle || !selectedTypeId}
            >
              {isSubmitting && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Сохранить
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAdding(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Наименование раздела</TableHead>
              <TableHead>Тип тендера (родитель)</TableHead>
              <TableHead className="text-right w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapters.map((chapter) =>
              editingChapterId === chapter.id ? (
                <EditChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  tenderTypes={tenderTypes}
                  onSave={handleUpdate}
                  onCancel={() => setEditingChapterId(null)}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <DisplayChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  onEdit={() => {
                    setEditingChapterId(chapter.id);
                    setIsAdding(false);
                  }}
                  onDelete={() => handleDelete(chapter.id)}
                />
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
