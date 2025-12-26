// frontend/src/types/proposal.ts

// Nullable field structure from Go backend
interface NullableString {
  String: string;
  Valid: boolean;
}

export interface ProposalMeta {
  id: number;
  contractor_name: string;
  contractor_inn: string;
  tender_title: string;
  lot_title: string;
  is_baseline: boolean;
}

export interface ProposalSummary {
  id: number;
  proposal_id: number;
  summary_key: string;
  job_title: string;
  materials_cost: NullableString;
  works_cost: NullableString;
  indirect_costs_cost: NullableString;
  total_cost: NullableString;
  created_at: string;
  updated_at: string;
}

export interface ProposalPosition {
  id: number;
  number: string | null;
  chapter_number_in_proposal?: string | null;
  title: string;
  is_chapter: boolean;
  unit?: string;
  quantity?: string;
  price_total?: string;
  cost_total?: string;
  cost_materials?: string;
  cost_works?: string;
  comment_contractor?: string;
  catalog_name?: string;
}

export interface ProposalFullDetails {
  meta: ProposalMeta;
  summaries: ProposalSummary[];
  info: Record<string, string>;
  positions: ProposalPosition[];
}