import { useUsers } from "~/hooks/use-users";

export function useCascadeDelete() {
  const { deleteUser } = useUsers();
  return {
    deleteBrugerMedAnsaettelser: deleteUser,
  };
}
