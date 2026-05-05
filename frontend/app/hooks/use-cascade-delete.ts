import { useUsers } from "~/hooks/use-users";

// Wrapper der navngiver sletning tydeligt — fremtidigt sted for evt. kaskade-logik mod ansaettelser
export function useCascadeDelete() {
  const { deleteUser } = useUsers();
  return {
    deleteBrugerMedAnsaettelser: deleteUser,
  };
}
