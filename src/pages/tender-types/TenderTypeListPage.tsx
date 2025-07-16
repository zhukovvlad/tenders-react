// src/pages/TenderTypesPage.tsx

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
import { LoaderCircle, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { TenderTypeActions } from "@/components/actions/TenderTypeActions";
import { buildApiUrl, API_CONFIG } from "@/config/api";

// Интерфейс для одного типа тендера (соответствует sqlc-модели TenderType)
interface TenderType {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function TenderTypeListPage() {
  const [tenderTypes, setTenderTypes] = useState<TenderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ ФОРМЫ ДОБАВЛЕНИЯ ---
  const [isAdding, setIsAdding] = useState<boolean>(false); // Показывает/скрывает форму
  const [newTypeName, setNewTypeName] = useState<string>(""); // Хранит значение нового типа
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Для состояния отправки

  useEffect(() => {
    const fetchTenderTypes = async () => {
      try {
        const response = await fetch(
          `${buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES)}?page_size=100`
        ); // Загрузим до 100 типов
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Ресурс не найден");
          } else if (response.status >= 500) {
            throw new Error("Ошибка сервера. Попробуйте позже");
          }
          throw new Error(`Ошибка сети: ${response.status}`);
        }
        const data: TenderType[] = await response.json();
        setTenderTypes(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Произошла неизвестная ошибка"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTenderTypes();
  }, []);

  // --- НОВЫЙ ОБРАБОТЧИК ДЛЯ СОХРАНЕНИЯ ---
  const handleSave = async () => {
    if (!newTypeName.trim()) {
      toast.error("Название типа не может быть пустым.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTypeName }),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка сохранения: ${response.status}`);
      }
      const newTenderType: TenderType = await response.json();

      // Обновляем список на клиенте без перезагрузки страницы
      setTenderTypes((prevTypes) => [newTenderType, ...prevTypes]);

      // Сбрасываем форму
      setNewTypeName("");
      setIsAdding(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось сохранить тип");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- НОВЫЕ ФУНКЦИИ ДЛЯ UPDATE и DELETE ---
  const handleUpdateType = async (id: number, newTitle: string) => {
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES, id),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        }
      );
      if (!response.ok) throw new Error("Не удалось обновить тип");
      const updatedType: TenderType = await response.json();

      // Обновляем состояние на клиенте
      setTenderTypes((prev) =>
        prev.map((t) => (t.id === id ? updatedType : t))
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Произошла ошибка");
    }
  };

  const handleDeleteType = async (id: number) => {
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.TENDER_TYPES, id),
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Не удалось удалить тип");

      // Удаляем из состояния на клиенте
      setTenderTypes((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Произошла ошибка");
    }
  };

  if (loading) return <div>Загрузка типов тендеров...</div>;
  if (error) return <div className="text-destructive">Ошибка: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Справочник: Типы тендеров
        </h1>
        {/* Добавляем саму кнопку */}
        <Button
          className="flex items-center gap-2 cursor-pointer"
          variant="destructive"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Добавить тип тендера</span>
        </Button>
      </div>

      {/* Форма для добавления нового типа тендера */}
      {/* --- НОВАЯ ФОРМА ДОБАВЛЕНИЯ --- */}
      {/* Отображается только если isAdding === true */}
      {isAdding && (
        <div className="flex w-full items-center gap-4 p-4 border rounded-lg bg-muted/20">
          <Input
            type="text"
            placeholder="Введите название нового типа..."
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
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
      )}

      {/* Отображаем ошибку сохранения, если она есть */}
      {error && isAdding && <p className="text-destructive text-sm">{error}</p>}

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Наименование</TableHead>
              <TableHead>Дата создания</TableHead>
              {/* --- ДОБАВЛЯЕМ КОЛОНКУ ДЛЯ ДЕЙСТВИЙ --- */}
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenderTypes.length > 0 ? (
              tenderTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">
                    <Badge variant="outline">{type.id}</Badge>
                  </TableCell>
                  <TableCell>{type.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(type.created_at).toLocaleDateString("ru-RU")}
                  </TableCell>
                  {/* --- ДОБАВЛЯЕМ ЯЧЕЙКУ С КОМПОНЕНТОМ ДЕЙСТВИЙ --- */}
                  <TableCell className="text-right">
                    <TenderTypeActions
                      tenderType={type}
                      onUpdate={handleUpdateType}
                      onDelete={handleDeleteType}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Типы тендеров не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
