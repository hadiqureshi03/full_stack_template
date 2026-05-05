import { useFairplanStore } from "~/store/fairplan-store";
import { afsnitService } from "~/services/afsnit";

// Læser afsnit fra store og eksponerer service-handlinger samlet ét sted
export function useAfsnit() {
  const afsnit = useFairplanStore((s) => s.afsnit);
  return {
    afsnit,
    addAfsnit: afsnitService.add,
    updateAfsnit: afsnitService.update,
    deleteAfsnit: afsnitService.delete,
  };
}
