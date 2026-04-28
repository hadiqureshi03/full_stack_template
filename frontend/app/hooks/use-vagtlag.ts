import { useFairplanStore } from "~/store/fairplan-store";
import { vagtlagService } from "~/services/vagtlag";

export function useVagtlag() {
  const vagtlag = useFairplanStore((s) => s.vagtlag);
  return {
    vagtlag,
    addVagtlag: vagtlagService.add,
    updateVagtlag: vagtlagService.update,
    deleteVagtlag: vagtlagService.delete,
  };
}
