import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Пропсы, которые принимает наш компонент
interface TenderCategoryActionsProps {
  categoryTitle: string;
  onEdit: () => void; // Функция, которая вызывается при клике на "Редактировать"
  onDelete: () => Promise<void>; // Функция для удаления
}

export function TenderCategoryActions({
  categoryTitle,
  onEdit,
  onDelete,
}: TenderCategoryActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete();
      // Успешное удаление закроет диалог, так как isDeleting останется false
    } catch (error) {
      // Здесь можно обработать ошибку, например, показать toast
      console.error("Ошибка при удалении:", error);
    } finally {
      // Этот блок выполнится в любом случае: и при успехе, и при ошибке
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Открыть меню</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Действия</DropdownMenuLabel>
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Редактировать</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => setIsDeleting(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Удалить</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Вы уверены, что хотите удалить категорию?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Это действие невозможно отменить. Категория "{categoryTitle}"
              будет удалена навсегда. Тендеры, ссылающиеся на эту категорию,
              потеряют ее (будет установлено в NULL).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Да, удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
