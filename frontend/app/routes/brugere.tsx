import { useState } from "react";
import type { User } from "~/types";
import { useUsers } from "~/hooks/use-users";
import { useToast } from "~/contexts/toast-context";
import { validateRequired, validateEmail } from "~/utils/validation";
import { PageHeader } from "~/components/ui/page-header";
import { DataTable } from "~/components/ui/data-table";
import type { Column } from "~/components/ui/data-table";
import { FormModal } from "~/components/ui/form-modal";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";

type FormState = {
  navn: string;
  email: string;
  rolleAdmin: boolean;
  rollePersonale: boolean;
};

type FormErrors = Partial<Pick<FormState, "navn" | "email">>;

const emptyForm: FormState = {
  navn: "",
  email: "",
  rolleAdmin: false,
  rollePersonale: false,
};

export default function Brugere() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(user: User) {
    setEditingItem(user);
    setForm({
      navn: user.navn,
      email: user.email,
      rolleAdmin: user.rolleAdmin,
      rollePersonale: user.rollePersonale,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const navnError = validateRequired(form.navn, "Navn");
    if (navnError) newErrors.navn = navnError;
    const emailError = validateEmail(form.email, users, editingItem?.id);
    if (emailError) newErrors.email = emailError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    if (editingItem) {
      updateUser(editingItem.id, form);
      toast("Bruger opdateret");
    } else {
      addUser(form);
      toast("Bruger oprettet");
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    toast("Bruger slettet");
    setDeleteTarget(null);
  }

  const columns: Column<User>[] = [
    { key: "navn", header: "Navn", sortable: true },
    { key: "email", header: "Email", sortable: true },
    {
      key: "rolleAdmin",
      header: "Admin",
      render: (u) => (u.rolleAdmin ? "Ja" : "Nej"),
    },
    {
      key: "rollePersonale",
      header: "Personale",
      render: (u) => (u.rollePersonale ? "Ja" : "Nej"),
    },
  ];

  return (
    <>
      <PageHeader title="Adgangsstyring" onAdd={openCreate} addLabel="Tilføj bruger" />

      <DataTable
        data={users}
        columns={columns}
        getKey={(u) => u.id}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyText="Ingen brugere endnu"
        isLoading={false}
      />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingItem ? "Rediger bruger" : "Tilføj bruger"}
        onSubmit={handleSubmit}
      >
        <Input
          label="Navn"
          required
          value={form.navn}
          onChange={(e) => setForm((f) => ({ ...f, navn: e.target.value }))}
          error={errors.navn}
          placeholder="F.eks. Anna Nielsen"
        />
        <Input
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
          placeholder="anna@hospital.dk"
        />
        <div className="flex flex-col gap-3 pt-1">
          <Checkbox
            label="Administrator"
            checked={form.rolleAdmin}
            onCheckedChange={(checked) =>
              setForm((f) => ({ ...f, rolleAdmin: checked === true }))
            }
          />
          <Checkbox
            label="Personale"
            checked={form.rollePersonale}
            onCheckedChange={(checked) =>
              setForm((f) => ({ ...f, rollePersonale: checked === true }))
            }
          />
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Slet ${deleteTarget?.navn ?? "bruger"}?`}
        description="Denne handling sletter også alle tilknyttede ansættelser."
        confirmLabel="Slet"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}
