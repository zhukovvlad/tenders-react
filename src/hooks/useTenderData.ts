import { useState, useEffect, useCallback } from "react";
import { fetchTenderById } from "@/api/tenders";
import type { TenderPageData } from "@/types/tender";

export function useTenderData(id: string) {
  const [pageData, setPageData] = useState<TenderPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenderPageData = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchTenderById(id);
      setPageData(data);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Произошла неизвестная ошибка";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTenderPageData();
  }, [fetchTenderPageData]);

  return { pageData, loading, error, fetchTenderPageData };
}
