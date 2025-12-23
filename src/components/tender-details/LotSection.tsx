import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyParametersParser } from "@/components/tender-details/KeyParametersParser";
import { ProposalCard } from "@/components/ProposalCard";
import type { Lot } from "@/types/tender";

interface LotSectionProps {
  lot: Lot;
}

export function LotSection({ lot }: LotSectionProps) {
  // Create a map from proposal_id to rank from winners array
  const winnerRankMap = new Map<number, number>();
  lot.winners?.forEach((winner) => {
    if (winner.proposal_id && winner.rank) {
      winnerRankMap.set(winner.proposal_id, winner.rank);
    }
  });

  return (
    <section>
      <div className="mb-4">
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
          {lot.lot_key}
        </span>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">{lot.lot_title}</h2>
      <KeyParametersParser keyParameters={lot.key_parameters} />
      <Tabs defaultValue="proposals" className="mt-6">
        <TabsList>
          <TabsTrigger value="proposals">Предложения</TabsTrigger>
          <TabsTrigger value="comparison">Анализ</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
        </TabsList>
        <TabsContent value="proposals" className="mt-4">
          {lot.proposals && lot.proposals.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lot.proposals.map((proposal) => {
                // Get rank from winners array if this proposal is a winner
                const winnerRank = proposal.is_winner 
                  ? winnerRankMap.get(proposal.id) 
                  : undefined;
                
                // Обогащаем proposal данными о ранке победителя
                const enrichedProposal = {
                  ...proposal,
                  winner_rank: winnerRank,
                };
                
                return <ProposalCard key={proposal.id} proposal={enrichedProposal} />;
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground p-4">
              Для этого лота пока нет предложений.
            </p>
          )}
        </TabsContent>
        <TabsContent value="comparison" className="mt-4">
          <div className="text-muted-foreground p-6 text-center border rounded-lg">
            Анализ скоро будет доступен.
          </div>
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <div className="text-muted-foreground p-6 text-center border rounded-lg">
            Документы скоро будут доступны.
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}