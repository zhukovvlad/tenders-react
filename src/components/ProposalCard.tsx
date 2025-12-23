// src/components/ProposalCard.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Award, Calendar, MoreVertical, Pencil, Percent, Trash2 } from "lucide-react";
import { UI_TEXT } from "@/constants/messages";

// Интерфейс для данных одного предложения
export interface Proposal {
  proposal_id: number;
  contractor_id: number;
  contractor_title: string;
  contractor_inn: string;
  is_winner: boolean;
  winner_rank?: number;
  total_cost: number | null;
  additional_info: Record<string, string | null> | null;
}

interface ProposalCardProps {
  proposal: Proposal;
  // Функции для Update/Delete пока опциональны
  onUpdate?: (proposalId: number, newTitle: string) => Promise<void>;
  onDelete?: (proposalId: number) => Promise<void>;
}

// Вспомогательные функции
const formatCurrency = (value: number | null) => {
  if (value == null) return UI_TEXT.NOT_AVAILABLE;
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 2 }).format(value);
};

const findValueByKeyPrefix = (data: Record<string, string | null> | null, prefix: string): string | null => {
  if (!data) return null;
  const lowerCasePrefix = prefix.toLowerCase();
  const key = Object.keys(data).find(k => k.trim().toLowerCase().startsWith(lowerCasePrefix));
  return key ? data[key] : null;
};

const displayNullableValue = (value: string | null, suffix = "") => {
  if (value == null || value === "") return UI_TEXT.NOT_AVAILABLE;
  return `${value}${suffix}`;
};

export function ProposalCard({ proposal }: ProposalCardProps) {
  const advancePayment = findValueByKeyPrefix(proposal.additional_info, 'Аванс');
  const completionTime = findValueByKeyPrefix(proposal.additional_info, 'Срок выполнения');

  const isFirstPlace = proposal.is_winner && proposal.winner_rank === 1;
  const isSecondPlace = proposal.is_winner && proposal.winner_rank === 2;

  const cardBorderStyle = isFirstPlace
    ? 'border-green-500 border-2'
    : isSecondPlace
    ? 'border-amber-500 border-2'
    : proposal.is_winner
    ? 'border-gray-400 border-2'
    : '';

  return (
    <Card className={`w-full flex flex-col ${cardBorderStyle}`}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          {proposal.is_winner && (
            <Badge 
              variant="secondary" 
              className={`w-fit mb-2 ${
                isFirstPlace
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : isSecondPlace
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
            >
              <Award className="mr-2 h-4 w-4" /> Победитель
            </Badge>
          )}
          <CardTitle>{proposal.contractor_title}</CardTitle>
          <CardDescription>ИНН: {proposal.contractor_inn}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer" onClick={() => alert(`${UI_TEXT.DEVELOPMENT}: Редактирование`)}>
              <Pencil className="mr-2 h-4 w-4" /> Редактировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => alert(`${UI_TEXT.DEVELOPMENT}: Удаление`)}>
              <Trash2 className="mr-2 h-4 w-4" /> Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground">Итого с НДС</span>
            <span className="text-2xl font-bold">{formatCurrency(proposal.total_cost)}</span>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span>Аванс: <strong>{displayNullableValue(advancePayment)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Сроки, мес.: <strong>{displayNullableValue(completionTime)}</strong></span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Смотреть детализацию</Button>
      </CardFooter>
    </Card>
  );
}