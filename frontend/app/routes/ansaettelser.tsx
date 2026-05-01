import { useState, useMemo } from "react";
import type { Ansaettelse } from "~/types";
import { useAnsaettelser } from "~/hooks/use-ansaettelser";
import { useUsers } from "~/hooks/use-users";
import { useAfsnit } from "~/hooks/use-afsnit";
import { usePersonalegrupper } from "~/hooks/use-personalegrupper";
import { useVagtlag } from "~/hooks/use-vagtlag";
import { useOverlapCheck } from "~/hooks/use-overlap-check";
import { useToast } from "~/contexts/toast-context";
import { validateRequired, validateDateRange, validateTimerPrUge } from "~/utils/validation";
import { PageHeader } from "~/components/ui/page-header";
import { DataTable } from "~/components/ui/data-table";
import type { Column } from "~/components/ui/data-table";
import { FormDrawer } from "~/components/ui/form-drawer";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { ColorBadge } from "~/components/ui/color-badge";

type FormState = {
  userId: string;
  afsnitId: string;
  personalegruppeId: string;
  vagtlagId: string;
  timerPrUge: string;
  startdato: string;
  slutdato: string;
};

type FormErrors = Partial<FormState>;

const emptyForm: FormState = {
  userId: "",
  afsnitId: "",
  personalegruppeId: "",
  vagtlagId: "",
  timerPrUge: "",
  startdato: "",
  slutdato: "",
};

