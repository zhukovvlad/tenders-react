import { useState, useEffect } from "react";
import type { CreateWinnerRequest, Proposal } from "@/types/tender";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";
import { WinnerAPI } from "@/api/winners";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { apiFetch } from "@/api/fetchClient";
import { toast } from "sonner";

// Типизация сырого ответа API для предложений
interface RawProposalResponse {
  proposal_id: number;
  contractor_title: string;
  contractor_inn: string;
  total_cost: number | null;
  is_winner: boolean;
  winner_rank?: number;
  additional_info?: Record<string, string | null> | null;
}

interface AddWinnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lotId: number;
  onSuccess: () => void;
}

export function AddWinnerDialog({
  open,
  onOpenChange,
  lotId,
  onSuccess,
}: AddWinnerDialogProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");
  const [rank, setRank] = useState<string>("1");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загружаем список предложений при открытии диалога
  useEffect(() => {
    if (!open || !lotId) return;

    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch(
          `${buildApiUrl(API_CONFIG.ENDPOINTS.LOTS, lotId)}/proposals`
        );
        if (!response.ok) throw new Error("Не удалось загрузить предложения");
        const rawData: RawProposalResponse[] = await response.json();
        // Маппим proposal_id в id для совместимости с типом Proposal
        const data: Proposal[] = rawData.map(p => ({
          ...p,
          id: p.proposal_id,
          contractor_name: p.contractor_title,
        }));
        setProposals(data);
      } catch (error) {
        toast.error("Ошибка при загрузке предложений");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [open, lotId]);

  const handleSubmit = async () => {
    if (!selectedProposalId || !rank) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreateWinnerRequest = {
        proposal_id: parseInt(selectedProposalId),
        rank: parseInt(rank),
        notes: notes || undefined,
      };

      await WinnerAPI.create(lotId, data);
      toast.success("Победитель добавлен");
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error("Ошибка при добавлении победителя");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedProposalId("");
    setRank("1");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Добавить победителя</AlertDialogTitle>
          <AlertDialogDescription>
            Выберите предложение из списка участников и укажите место в рейтинге
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Выбор предложения */}
          <div className="space-y-2">
            <label htmlFor="proposal" className="text-sm font-medium">
              Предложение участника *
            </label>
            {isLoading ? (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                Загрузка предложений...
              </div>
            ) : proposals.length === 0 ? (
              <div className="text-sm text-muted-foreground italic border rounded-md p-3">
                Нет доступных предложений для этого лота
              </div>
            ) : (
              <Select
                value={selectedProposalId}
                onValueChange={setSelectedProposalId}
                disabled={isSubmitting}
              >
                <SelectTrigger id="proposal" className="w-full [&>span]:truncate [&>span]:block">
                  <SelectValue placeholder="Выберите участника" />
                </SelectTrigger>
                <SelectContent className="max-w-sm">
                  {proposals.map((proposal) => {
                    const displayText = `${proposal.contractor_name}${
                      proposal.contractor_inn ? ` (ИНН: ${proposal.contractor_inn})` : ""
                    }`;
                    return (
                      <SelectItem
                        key={proposal.id}
                        value={proposal.id.toString()}
                        title={displayText}
                      >
                          <div className="truncate max-w-[280px]">
                            {displayText}
                          </div>
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Место */}
          <div className="space-y-2">
            <label htmlFor="rank" className="text-sm font-medium">
              Место *
            </label>
            <Input
              id="rank"
              type="number"
              min="1"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="1"
              disabled={isSubmitting}
            />
          </div>

          {/* Примечания */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Примечания
            </label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Дополнительная информация (необязательно)"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isSubmitting}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              isLoading ||
              !selectedProposalId ||
              !rank ||
              proposals.length === 0
            }
          >
            {isSubmitting && (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            )}
            Добавить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
