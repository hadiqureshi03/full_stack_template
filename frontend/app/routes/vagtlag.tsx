import { useState } from "react";
import type { Vagtlag } from "~/types";
import { useVagtlag } from "~/hooks/use-vagtlag";
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

export default function Vagtlag() {
  // Data og handlinger fra store via hooks
  const { vagtlag, addVagtlag, updateVagtlag, deleteVagtlag } = useVagtlag();
  const { ansaettelser } = useAnsaettelser();
  const { toast } = useToast();

  // UI-tilstande
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Vagtlag | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vagtlag | null>(null);
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
  function openEdit(vl: Vagtlag) {
    setEditingItem(vl);
    setForm({ navn: vl.navn });
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

  // Opretter nyt eller opdaterer eksisterende vagtlag
  function handleSubmit() {
    if (!validate()) return;
    if (editingItem) {
      updateVagtlag(editingItem.id, form);
      toast("Vagtlag opdateret");
    } else {
      addVagtlag(form);
      toast("Vagtlag oprettet");
    }
    setModalOpen(false);
  }

  // Blokerer sletning hvis vagtlaget bruges i en ansættelse
  function handleDeleteRequest(vl: Vagtlag) {
    const inUse = ansaettelser.some((a) => a.vagtlagId === vl.id);
    if (inUse) {
      setBlockError(`"${vl.navn}" kan ikke slettes — det bruges i en eller flere ansættelser.`);
      return;
    }
    setBlockError(null);
    setDeleteTarget(vl);
  }

  // Udfører sletning efter bekræftelse
  function handleDelete() {
    if (!deleteTarget) return;
    deleteVagtlag(deleteTarget.id);
    toast("Vagtlag slettet");
    setDeleteTarget(null);
  }

  const columns: Column<Vagtlag>[] = [
    { key: "navn", header: "Navn", sortable: true },
  ];

  return (
    <>
      <PageHeader title="Vagtlag" onAdd={openCreate} addLabel="Tilføj vagtlag" />

      {/* Vises kun ved blokeret sletning */}
      {blockError && (
        <div className="mb-4">
          <ErrorBanner message={blockError} onDismiss={() => setBlockError(null)} />
        </div>
      )}

      <DataTable
        data={vagtlag}
        columns={columns}
        getKey={(vl) => vl.id}
        onEdit={openEdit}
        onDelete={handleDeleteRequest}
        emptyText="Ingen vagtlag endnu"
        isLoading={false}
      />

      {/* Modal til oprettelse og redigering — titel skifter efter kontekst */}
      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingItem ? "Rediger vagtlag" : "Tilføj vagtlag"}
        onSubmit={handleSubmit}
      >
        <Input
          label="Navn"
          required
          value={form.navn}
          onChange={(e) => setForm((f) => ({ ...f, navn: e.target.value }))}
          error={errors.navn}
          placeholder="F.eks. Dagvagt"
        />
      </FormModal>

      {/* Bekræftelsesdialog ved sletning */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Slet ${deleteTarget?.navn ?? "vagtlag"}?`}
        description="Denne handling kan ikke fortrydes."
        confirmLabel="Slet"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}