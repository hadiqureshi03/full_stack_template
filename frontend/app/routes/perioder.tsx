import { useState } from "react";
import type { Periode } from "~/types";
import { usePerioder } from "~/hooks/use-perioder";
import { useToast } from "~/contexts/toast-context";
import { validateRequired, validateDateRange } from "~/utils/validation";
import { PageHeader } from "~/components/ui/page-header";
import { DataTable } from "~/components/ui/data-table";
import type { Column } from "~/components/ui/data-table";
import { FormModal } from "~/components/ui/form-modal";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { Input } from "~/components/ui/input";

type FormState = { navn: string; startdato: string; slutdato: string };
type FormErrors = Partial<FormState>;

const emptyForm: FormState = { navn: "", startdato: "", slutdato: "" };

export default function Perioder() {
  const { perioder, addPeriode, updatePeriode, deletePeriode } = usePerioder();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Periode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Periode | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(periode: Periode) {
    setEditingItem(periode);
    setForm({ navn: periode.navn, startdato: periode.startdato, slutdato: periode.slutdato });
    setErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const navnError = validateRequired(form.navn, "Navn");
    const dateError = validateDateRange(form.startdato, form.slutdato);
    const newErrors: FormErrors = {};
    if (navnError) newErrors.navn = navnError;
    if (dateError) {
      if (!form.startdato) newErrors.startdato = dateError;
      else newErrors.slutdato = dateError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    if (editingItem) {
      updatePeriode(editingItem.id, form);
      toast("Periode opdateret");
    } else {
      addPeriode(form);
      toast("Periode oprettet");
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deletePeriode(deleteTarget.id);
    toast("Periode slettet");
    setDeleteTarget(null);
  }

  const columns: Column<Periode>[] = [
    { key: "navn", header: "Navn", sortable: true },
    { key: "startdato", header: "Startdato", sortable: true },
    { key: "slutdato", header: "Slutdato", sortable: true },
  ];

  return (
    <>
      <PageHeader title="Perioder" onAdd={openCreate} addLabel="Tilføj periode" />

      <DataTable
        data={perioder}
        columns={columns}
        getKey={(p) => p.id}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyText="Ingen perioder endnu"
        isLoading={false}
      />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingItem ? "Rediger periode" : "Tilføj periode"}
        onSubmit={handleSubmit}
      >
        <Input
          label="Navn"
          required
          value={form.navn}
          onChange={(e) => setForm((f) => ({ ...f, navn: e.target.value }))}
          error={errors.navn}
          placeholder="F.eks. Forår 2025"
        />
        <Input
          label="Startdato"
          required
          type="date"
          value={form.startdato}
          onChange={(e) => setForm((f) => ({ ...f, startdato: e.target.value }))}
          error={errors.startdato}
        />
        <Input
          label="Slutdato"
          required
          type="date"
          value={form.slutdato}
          onChange={(e) => setForm((f) => ({ ...f, slutdato: e.target.value }))}
          error={errors.slutdato}
        />
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Slet ${deleteTarget?.navn ?? "periode"}?`}
        description="Denne handling kan ikke fortrydes."
        confirmLabel="Slet"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}