export default function Ansaettelser() {
  const { ansaettelser, addAnsaettelse, updateAnsaettelse, deleteAnsaettelse } = useAnsaettelser();
  const { users } = useUsers();
  const { afsnit } = useAfsnit();
  const { personalegrupper } = usePersonalegrupper();
  const { vagtlag } = useVagtlag();
  const { hasOverlap } = useOverlapCheck();
  const { toast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ansaettelse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ansaettelse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const personaleOptions = useMemo(
    () =>
      users
        .filter((u) => u.rollePersonale)
        .map((u) => ({ label: u.navn, value: u.id })),
    [users]
  );

  const afsnitOptions = useMemo(
    () => afsnit.map((a) => ({ label: a.navn, value: a.id })),
    [afsnit]
  );

  const personalegruppeOptions = useMemo(
    () => personalegrupper.map((pg) => ({ label: pg.navn, value: pg.id })),
    [personalegrupper]
  );

  const vagtlagOptions = useMemo(
    () => vagtlag.map((vl) => ({ label: vl.navn, value: vl.id })),
    [vagtlag]
  );

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setErrors({});
    setDrawerOpen(true);
  }

  function openEdit(a: Ansaettelse) {
    setEditingItem(a);
    setForm({
      userId: a.userId,
      afsnitId: a.afsnitId,
      personalegruppeId: a.personalegruppeId,
      vagtlagId: a.vagtlagId,
      timerPrUge: String(a.timerPrUge),
      startdato: a.startdato,
      slutdato: a.slutdato,
    });
    setErrors({});
    setDrawerOpen(true);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.userId) newErrors.userId = "Person er påkrævet";
    if (!form.afsnitId) newErrors.afsnitId = "Afsnit er påkrævet";
    if (!form.personalegruppeId) newErrors.personalegruppeId = "Personalegruppe er påkrævet";
    if (!form.vagtlagId) newErrors.vagtlagId = "Vagtlag er påkrævet";

    const timerError = validateTimerPrUge(form.timerPrUge);
    if (timerError) newErrors.timerPrUge = timerError;

    const dateError = validateDateRange(form.startdato, form.slutdato);
    if (dateError) {
      if (!form.startdato) newErrors.startdato = dateError;
      else newErrors.slutdato = dateError;
    }

    if (
      form.userId &&
      form.startdato &&
      form.slutdato &&
      !dateError &&
      hasOverlap(form.userId, form.startdato, form.slutdato, editingItem?.id)
    ) {
      newErrors.slutdato = "Denne person har allerede en ansættelse i den periode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      userId: form.userId,
      afsnitId: form.afsnitId,
      personalegruppeId: form.personalegruppeId,
      vagtlagId: form.vagtlagId,
      timerPrUge: Number(form.timerPrUge),
      startdato: form.startdato,
      slutdato: form.slutdato,
    };
    if (editingItem) {
      updateAnsaettelse(editingItem.id, data);
      toast("Ansættelse opdateret");
    } else {
      addAnsaettelse(data);
      toast("Ansættelse oprettet");
    }
    setDrawerOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteAnsaettelse(deleteTarget.id);
    toast("Ansættelse slettet");
    setDeleteTarget(null);
  }

  function getUserNavn(userId: string) {
    return users.find((u) => u.id === userId)?.navn ?? userId;
  }

  function getAfsnit(afsnitId: string) {
    return afsnit.find((a) => a.id === afsnitId);
  }

  function getPersonalegruppeNavn(id: string) {
    return personalegrupper.find((pg) => pg.id === id)?.navn ?? id;
  }

  function getVagtlagNavn(id: string) {
    return vagtlag.find((vl) => vl.id === id)?.navn ?? id;
  }

  const columns: Column<Ansaettelse>[] = [
    {
      key: "userId",
      header: "Person",
      sortable: true,
      getValue: (a) => getUserNavn(a.userId),
      render: (a) => getUserNavn(a.userId),
    },
    {
      key: "afsnitId",
      header: "Afsnit",
      sortable: true,
      getValue: (a) => getAfsnit(a.afsnitId)?.navn ?? "",
      render: (a) => {
        const af = getAfsnit(a.afsnitId);
        return af ? <ColorBadge farve={af.farve} label={af.navn} /> : a.afsnitId;
      },
    },
    {
      key: "personalegruppeId",
      header: "Personalegruppe",
      sortable: true,
      getValue: (a) => getPersonalegruppeNavn(a.personalegruppeId),
      render: (a) => getPersonalegruppeNavn(a.personalegruppeId),
    },
    {
      key: "vagtlagId",
      header: "Vagtlag",
      sortable: true,
      getValue: (a) => getVagtlagNavn(a.vagtlagId),
      render: (a) => getVagtlagNavn(a.vagtlagId),
    },
    {
      key: "timerPrUge",
      header: "Timer/uge",
      sortable: true,
      getValue: (a) => String(a.timerPrUge),
      render: (a) => `${a.timerPrUge} t`,
    },
    {
      key: "startdato",
      header: "Startdato",
      sortable: true,
    },
    {
      key: "slutdato",
      header: "Slutdato",
      sortable: true,
    },
  ];

  return (
    <>
      <PageHeader title="Ansættelser" onAdd={openCreate} addLabel="Tilføj ansættelse" />

      <DataTable
        data={ansaettelser}
        columns={columns}
        getKey={(a) => a.id}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyText="Ingen ansættelser endnu"
        isLoading={false}
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingItem ? "Rediger ansættelse" : "Tilføj ansættelse"}
        onSubmit={handleSubmit}
      >
        <Select
          label="Person"
          required
          placeholder="Vælg person"
          options={personaleOptions}
          value={form.userId}
          onValueChange={(v) => setForm((f) => ({ ...f, userId: v }))}
          error={errors.userId}
        />
        <Select
          label="Afsnit"
          required
          placeholder="Vælg afsnit"
          options={afsnitOptions}
          value={form.afsnitId}
          onValueChange={(v) => setForm((f) => ({ ...f, afsnitId: v }))}
          error={errors.afsnitId}
        />
        <Select
          label="Personalegruppe"
          required
          placeholder="Vælg personalegruppe"
          options={personalegruppeOptions}
          value={form.personalegruppeId}
          onValueChange={(v) => setForm((f) => ({ ...f, personalegruppeId: v }))}
          error={errors.personalegruppeId}
        />
        <Select
          label="Vagtlag"
          required
          placeholder="Vælg vagtlag"
          options={vagtlagOptions}
          value={form.vagtlagId}
          onValueChange={(v) => setForm((f) => ({ ...f, vagtlagId: v }))}
          error={errors.vagtlagId}
        />
        <Input
          label="Timer pr. uge"
          required
          type="number"
          value={form.timerPrUge}
          onChange={(e) => setForm((f) => ({ ...f, timerPrUge: e.target.value }))}
          error={errors.timerPrUge}
          placeholder="F.eks. 37"
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
      </FormDrawer>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Slet ansættelse?"
        description="Denne handling kan ikke fortrydes."
        confirmLabel="Slet"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}
