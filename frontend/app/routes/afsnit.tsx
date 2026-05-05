import { useState } from "react";
import type { Afsnit } from "~/types";
import { useAfsnit } from "~/hooks/use-afsnit";
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
import { ColorBadge } from "~/components/ui/color-badge";
import { ColorPicker } from "~/components/ui/color-picker";

// Formularens felter og en tom standardværdi
type FormState = { navn: string; farve: string };
type FormErrors = Partial<FormState>;
const emptyForm: FormState = { navn: "", farve: "blue" };

export default function AfsnitPage() {
  // Data og handlinger fra store via hooks
  const { afsnit, addAfsnit, updateAfsnit, deleteAfsnit } = useAfsnit();
  const { ansaettelser } = useAnsaettelser();
  const { toast } = useToast();

  // UI-tilstande
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Afsnit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Afsnit | null>(null);
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
  function openEdit(a: Afsnit) {
    setEditingItem(a);
    setForm({ navn: a.navn, farve: a.farve });
    setErrors({});
    setModalOpen(true);
  }

  // Validerer at både navn og farve er udfyldt
  function validate(): boolean {
    const newErrors: FormErrors = {};
    const navnError = validateRequired(form.navn, "Navn");
    if (navnError) newErrors.navn = navnError;
    const farveError = validateRequired(form.farve, "Farve");
    if (farveError) newErrors.farve = farveError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Opretter nyt eller opdaterer eksisterende afsnit
  function handleSubmit() {
    if (!validate()) return;
    if (editingItem) {
      updateAfsnit(editingItem.id, form);
      toast("Afsnit opdateret");
    } else {
      addAfsnit(form);
      toast("Afsnit oprettet");
    }
    setModalOpen(false);
  }

  // Blokerer sletning hvis afsnittet bruges i en ansættelse
  function handleDeleteRequest(a: Afsnit) {
    const inUse = ansaettelser.some((ans) => ans.afsnitId === a.id);
    if (inUse) {
      setBlockError(`"${a.navn}" kan ikke slettes — det bruges i en eller flere ansættelser.`);
      return;
    }
    setBlockError(null);
    setDeleteTarget(a);
  }

  // Udfører sletning efter bekræftelse
  function handleDelete() {
    if (!deleteTarget) return;
    deleteAfsnit(deleteTarget.id);
    toast("Afsnit slettet");
    setDeleteTarget(null);
  }

  // Farvekolonnen bruger ColorBadge til at vise en farvet cirkel
  const columns: Column<Afsnit>[] = [
    { key: "navn", header: "Navn", sortable: true },
    { key: "farve", header: "Farve", render: (a) => <ColorBadge farve={a.farve} />, getValue: (a) => a.farve, sortable: true },
  ];

  return (
    <>
      <PageHeader title="Afsnit" onAdd={openCreate} addLabel="Tilføj afsnit" />

      {/* Vises kun ved blokeret sletning */}
      {blockError && (
        <div className="mb-4">
          <ErrorBanner message={blockError} onDismiss={() => setBlockError(null)} />
        </div>
      )}

      <DataTable
        data={afsnit}
        columns={columns}
        getKey={(a) => a.id}
        onEdit={openEdit}
        onDelete={handleDeleteRequest}
        emptyText="Ingen afsnit endnu"
        isLoading={false}
      />

      {/* Modal til oprettelse og redigering — titel skifter efter kontekst */}
      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingItem ? "Rediger afsnit" : "Tilføj afsnit"}
        onSubmit={handleSubmit}
      >
        <Input
          label="Navn"
          required
          value={form.navn}
          onChange={(e) => setForm((f) => ({ ...f, navn: e.target.value }))}
          error={errors.navn}
          placeholder="F.eks. Skadestue"
        />
        {/* ColorPicker viser paletten af mulige farver */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">
            Farve <span className="text-danger">*</span>
          </label>
          <ColorPicker
            value={form.farve}
            onChange={(farve) => setForm((f) => ({ ...f, farve }))}
          />
          {errors.farve && <span className="text-xs text-danger">{errors.farve}</span>}
        </div>
      </FormModal>

      {/* Bekræftelsesdialog ved sletning */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Slet ${deleteTarget?.navn ?? "afsnit"}?`}
        description="Denne handling kan ikke fortrydes."
        confirmLabel="Slet"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}