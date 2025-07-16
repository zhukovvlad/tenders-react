export interface NullableString {
  String: string;
  Valid: boolean;
}

export interface NullableTime {
  Time: string;
  Valid: boolean;
}

export interface TenderDetails {
  id: number;
  etp_id: string;
  title: string;
  data_prepared_on_date: NullableTime;
  created_at: string;
  object_title: NullableString;
  object_address: NullableString;
  executor_name: NullableString;
  category_title: NullableString;
  chapter_title: NullableString;
  type_title: NullableString;
}

export interface Lot {
  id: number
  lot_key: string
  lot_title: string
  tender_id: number
  created_at: string
  updated_at: string
  key_parameters?: Record<string, string> // 👈 вот это важно
}

export interface TenderPageData {
  details: TenderDetails | null;
  lots: Lot[];
}

export interface TenderCategory {
  id: number;
  title: string;
  tender_chapter_id: number;
  tender_chapter_title: string;
  tender_type_id: number;
}

export interface TenderChapter {
  id: number;
  title: string;
  tender_type_id: number;
}

export interface TenderType {
  id: number;
  title: string;
}