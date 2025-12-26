import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import type { ProposalPosition } from "@/types/proposal";
import { formatDecimal } from "@/utils/utils";

interface Props {
  positions: ProposalPosition[];
  lotTitle?: string;
}

export const ProposalEstimateTable: React.FC<Props> = ({ positions, lotTitle }) => {
  const filteredPositions = positions.filter(
    item => !lotTitle || item.title.trim() !== lotTitle.trim()
  );

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-background shadow-sm">
      <Table className="table-fixed w-full text-sm">
        <TableHeader>
          <TableRow className="bg-muted/40 border-b border-border">
            <TableHead className="w-[40px] px-2 py-3 text-muted-foreground text-[11px]">№</TableHead>
            <TableHead className="px-2 py-3 text-muted-foreground text-[11px]">Наименование работ</TableHead>
            <TableHead className="w-[60px] px-2 py-3 text-center text-muted-foreground text-[11px] whitespace-nowrap hidden sm:table-cell">Ед.</TableHead>
            <TableHead className="w-[80px] px-2 py-3 text-right text-muted-foreground text-[11px] whitespace-nowrap hidden sm:table-cell">Кол-во</TableHead>
            <TableHead className="w-[100px] px-2 py-3 text-right text-muted-foreground text-[11px] whitespace-nowrap hidden md:table-cell">Цена</TableHead>
            <TableHead className="w-[110px] px-4 py-3 text-right font-bold text-foreground text-[11px] whitespace-nowrap">Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPositions.map((item) => {
            if (item.is_chapter) {
              return (
                <TableRow key={item.id} className="bg-secondary/30 border-b border-border/50">
                  <TableCell className="px-2 py-3 font-bold text-foreground align-top text-xs">
                    {item.chapter_number_in_proposal || item.number}
                  </TableCell>
                  <TableCell colSpan={4} className="px-2 py-3 font-bold text-foreground align-middle text-sm break-words whitespace-normal">
                    {item.title}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right font-bold text-foreground align-middle text-sm whitespace-nowrap tabular-nums">
                    {formatDecimal(item.cost_total)}
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 transition-colors">
                <TableCell className="px-2 py-3 text-muted-foreground align-top font-mono text-[10px]">
                  {item.number}
                </TableCell>
                
                <TableCell className="px-2 py-3 align-top">
                  <div className="flex flex-col gap-1.5 min-w-0 w-full max-w-full">
                    
                    {/* Используем обычный block (не flex) для текста, чтобы он обтекал бейдж */}
                    <div className="text-xs leading-snug break-words whitespace-normal font-medium text-foreground">
                      {item.title}
                      
                      {/* Бейдж теперь inline-элемент, он будет "прилипать" к концу текста */}
                      {item.catalog_name && (
                        <Badge variant="outline" className="ml-1.5 inline-flex align-middle text-[9px] px-1 py-0 h-4 font-normal text-muted-foreground border-border whitespace-nowrap translate-y-[-1px]">
                          Каталог
                        </Badge>
                      )}
                    </div>

                    <div className="sm:hidden text-[10px] text-muted-foreground flex gap-2">
                         <span>{item.quantity} {item.unit}</span>
                         <span className="opacity-50">|</span>
                         <span>{formatDecimal(item.cost_total)} ₽</span>
                    </div>

                    {item.comment_contractor && (
                      <div className="flex gap-2 items-start mt-1 p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-500 max-w-full">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80" />
                        <span className="text-[11px] leading-snug break-words whitespace-normal">
                           <span className="font-semibold opacity-80 mr-1">Прим:</span>
                           {item.comment_contractor}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="px-2 py-3 text-center text-xs text-muted-foreground align-top hidden sm:table-cell">
                  {item.unit || "—"}
                </TableCell>
                <TableCell className="px-2 py-3 text-right text-xs text-foreground align-top tabular-nums hidden sm:table-cell">
                  {item.quantity}
                </TableCell>
                <TableCell className="px-2 py-3 text-right text-xs text-muted-foreground align-top tabular-nums whitespace-nowrap hidden md:table-cell">
                  {formatDecimal(item.price_total)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-xs font-bold text-foreground align-top tabular-nums whitespace-nowrap">
                  {formatDecimal(item.cost_total)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};