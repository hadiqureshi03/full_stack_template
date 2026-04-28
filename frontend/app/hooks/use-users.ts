import { useFairplanStore } from "~/store/fairplan-store";
import { userService } from "~/services/users";

export function useUsers() {
  const users = useFairplanStore((s) => s.users);
  return {
    users,
    addUser: userService.add,
    updateUser: userService.update,
    deleteUser: userService.delete,
  };
}
