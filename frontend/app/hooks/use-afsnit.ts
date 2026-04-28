import { useFairplanStore } from "~/store/fairplan-store";
import { afsnitService } from "~/services/afsnit";

export function useAfsnit() {
  const afsnit = useFairplanStore((s) => s.afsnit);
  return {
    afsnit,
    addAfsnit: afsnitService.add,
    updateAfsnit: afsnitService.update,
    deleteAfsnit: afsnitService.delete,
  };
}
