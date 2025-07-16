import { useState } from "react";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TenderCategoryActions } from "@/components/actions/TenderCategoryActions";
import { useTenderCategories } from "@/hooks/useTenderCategories";
import { AddCategoryForm } from "@/components/tender-categories/AddCategoryForm";
import { EditCategoryTableRow } from "@/components/tender-categories/EditCategoryTableRow";

export function TenderCategoriesPage() {
  const { categories, types, chapters, loading, error, loadChapters, addCategory, updateCategoryItem, deleteCategoryItem } = useTenderCategories();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const handleUpdate = async (id: number, data: { title: string; tender_chapter_id: number }) => {
    await updateCategoryItem(id, data);
    setEditingCategoryId(null); // Закрываем редактирование после сохранения
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-500">Ошибка: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Категории тендеров</h1>
        <Button onClick={() => setIsAdding(true)} size="sm">
          <PlusCircle className="h-4 w-4 mr-1" /> Добавить
        </Button>
      </div>

      {isAdding && (
        <AddCategoryForm 
          types={types} 
          chapters={chapters} 
          onTypeChange={loadChapters}
          onAdd={addCategory}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="border rounded-lg">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">ID</TableHead>
              <TableHead className="w-5/10">Название</TableHead>
              <TableHead className="w-4/10">Раздел</TableHead>
              <TableHead className="w-[60px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => 
              editingCategoryId === c.id ? (
                <EditCategoryTableRow 
                  key={c.id}
                  category={c}
                  chapters={chapters}
                  onSave={handleUpdate}
                  onCancel={() => setEditingCategoryId(null)}
                  loadChaptersForEdit={loadChapters}
                />
              ) : (
                <TableRow key={c.id}>
                  <TableCell><Badge variant="outline">{c.id}</Badge></TableCell>
                  <TableCell className="break-all whitespace-normal">{c.title}</TableCell>
                  <TableCell className="break-all whitespace-normal">{c.tender_chapter_title}</TableCell>
                  <TableCell className="text-right">
                    {/* ✅ Вот ключевое исправление */}
                    <TenderCategoryActions
                      categoryTitle={c.title}
                      onEdit={() => setEditingCategoryId(c.id)}
                      onDelete={() => deleteCategoryItem(c.id)} // Передаем функцию, которая возвращает Promise
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}