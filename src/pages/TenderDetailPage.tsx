import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TenderCategoryManager } from "@/components/tender-details/TenderCategoryManager";
import { MESSAGES, UI_TEXT } from "@/constants/messages";

// Новые импорты
import { useTenderData } from "@/hooks/useTenderData";
import { TenderPageHeader } from "@/components/tender-details/TenderPageHeader";
import { TenderInfoBlock } from "@/components/tender-details/TenderInfoBlock";
import { LotSection } from "@/components/tender-details/LotSection";

const TenderPageSkeleton = () => (
  <div className="p-4">
    <Skeleton className="h-10 w-3/4 mb-4" />
    <Skeleton className="h-6 w-full mb-2" />
    <Skeleton className="h-6 w-1/2 mb-6" />
    <Skeleton className="h-96 w-full" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="p-10 text-center text-destructive">
    <h1>{MESSAGES.ERROR.LOADING_DATA}</h1>
    <p>{message}</p>
  </div>
);

export function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { pageData, loading, error, fetchTenderPageData } = useTenderData(id || '');

  if (!id) {
    return <ErrorDisplay message={MESSAGES.ERROR.TENDER_ID_MISSING} />;
  }

  if (loading) return <TenderPageSkeleton />;
  if (error) return <ErrorDisplay message={error} />;
  if (!pageData?.details) {
    return <div className="p-10 text-center">{UI_TEXT.NO_DATA}</div>;
  }

  const { details: tender, lots } = pageData;

  return (
    <div className="flex flex-col gap-4 p-4">
      <TenderPageHeader tender={tender} />
      <TenderInfoBlock tender={tender} />

      <div className="mt-2 mb-6">
        <TenderCategoryManager tender={tender} onUpdate={fetchTenderPageData} />
      </div>

      <Separator />

      <div className="flex flex-col gap-10 mt-6">
        {lots.length > 0 ? (
          lots.map((lot) => <LotSection key={lot.id} lot={lot} />)
        ) : (
          <div className="p-6 text-center border rounded-lg">
            <h3 className="font-semibold">{UI_TEXT.NO_LOTS}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
