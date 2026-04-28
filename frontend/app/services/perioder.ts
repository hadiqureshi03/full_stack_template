import { useFairplanStore } from "~/store/fairplan-store";
import type { Periode } from "~/types";

export const periodeService = {
  getAll: () => useFairplanStore.getState().perioder,
  add: (data: Omit<Periode, "id">) => useFairplanStore.getState().addPeriode(data),
  update: (id: string, data: Partial<Omit<Periode, "id">>) => useFairplanStore.getState().updatePeriode(id, data),
  delete: (id: string) => useFairplanStore.getState().deletePeriode(id),
};
