import { useState } from "react";
import type { Personalegruppe } from "~/types";
import { usePersonalegrupper } from "~/hooks/use-personalegrupper";
import { useAnsaettelser } from "~/hooks/use-ansaettelser";
import { useToast } from "~/contexts/toast-context";
import { validateRequired } from "~/utils/validation";
import { PageHeader } from "~/components/ui/page-header";
import { DataTable } from "~/components/ui/data-table";
import type { Column } from "~/components/ui/data-table";
import { FormModal } from "~/components/ui/form-modal";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { ErrorBanner } from "~/components/ui/error-banner";
import { Input } from "~/components/ui/input";

type FormState = { navn: string };
type FormErrors = Partial<FormState>;

const emptyForm: FormState = { navn: "" };

export default function Personalegrupper() {
  const { personalegrupper, addPersonalegruppe, updatePersonalegruppe, deletePersonalegruppe } = usePersonalegrupper();
  const { ansaettelser } = useAnsaettelser();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Personalegruppe | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Personalegruppe | null>(null);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(pg: Personalegruppe) {
    setEditingItem(pg);
    setForm({ navn: pg.navn });
    setErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const navnError = validateRequired(form.navn, "Navn");
    if (navnError) newErrors.navn = navnError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    if (editingItem) {
      updatePersonalegruppe(editingItem.id, form);
      toast("Personalegruppe opdateret");
    } else {
      addPersonalegruppe(form);
      toast("Personalegruppe oprettet");
    }
    setModalOpen(false);
  }

  function handleDeleteRequest(pg: Personalegruppe) {
    const inUse = ansaettelser.some((a) => a.personalegruppeId === pg.id);
    if (inUse) {
      setBlockError(`"${pg.navn}" kan ikke slettes — den bruges i en eller flere ansættelser.`);
      return;
    }
    setBlockError(null);
    setDeleteTarget(pg);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deletePersonalegruppe(deleteTarget.id);
    toast("Personalegruppe slettet");
    setDeleteTarget(null);
  }

  const columns: Column<Personalegruppe>[] = [
    { key: "navn", header: "Navn", sortable: true },
  ];

  return (
    <>
      <PageHeader title="Personalegrupper" onAdd={openCreate} addLabel="Tilføj personalegruppe" />

      {blockError && (
        <div className="mb-4">
          <ErrorBanner message={blockError} onDismiss={() => setBlockError(null)} />
        </div>
      )}

      <DataTable
        data={personalegrupper}
        columns={columns}
        getKey={(pg) => pg.id}
        onEdit={openEdit}
        onDelete={handleDeleteRequest}
        emptyText="Ingen personalegrupper endnu"
        isLoading={false}
      />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingItem ? "Rediger personalegruppe" : "Tilføj personalegruppe"}
        onSubmit={handleSubmit}
      >
        <Input
          label="Navn"
          required
          value={form.navn}
          onChange={(e) => setForm((f) => ({ ...f, navn: e.target.value }))}
          error={errors.navn}
          placeholder="F.eks. Overlæger"
        />
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Slet ${deleteTarget?.navn ?? "personalegruppe"}?`}
        description="Denne handling kan ikke fortrydes."
        confirmLabel="Slet"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}
