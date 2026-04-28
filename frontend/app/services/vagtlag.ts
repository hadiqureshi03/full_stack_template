import { useFairplanStore } from "~/store/fairplan-store";
import type { Vagtlag } from "~/types";

export const vagtlagService = {
  getAll: () => useFairplanStore.getState().vagtlag,
  add: (data: Omit<Vagtlag, "id">) => useFairplanStore.getState().addVagtlag(data),
  update: (id: string, data: Partial<Omit<Vagtlag, "id">>) => useFairplanStore.getState().updateVagtlag(id, data),
  delete: (id: string) => useFairplanStore.getState().deleteVagtlag(id),
};
