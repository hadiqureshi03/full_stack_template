import { useFairplanStore } from "~/store/fairplan-store";
import type { Ansaettelse } from "~/types";

export const ansaettelseService = {
  getAll: () => useFairplanStore.getState().ansaettelser,
  add: (data: Omit<Ansaettelse, "id">) => useFairplanStore.getState().addAnsaettelse(data),
  update: (id: string, data: Partial<Omit<Ansaettelse, "id">>) => useFairplanStore.getState().updateAnsaettelse(id, data),
  delete: (id: string) => useFairplanStore.getState().deleteAnsaettelse(id),
};
