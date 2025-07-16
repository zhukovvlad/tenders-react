import { User, Calendar, Home } from "lucide-react";
import type { TenderDetails } from "@/types/tender";
import { displayNullableString } from "@/utils/utils";

interface TenderInfoBlockProps {
  tender: TenderDetails;
}

export function TenderInfoBlock({ tender }: TenderInfoBlockProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2" title={displayNullableString(tender.object_address)}>
        <Home className="h-4 w-4" />
        <span>Объект: {displayNullableString(tender.object_title)}</span>
      </div>
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span>Исполнитель: {displayNullableString(tender.executor_name)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span>
          Дата документа:{" "}
          {tender.data_prepared_on_date.Valid
            ? new Date(tender.data_prepared_on_date.Time).toLocaleDateString("ru-RU")
            : "–"}
        </span>
      </div>
    </div>
  );
}