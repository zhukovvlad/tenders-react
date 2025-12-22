// src/pages/TenderListPage.tsx

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { apiFetch } from "@/api/fetchClient";

interface Tender {
  id: number;
  etp_id: string;
  title: string;
  data_prepared_on_date: string;
  object_address: string;
  executor_name: string;
  proposals_count: number;
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.TENDERS));
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }
        const data: Tender[] = await response.json();
        setTenders(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Произошла неизвестная ошибка"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  if (loading) return <div>Загрузка списка тендеров...</div>;
  if (error) return <div className="text-destructive">Ошибка: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Список тендеров</h1>
      </div>
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%] px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">
                ID площадки
              </TableHead>
              <TableHead className="w-[40%] px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">
                Наименование
              </TableHead>
              <TableHead className="w-[25%] px-4 py-2 text-left text-sm font-medium uppercase tracking-wider">
                Адрес объекта
              </TableHead>
              <TableHead className="w-[10%] px-4 py-2 text-center text-sm font-medium uppercase tracking-wider">
                Предложений
              </TableHead>
              <TableHead className="w-[10%] px-4 py-2 text-right text-sm font-medium uppercase tracking-wider">
                Дата
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenders.length > 0 ? (
              tenders.map((tender) => (
                <TableRow
                  key={tender.id}
                  className="transition-colors duration-150"
                >
                  <TableCell className="px-4 py-2 font-medium whitespace-normal break-words max-w-xs">
                    {tender.etp_id}
                  </TableCell>

                  <TableCell className="px-4 py-2 whitespace-normal break-words max-w-md">
                    <Link
                      to={`/tenders/${tender.id}`}
                      className="font-medium hover:underline focus:outline-none"
                    >
                      {tender.title}
                    </Link>
                  </TableCell>

                  <TableCell
                    className="px-4 py-2 text-gray-500 whitespace-normal break-words max-w-xs"
                    title={tender.object_address}
                  >
                    {tender.object_address || "–"}
                  </TableCell>

                  <TableCell className="px-4 py-2 text-center text-gray-700">
                    <Badge
                      variant="secondary"
                      className="inline-block px-2 py-1 text-xs rounded-md"
                    >
                      {tender.proposals_count}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-2 text-right text-gray-500">
                    {tender.data_prepared_on_date
                      ? new Date(
                          tender.data_prepared_on_date
                        ).toLocaleDateString()
                      : "–"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-6 h-24 text-center text-gray-500"
                >
                  Тендеры не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
