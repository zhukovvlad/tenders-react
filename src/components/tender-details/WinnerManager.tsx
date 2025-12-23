import { useState } from "react";
import type { Lot, Winner } from "@/types/tender";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Medal,
  PlusCircle,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { WinnerAPI } from "@/api/winners";
import { AddWinnerDialog } from "./AddWinnerDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface WinnerManagerProps {
  lot: Lot;
  onUpdate: () => void; // Коллбек для обновления данных страницы
}

export function WinnerManager({ lot, onUpdate }: WinnerManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (winnerId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого победителя?")) return;
    try {
      await WinnerAPI.delete(winnerId);
      toast.success("Победитель удален");
      onUpdate();
    } catch (e) {
      toast.error("Ошибка при удалении");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Trophy className="h-4 w-4" /> Результаты торгов
        </h4>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Добавить
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {lot.winners && lot.winners.length > 0 ? (
          lot.winners.map((winner) => (
            <WinnerCard
              key={winner.id}
              winner={winner}
              onDelete={() => handleDelete(winner.id)}
            />
          ))
        ) : (
          <div className="text-sm text-muted-foreground italic pl-1">
            Победители еще не определены
          </div>
        )}
      </div>

      {/* Диалог создания */}
      <AddWinnerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        lotId={lot.id}
        onSuccess={onUpdate}
      />
    </div>
  );
}

// Вспомогательный компонент карточки
function WinnerCard({ winner, onDelete }: { winner: Winner; onDelete: () => void }) {
  const isFirst = winner.rank === 1;
  const isSecond = winner.rank === 2;

  // Определяем стили в зависимости от места
  const cardStyle = isFirst
    ? "bg-green-50 border-2 border-green-400 dark:bg-green-900/20 dark:border-green-600"
    : isSecond
    ? "bg-amber-50 border-2 border-amber-400 dark:bg-amber-900/20 dark:border-amber-600"
    : "bg-gray-50 border dark:bg-gray-800/40";

  const iconStyle = isFirst
    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
    : isSecond
    ? "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-300"
    : "bg-gray-200 text-gray-500 dark:bg-gray-700";

  const badgeVariant = isFirst ? "default" : "secondary";

  return (
    <Card className={`relative overflow-hidden transition-colors ${cardStyle}`}>
      <CardContent className="p-3 flex items-center gap-4">
        {/* Иконка места */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconStyle}`}>
          {isFirst ? <Trophy className="h-5 w-5" /> : <Medal className="h-5 w-5" />}
        </div>

        {/* Инфо */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant} className="h-5 px-1.5">
              #{winner.rank}
            </Badge>
            <span className="font-semibold truncate">{winner.contractor_name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{winner.price} ₽</span>
            {winner.inn && <span className="text-xs">ИНН: {winner.inn}</span>}
          </div>
        </div>

        {/* Меню действий (удаление/редактирование) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
