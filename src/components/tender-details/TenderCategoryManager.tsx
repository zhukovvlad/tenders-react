import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle, Pencil, XCircle } from "lucide-react";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { apiFetch } from "@/api/fetchClient";

// --- Определяем типы данных, которые нам нужны ---
interface TenderDetails {
  id: number;
  category_title: { String: string; Valid: boolean };
}
interface TenderType {
  id: number;
  title: string;
}
interface TenderChapter {
  id: number;
  title: string;
}
interface TenderCategory {
  id: number;
  title: string;
}

interface TenderCategoryManagerProps {
  tender: TenderDetails;
  onUpdate: () => Promise<void>; // Функция для перезагрузки данных на родительской странице
}

export function TenderCategoryManager({
  tender,
  onUpdate,
}: TenderCategoryManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Списки для дропдаунов
  const [types, setTypes] = useState<TenderType[]>([]);
  const [chapters, setChapters] = useState<TenderChapter[]>([]);
  const [categories, setCategories] = useState<TenderCategory[]>([]);

  // Состояния для выбранных значений в форме
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Состояния загрузки для каскадных списков
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // --- Логика загрузки данных для выпадающих списков ---

  // Загрузка типов при первом входе в режим редактирования
  const handleEditClick = async () => {
    setIsEditing(true);
    if (types.length === 0) {
      setIsLoadingTypes(true);
      try {
        const response = await apiFetch(
          `${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES)}?page_size=100`
        );
        if (!response.ok) throw new Error("Не удалось загрузить типы");
        setTypes(await response.json());
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingTypes(false);
      }
    }
  };

  // Каскадная загрузка Разделов при выборе Типа
  useEffect(() => {
    if (!selectedTypeId) {
      setChapters([]);
      return;
    }
    setIsLoadingChapters(true);
    apiFetch(
      `${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES, selectedTypeId)}/chapters`
    )
      .then((res) => res.json())
      .then(setChapters)
      .finally(() => setIsLoadingChapters(false));
  }, [selectedTypeId]);

  // Каскадная загрузка Категорий при выборе Раздела
  useEffect(() => {
    if (!selectedChapterId) {
      setCategories([]);
      return;
    }
    setIsLoadingCategories(true);
    apiFetch(
      `${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_CHAPTERS, selectedChapterId)}/categories`
    )
      .then((res) => res.json())
      .then(setCategories)
      .finally(() => setIsLoadingCategories(false));
  }, [selectedChapterId]);

  // --- Логика сохранения ---
  const handleSave = async (newCategoryId: number | null) => {
    setIsSubmitting(true);
    try {
      await apiFetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.TENDERS, tender.id),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category_id: newCategoryId }),
        }
      );
      await onUpdate(); // Вызываем колбэк для обновления данных на основной странице
      setIsEditing(false); // Закрываем форму
    } catch (e) {
      console.error("Failed to update category", e);
      alert("Ошибка обновления категории");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Если не в режиме редактирования, показываем текущую категорию и кнопку
  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Категория:</span>
        <strong className="font-semibold">
          {tender.category_title.Valid
            ? tender.category_title.String
            : "Не присвоена"}
        </strong>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleEditClick}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // В режиме редактирования показываем каскадные списки
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-muted/20 w-full animate-in fade-in-50">
      <p className="font-semibold text-sm">Присвоить категорию тендеру</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="flex flex-col gap-2">
          <Select
            onValueChange={(val) => {
              setSelectedTypeId(val);
              setSelectedChapterId("");
              setSelectedCategoryId("");
            }}
          >
            <SelectTrigger disabled={isLoadingTypes}>
              <SelectValue
                placeholder={isLoadingTypes ? "Загрузка..." : "1. Выберите тип"}
              />
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
            onValueChange={(val) => {
              setSelectedChapterId(val);
              setSelectedCategoryId("");
            }}
            disabled={!selectedTypeId || isLoadingChapters}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoadingChapters ? "Загрузка..." : "2. Выберите раздел"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedCategoryId}
            disabled={!selectedChapterId || isLoadingCategories}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoadingCategories ? "Загрузка..." : "3. Выберите категорию"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleSave(null)}
          disabled={isSubmitting}
        >
          <XCircle className="mr-2 h-4 w-4" /> Очистить категорию
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(false)}
          disabled={isSubmitting}
        >
          Отмена
        </Button>
        <Button
          size="sm"
          onClick={() => handleSave(parseInt(selectedCategoryId))}
          disabled={isSubmitting || !selectedCategoryId}
        >
          {isSubmitting ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Сохранить"
          )}
        </Button>
      </div>
    </div>
  );
}
