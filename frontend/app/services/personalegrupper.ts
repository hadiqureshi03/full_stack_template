import { useFairplanStore } from "~/store/fairplan-store";
import type { Personalegruppe } from "~/types";

export const personalegruppeService = {
  getAll: () => useFairplanStore.getState().personalegrupper,
  add: (data: Omit<Personalegruppe, "id">) => useFairplanStore.getState().addPersonalegruppe(data),
  update: (id: string, data: Partial<Omit<Personalegruppe, "id">>) => useFairplanStore.getState().updatePersonalegruppe(id, data),
  delete: (id: string) => useFairplanStore.getState().deletePersonalegruppe(id),
};
