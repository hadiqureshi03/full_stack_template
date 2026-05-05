import { useFairplanStore } from "~/store/fairplan-store";
import { userService } from "~/services/users";

// Læser brugere fra store og eksponerer service-handlinger samlet ét sted
export function useUsers() {
  const users = useFairplanStore((s) => s.users);
  return {
    users,
    addUser: userService.add,
    updateUser: userService.update,
    deleteUser: userService.delete,
  };
}
