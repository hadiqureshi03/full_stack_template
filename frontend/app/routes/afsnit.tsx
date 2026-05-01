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

type FormState = { navn: string; farve: string };
type FormErrors = Partial<FormState>;

const emptyForm: FormState = { navn: "", farve: "blue" };

export default function AfsnitPage() {
  const { afsnit, addAfsnit, updateAfsnit, deleteAfsnit } = useAfsnit();
  const { ansaettelser } = useAnsaettelser();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Afsnit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Afsnit | null>(null);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(a: Afsnit) {
    setEditingItem(a);
    setForm({ navn: a.navn, farve: a.farve });
    setErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const navnError = validateRequired(form.navn, "Navn");
    if (navnError) newErrors.navn = navnError;
    const farveError = validateRequired(form.farve, "Farve");
    if (farveError) newErrors.farve = farveError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

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

  function handleDeleteRequest(a: Afsnit) {
    const inUse = ansaettelser.some((ans) => ans.afsnitId === a.id);
    if (inUse) {
      setBlockError(`"${a.navn}" kan ikke slettes — det bruges i en eller flere ansættelser.`);
      return;
    }
    setBlockError(null);
    setDeleteTarget(a);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteAfsnit(deleteTarget.id);
    toast("Afsnit slettet");
    setDeleteTarget(null);
  }

  const columns: Column<Afsnit>[] = [
    {
      key: "navn",
      header: "Navn",
      sortable: true,
    },
    {
      key: "farve",
      header: "Farve",
      render: (a) => <ColorBadge farve={a.farve} />,
      getValue: (a) => a.farve,
      sortable: true,
    },
  ];

  return (
    <>
      <PageHeader title="Afsnit" onAdd={openCreate} addLabel="Tilføj afsnit" />

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
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">
            Farve <span className="text-danger">*</span>
          </label>
          <ColorPicker
            value={form.farve}
            onChange={(farve) => setForm((f) => ({ ...f, farve }))}
          />
          {errors.farve && (
            <span className="text-xs text-danger">{errors.farve}</span>
          )}
        </div>
      </FormModal>

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
