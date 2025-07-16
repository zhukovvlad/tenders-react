// src/components/TenderTypeActions.tsx

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog"

// Определяем, какие данные и функции будет принимать наш компонент
interface TenderTypeActionsProps {
    tenderType: { id: number; title: string };
    onUpdate: (id: number, newTitle: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export function TenderTypeActions({ tenderType, onUpdate, onDelete }: TenderTypeActionsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editedTitle, setEditedTitle] = useState(tenderType.title);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async () => {
        setIsSubmitting(true);
        await onUpdate(tenderType.id, editedTitle);
        setIsSubmitting(false);
        setIsEditing(false);
    };
    
    const handleDelete = async () => {
        setIsSubmitting(true);
        await onDelete(tenderType.id);
        // isDeleting будет сброшен родительским компонентом
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} disabled={isSubmitting}/>
                <Button size="sm" onClick={handleUpdate} disabled={isSubmitting}>
                    {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {!isSubmitting && "Сохранить"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={isSubmitting}>Отмена</Button>
            </div>
        );
    }
    
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
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Редактировать</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleting(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Удалить</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Это действие невозможно отменить. Тип тендера будет удален навсегда.
                        Все связанные с ним сущности (например, тендеры этой категории) также могут быть удалены.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmitting}>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90">
                        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {!isSubmitting && "Да, удалить"}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}