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

// Formularens felter og en tom standardværdi
type FormState = { navn: string };
type FormErrors = Partial<FormState>;
const emptyForm: FormState = { navn: "" };

export default function Personalegrupper() {
  // Data og handlinger fra store via hooks
  const { personalegrupper, addPersonalegruppe, updatePersonalegruppe, deletePersonalegruppe } = usePersonalegrupper();
  const { ansaettelser } = useAnsaettelser();
  const { toast } = useToast();

  // UI-tilstande
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Personalegruppe | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Personalegruppe | null>(null);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // Åbner modal til oprettelse
  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  // Åbner modal til redigering med eksisterende data
  function openEdit(pg: Personalegruppe) {
    setEditingItem(pg);
    setForm({ navn: pg.navn });
    setErrors({});
    setModalOpen(true);
  }

  // Validerer at navn er udfyldt
  function validate(): boolean {
    const newErrors: FormErrors = {};
    const navnError = validateRequired(form.navn, "Navn");
    if (navnError) newErrors.navn = navnError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Opretter ny eller opdaterer eksisterende personalegruppe
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

  // Blokerer sletning hvis personalegruppen bruges i en ansættelse
  function handleDeleteRequest(pg: Personalegruppe) {
    const inUse = ansaettelser.some((a) => a.personalegruppeId === pg.id);
    if (inUse) {
      setBlockError(`"${pg.navn}" kan ikke slettes — den bruges i en eller flere ansættelser.`);
      return;
    }
    setBlockError(null);
    setDeleteTarget(pg);
  }

  // Udfører sletning efter bekræftelse
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

      {/* Vises kun ved blokeret sletning */}
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

      {/* Modal til oprettelse og redigering — titel skifter efter kontekst */}
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

      {/* Bekræftelsesdialog ved sletning */}
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
