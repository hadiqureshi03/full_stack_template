import type { Ansaettelse } from "~/types";

type OverlapInput = Pick<Ansaettelse, "userId" | "startdato" | "slutdato">;

export function checkAnsaettelseOverlap(
  input: OverlapInput,
  allAnsaettelser: Ansaettelse[],
  excludeId?: string
): boolean {
  return allAnsaettelser.some((a) => {
    if (a.id === excludeId) return false;
    if (a.userId !== input.userId) return false;
    return a.startdato <= input.slutdato && input.startdato <= a.slutdato;
  });
}