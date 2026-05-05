import { useFairplanStore } from "~/store/fairplan-store";
import { periodeService } from "~/services/perioder";

// Læser perioder fra store og eksponerer service-handlinger samlet ét sted
export function usePerioder() {
  const perioder = useFairplanStore((s) => s.perioder);
  return {
    perioder,
    addPeriode: periodeService.add,
    updatePeriode: periodeService.update,
    deletePeriode: periodeService.delete,
  };
}
