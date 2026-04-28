import { useFairplanStore } from "~/store/fairplan-store";
import type { User } from "~/types";

export const userService = {
  getAll: () => useFairplanStore.getState().users,
  add: (data: Omit<User, "id">) => useFairplanStore.getState().addUser(data),
  update: (id: string, data: Partial<Omit<User, "id">>) => useFairplanStore.getState().updateUser(id, data),
  delete: (id: string) => useFairplanStore.getState().deleteUser(id),
};
