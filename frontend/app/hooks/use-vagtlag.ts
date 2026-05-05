import { useFairplanStore } from "~/store/fairplan-store";
import { vagtlagService } from "~/services/vagtlag";

// Læser vagtlag fra store og eksponerer service-handlinger samlet ét sted
export function useVagtlag() {
  const vagtlag = useFairplanStore((s) => s.vagtlag);
  return {
    vagtlag,
    addVagtlag: vagtlagService.add,
    updateVagtlag: vagtlagService.update,
    deleteVagtlag: vagtlagService.delete,
  };
}
