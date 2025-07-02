import { useCallback, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, Home, ChevronRight } from "lucide-react";
import { ProposalsList } from "@/components/ProposalsList";
import { Separator } from "@/components/ui/separator";

import { TenderCategoryManager } from "@/components/tender-details/TenderCategoryManager";
import type { TenderPageData } from "@/types/tender";
import { fetchTenderById } from "@/api/tenders";
import { Skeleton } from "@/components/ui/skeleton";
import { displayNullableString } from "@/utils/utils";
import { KeyParametersList } from "@/components/KeyParametersList";
import { updateLotKeyParameters } from "@/api/lots";

export function TenderDetailPage() {
  // Получаем `id` тендера из URL с помощью хука useParams
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="p-10 text-center text-destructive">
        ID тендера не задан.
      </div>
    );
  }

  const [pageData, setPageData] = useState<TenderPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Используем useCallback, чтобы безопасно передать эту функцию в дочерний компонент
  const fetchTenderPageData = useCallback(async () => {
    // Не устанавливаем здесь setLoading, чтобы страница не "моргала" при обновлении категории
    setError(null);
    try {
      const data: TenderPageData = await fetchTenderById(id!);
      setPageData(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Произошла неизвестная ошибка");
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchTenderPageData().finally(() => setLoading(false));
  }, [fetchTenderPageData]);

  // Отображение состояний загрузки и ошибок
  if (loading) {
    return (
      <div className="p-10">
        <Skeleton className="h-10 w-[200px] mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-destructive">
        <h1>Ошибка</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!pageData || !pageData.details) {
    return <div className="p-10 text-center">Нет данных для отображения.</div>;
  }

  const { details: tender, lots } = pageData;

  // Формируем "хлебные крошки" из иерархии категорий
  const breadcrumbItems = [
    { title: displayNullableString(tender.type_title), path: "/tender-types" },
    { title: displayNullableString(tender.chapter_title), path: "#" }, // Заглушка для будущей страницы глав
    { title: displayNullableString(tender.category_title), path: "#" },
  ].filter((crumb) => crumb.title !== "–"); // Убираем пустые крошки

  return (
    <div className="flex flex-col gap-4">
      {/* --- Блок заголовка --- */}
      <div>
        <nav className="flex items-center text-sm font-medium text-muted-foreground mb-2">
          <NavLink to="/tenders" className="hover:text-primary">
            Тендеры
          </NavLink>
          {breadcrumbItems.map((crumb, index) => (
            <span key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4" />
              <NavLink
                to={crumb.path}
                className={
                  crumb.path === "#"
                    ? "text-foreground cursor-default"
                    : "hover:text-primary"
                }
              >
                {crumb.title}
              </NavLink>
            </span>
          ))}
        </nav>

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">{tender.title}</h1>
          <Badge variant="secondary">ID: {tender.etp_id}</Badge>
        </div>
      </div>

      {/* --- Блок ключевой информации --- */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div
          className="flex items-center gap-2"
          title={displayNullableString(tender.object_address)}
        >
          <Home className="h-4 w-4" />
          <span>Объект: {displayNullableString(tender.object_title)}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>
            Исполнитель: {displayNullableString(tender.executor_name)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            Дата документа:{" "}
            {tender.data_prepared_on_date.Valid
              ? new Date(tender.data_prepared_on_date.Time).toLocaleDateString(
                  "ru-RU"
                )
              : "–"}
          </span>
        </div>
      </div>

      {/* --- Управление категорией тендера --- */}
      <div className="mt-2">
        <TenderCategoryManager tender={tender} onUpdate={fetchTenderPageData} />
      </div>

      {/* --- Вкладки с основной информацией --- */}
      <Tabs defaultValue="proposals" className="mt-4">
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="proposals">
            Предложения участников
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="comparison">
            Сравнительный анализ
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="documents">
            Документация
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="mt-4">
          <div className="flex flex-col gap-8">
            {" "}
            {/* Общий контейнер для всех лотов */}
            {lots.length > 0 ? (
              lots.map((lot, index) => (
                <section key={lot.id}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {lot.lot_title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Предложения, поданные в рамках этого лота.
                    </p>
                    {index < lots.length - 1 && <Separator className="mt-4" />}
                  </div>
                  <KeyParametersList
                    parameters={lot.key_parameters ?? {}}
                    onChange={async (updated) => {
                      try {
                        await updateLotKeyParameters(lot.id, updated);
                        console.log(
                          "✅ Обновление ключевых параметров успешно"
                        );
                      } catch (err) {
                        console.error(
                          "❌ Ошибка при обновлении ключевых параметров",
                          err
                        );
                      }
                    }}
                  />

                  {/* Для каждого лота рендерим свой список предложений */}
                  <ProposalsList lotId={lot.id} />
                </section>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-center">
                <h3 className="font-semibold">В этом тендере нет лотов.</h3>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          <div className="rounded-lg border p-6 text-center">
            <h3 className="font-semibold">
              Здесь будет дашборд "Финансовый анализ и риски".
            </h3>
          </div>
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <div className="rounded-lg border p-6 text-center">
            <h3 className="font-semibold">
              Здесь будет список прикрепленных документов.
            </h3>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
