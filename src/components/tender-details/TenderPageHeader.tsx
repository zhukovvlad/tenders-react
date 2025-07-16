import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { TenderDetails } from "@/types/tender";
import { displayNullableString } from "@/utils/utils";

interface TenderPageHeaderProps {
  tender: TenderDetails;
}

export function TenderPageHeader({ tender }: TenderPageHeaderProps) {
  const breadcrumbItems = [
    { title: displayNullableString(tender.type_title), path: "/tender-types" },
    { title: displayNullableString(tender.chapter_title), path: "#" },
    { title: displayNullableString(tender.category_title), path: "#" },
  ].filter((crumb) => crumb.title !== "–");

  return (
    <div>
      <nav className="flex items-center text-sm font-medium text-muted-foreground mb-2">
        <NavLink to="/tenders" className="hover:text-primary">
          Тендеры
        </NavLink>
        {breadcrumbItems.map((crumb, index) => (
          <span key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4" />
            <NavLink to={crumb.path} className={crumb.path === "#" ? "text-foreground cursor-default" : "hover:text-primary"}>
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
  );
}