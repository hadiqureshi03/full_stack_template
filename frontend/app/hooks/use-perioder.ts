import { useFairplanStore } from "~/store/fairplan-store";
import { periodeService } from "~/services/perioder";

export function usePerioder() {
  const perioder = useFairplanStore((s) => s.perioder);
  return {
    perioder,
    addPeriode: periodeService.add,
    updatePeriode: periodeService.update,
    deletePeriode: periodeService.delete,
  };
}
