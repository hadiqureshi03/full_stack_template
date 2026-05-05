import { useFairplanStore } from "~/store/fairplan-store";
import { personalegruppeService } from "~/services/personalegrupper";

// Læser personalegrupper fra store og eksponerer service-handlinger samlet ét sted
export function usePersonalegrupper() {
  const personalegrupper = useFairplanStore((s) => s.personalegrupper);
  return {
    personalegrupper,
    addPersonalegruppe: personalegruppeService.add,
    updatePersonalegruppe: personalegruppeService.update,
    deletePersonalegruppe: personalegruppeService.delete,
  };
}
