import { useState, useEffect } from "react";
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
import { TenderCategoryActions } from "@/components/actions/TenderCategoryActions";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { apiFetch } from "@/api/fetchClient";

interface TenderCategory {
  id: number;
  title: string;
  tender_chapter_id: number;
  tender_chapter_title: string;
  tender_type_id: number;
}

interface TenderChapter {
  id: number;
  title: string;
  tender_type_id: number;
}

interface TenderType {
  id: number;
  title: string;
}

export function TenderCategoriesPage() {
  const [categories, setCategories] = useState<TenderCategory[]>([]);
  const [chapters, setChapters] = useState<TenderChapter[]>([]);
  const [types, setTypes] = useState<TenderType[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedChapterId, setEditedChapterId] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTypes = async () => {
    try {
      const res = await apiFetch(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES)}?page_size=100`
      );
      if (!res.ok) throw new Error("Ошибка загрузки типов");
      setTypes(await res.json());
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const fetchChapters = async (typeId: string) => {
    try {
      const res = await apiFetch(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CHAPTERS)}?tender_type_id=${typeId}`
      );
      if (!res.ok) throw new Error("Ошибка загрузки разделов");
      setChapters(await res.json());
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiFetch(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CATEGORIES)}?page_size=100`
      );
      if (!res.ok) throw new Error("Ошибка загрузки категорий");
      setCategories(await res.json());
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTypes(), fetchCategories()]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedTypeId) {
      fetchChapters(selectedTypeId);
    } else {
      setChapters([]);
      setSelectedChapterId("");
    }
  }, [selectedTypeId]);

  const handleCreate = async () => {
    if (!newTitle || !selectedChapterId) return;
    setIsSubmitting(true);
    try {
      await apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CATEGORIES), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          tender_chapter_id: parseInt(selectedChapterId),
        }),
      });
      await fetchCategories();
      setIsAdding(false);
      setNewTitle("");
      setSelectedTypeId("");
      setSelectedChapterId("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: TenderCategory) => {
    fetchChapters(category.tender_type_id.toString());

    setEditingCategoryId(category.id);
    setEditedTitle(category.title);
    setEditedChapterId(category.tender_chapter_id.toString());
  };

  const handleUpdate = async () => {
    if (!editedTitle || !editedChapterId || editingCategoryId === null) return;
    setIsSubmitting(true);
    try {
      await apiFetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CATEGORIES, editingCategoryId),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editedTitle,
            tender_chapter_id: parseInt(editedChapterId),
          }),
        }
      );
      await fetchCategories();
      setEditingCategoryId(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
      await apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CATEGORIES, id), {
        method: "DELETE",
      });
      await fetchCategories();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Категории тендеров
        </h1>
        <Button
          className="cursor-pointer"
          variant="destructive"
          onClick={() => setIsAdding(!isAdding)}
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Добавить
        </Button>
      </div>

      {isAdding && (
        <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
          <div className="grid md:grid-cols-2 gap-4">
            <Select value={selectedTypeId} onValueChange={setSelectedTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedChapterId}
              onValueChange={setSelectedChapterId}
              disabled={!selectedTypeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите раздел" />
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
            <Input
              placeholder="Название новой категории"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={!selectedChapterId}
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={handleCreate}
                disabled={isSubmitting || !newTitle || !selectedChapterId}
              >
                {isSubmitting && (
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                )}{" "}
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
        </div>
      )}

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="border rounded-lg">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-2/5">Название</TableHead>
                <TableHead className="w-2/5">Раздел</TableHead>
                <TableHead className="w-[120px] text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) =>
                editingCategoryId === c.id ? (
                  <TableRow key={c.id} className="bg-muted/40">
                    <TableCell>
                      <Badge variant="outline">{c.id}</Badge>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <div className="flex items-center gap-2">
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="flex-1"
                        />
                        <Select
                          value={editedChapterId}
                          onValueChange={setEditedChapterId}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Раздел" />
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
                        <Button
                          size="sm"
                          onClick={handleUpdate}
                          disabled={
                            isSubmitting || !editedTitle || !editedChapterId
                          }
                        >
                          Сохранить
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCategoryId(null)}
                        >
                          Отмена
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Badge variant="outline">{c.id}</Badge>
                    </TableCell>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.tender_chapter_title}</TableCell>
                    <TableCell className="text-right">
                      <TenderCategoryActions
                        categoryTitle={c.title}
                        onEdit={() => handleEdit(c)}
                        onDelete={() => handleDelete(c.id)}
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {error && <div className="text-red-500">Ошибка: {error}</div>}
    </div>
  );
}
