import { checkAnsaettelseOverlap } from "~/utils/overlap";
import { useAnsaettelser } from "~/hooks/use-ansaettelser";

// Binder overlap-funktionen til de aktuelle ansaettelser fra store — excludeId springer den redigerede post over
export function useOverlapCheck() {
  const { ansaettelser } = useAnsaettelser();
  return {
    hasOverlap: (
      userId: string,
      startdato: string,
      slutdato: string,
      excludeId?: string
    ) => checkAnsaettelseOverlap({ userId, startdato, slutdato }, ansaettelser, excludeId),
  };
}
