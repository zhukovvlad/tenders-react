import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ProposalFullDetails } from '@/types/proposal';
import { ProposalEstimateTable } from '@/components/ProposalEstimateTable';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getProposalDetails } from '@/api/proposals';
import { ArrowLeft, Building2, FileText, Award, AlertCircle } from 'lucide-react';
import { formatNullableCurrency } from '@/utils/utils';

// Константы для итоговой суммы: ключ для backend и человеко-читаемая подпись
const SUMMARY_KEYS = {
  TOTAL_WITH_VAT: 'total_cost_with_vat',  // ключ поля в данных / backend
  TOTAL_WITH_VAT_RU: 'Итого с НДС',         // текстовая подпись для отображения
} as const;

export const ProposalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProposalFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposalDetails = async () => {
      if (!id) {
        // Этот случай не должен происходить из-за роутинга React Router
        console.error("Невалидный ID предложения");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const proposalId = parseInt(id, 10);
        if (isNaN(proposalId)) {
          setError("Некорректный ID предложения");
          return;
        }
        const proposalData = await getProposalDetails(proposalId);
        setData(proposalData);
      } catch (err) {
        const errorMessage = err instanceof Error && err.message 
          ? err.message 
          : "Произошла неизвестная ошибка";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProposalDetails();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Не удалось загрузить данные предложения"}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться назад
        </Button>
      </div>
    );
  }

  // Поиск итоговой суммы с НДС
  const totalWithVat = data.summaries.find(s => 
    s.summary_key === SUMMARY_KEYS.TOTAL_WITH_VAT || 
    s.summary_key === SUMMARY_KEYS.TOTAL_WITH_VAT_RU
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Кнопка возврата */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад
      </Button>

      {/* Шапка предложения */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              {data.meta.is_baseline && (
                <Badge variant="secondary" className="mb-2">
                  <Award className="mr-1 h-3 w-3" />
                  Базовое предложение
                </Badge>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                <span>{data.meta.tender_title}</span>
              </div>
              <CardTitle className="text-2xl mt-1 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-muted-foreground" />
                {data.meta.contractor_name}
              </CardTitle>
              <CardDescription className="mt-1">
                ИНН: {data.meta.contractor_inn}
              </CardDescription>
              <p className="text-sm font-medium mt-2">
                Лот: {data.meta.lot_title}
              </p>
            </div>
            
            {/* Общая сумма */}
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Итого по смете:</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {totalWithVat ? formatNullableCurrency(totalWithVat.total_cost) : "—"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Таблица с позициями сметы */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Смета предложения</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ProposalEstimateTable 
            positions={data.positions} 
            lotTitle={data.meta.lot_title}
          />
        </CardContent>
      </Card>
      
      {/* Итоговые показатели и дополнительная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Итоговые показатели */}
        {data.summaries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Итоговые показатели</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.summaries.map((summary, idx) => {
                  const hasMaterials = summary.materials_cost?.Valid;
                  const hasWorks = summary.works_cost?.Valid;
                  const showDetails = hasMaterials || hasWorks;
                  
                  return (
                    <div key={summary.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">
                          {summary.job_title || summary.summary_key}
                        </span>
                        <span className="text-sm font-semibold">
                          {formatNullableCurrency(summary.total_cost)}
                        </span>
                      </div>
                      {showDetails && (
                        <div className="ml-4 mt-1 space-y-1 text-xs text-muted-foreground">
                          {hasMaterials && (
                            <div className="flex justify-between">
                              <span>• Материалы:</span>
                              <span>{formatNullableCurrency(summary.materials_cost)}</span>
                            </div>
                          )}
                          {hasWorks && (
                            <div className="flex justify-between">
                              <span>• Работы:</span>
                              <span>{formatNullableCurrency(summary.works_cost)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {idx < data.summaries.length - 1 && <Separator className="mt-2" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Дополнительная информация */}
        {Object.keys(data.info).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Условия и параметры</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.info).map(([key, val], idx) => (
                  <div key={key}>
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-sm text-muted-foreground">{key}:</span>
                      <span className="text-sm font-medium text-right">{val || "—"}</span>
                    </div>
                    {idx < Object.keys(data.info).length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};