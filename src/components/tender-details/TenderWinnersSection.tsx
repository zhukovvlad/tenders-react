import type { Lot } from "@/types/tender";
import { WinnerManager } from "./WinnerManager";

interface TenderWinnersSectionProps {
  lots: Lot[];
  onUpdate: () => void;
}

export function TenderWinnersSection({ lots, onUpdate }: TenderWinnersSectionProps) {
  if (lots.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Результаты торгов</h2>
      {lots.map((lot) => (
        <div key={lot.id} className="border rounded-lg p-4 bg-card shadow-sm">
          <div className="mb-2">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
              {lot.lot_key}
            </span>
            <h3 className="text-lg font-semibold mt-2">{lot.lot_title}</h3>
          </div>
          <WinnerManager lot={lot} onUpdate={onUpdate} />
        </div>
      ))}
    </div>
  );
}
