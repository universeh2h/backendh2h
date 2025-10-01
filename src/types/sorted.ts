export type SortDirection = "asc" | "desc" | null;
export type SortField = "trx" | "laba" | "indosat" | "telkomsel" | "xl" | "axis" | "three" | "game" | "other";

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}