import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalsList } from "@/components/ProposalsList";
import { KeyParametersList } from "@/components/KeyParametersList";
import { updateLotKeyParameters } from "@/api/lots";
import type { Lot } from "@/types/tender";

interface LotSectionProps {
  lot: Lot;
}

export function LotSection({ lot }: LotSectionProps) {
  const handleKeyParamsChange = async (updatedParams: Record<string, string>) => {
    try {
      await updateLotKeyParameters(lot.id, updatedParams);
      console.log(`✅ Ключевые параметры для лота ${lot.id} успешно обновлены.`);
    } catch (err) {
      console.error(`❌ Ошибка при обновлении ключевых параметров для лота ${lot.id}.`, err);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">{lot.lot_title}</h2>
      <KeyParametersList
        parameters={lot.key_parameters ?? {}}
        onChange={handleKeyParamsChange}
      />
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