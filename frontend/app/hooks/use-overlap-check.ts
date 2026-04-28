import { checkAnsaettelseOverlap } from "~/utils/overlap";
import { useAnsaettelser } from "~/hooks/use-ansaettelser";

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
