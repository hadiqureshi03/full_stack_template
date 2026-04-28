import { useFairplanStore } from "~/store/fairplan-store";
import { ansaettelseService } from "~/services/ansaettelser";

export function useAnsaettelser() {
  const ansaettelser = useFairplanStore((s) => s.ansaettelser);
  return {
    ansaettelser,
    addAnsaettelse: ansaettelseService.add,
    updateAnsaettelse: ansaettelseService.update,
    deleteAnsaettelse: ansaettelseService.delete,
  };
}
