export type SearchParams = { [key: string]: string | string[] | undefined };

/** Normalize a search param that may arrive as a repeated key (string[]). */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Parse a 1-based page param, clamped to a minimum of 1. */
export function pageParam(value: string | string[] | undefined): number {
  return Math.max(1, Number(firstParam(value)) || 1);
}
