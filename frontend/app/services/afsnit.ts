import { useFairplanStore } from "~/store/fairplan-store";
import type { Afsnit } from "~/types";

export const afsnitService = {
  getAll: () => useFairplanStore.getState().afsnit,
  add: (data: Omit<Afsnit, "id">) => useFairplanStore.getState().addAfsnit(data),
  update: (id: string, data: Partial<Omit<Afsnit, "id">>) => useFairplanStore.getState().updateAfsnit(id, data),
  delete: (id: string) => useFairplanStore.getState().deleteAfsnit(id),
};
