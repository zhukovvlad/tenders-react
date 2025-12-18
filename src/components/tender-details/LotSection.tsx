import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalsList } from "@/components/ProposalsList";
import { KeyParametersParser } from "@/components/tender-details/KeyParametersParser";
import type { Lot } from "@/types/tender";

interface LotSectionProps {
  lot: Lot;
}

export function LotSection({ lot }: LotSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">{lot.lot_title}</h2>
      <KeyParametersParser keyParameters={lot.key_parameters} />
      <Tabs defaultValue="proposals" className="mt-6">
        <TabsList>
          <TabsTrigger value="proposals">Предложения</TabsTrigger>
          <TabsTrigger value="comparison">Анализ</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
        </TabsList>
        <TabsContent value="proposals" className="mt-4">
          <ProposalsList lotId={lot.id} />
        </TabsContent>
        {/* ... другие вкладки ... */}
      </Tabs>
    </section>
  );
}