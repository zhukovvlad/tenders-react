// src/components/ProposalsList.tsx

import { useEffect, useState } from "react";
import { ProposalCard } from "./ProposalCard";
import type { Proposal } from "@/types/tender";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { apiFetch } from "@/api/fetchClient";

export function ProposalsList({ lotId }: { lotId: number }) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lotId) {
        setLoading(false);
        return;
    };

    const fetchProposals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.LOTS, lotId)}/proposals`);
        if (!response.ok) throw new Error("Не удалось загрузить предложения для этого лота");
        const data: Proposal[] = await response.json();
        setProposals(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [lotId]);

  if (loading) return <p className="text-center p-4">Загрузка предложений...</p>;
  if (error) return <p className="text-destructive text-center p-4">{error}</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {proposals.length > 0 ? (
        proposals.map((proposal) => (
          // Здесь мы пока не передаем onUpdate/onDelete, т.к. не реализовали их
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            // onUpdate={handleUpdateProposal}
            // onDelete={handleDeleteProposal}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground p-4">Для этого лота пока нет предложений.</p>
      )}
    </div>
  );
}