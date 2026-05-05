import { useState, useMemo } from "react";
import { usePersonale } from "~/hooks/use-personale";
import { useAfsnit } from "~/hooks/use-afsnit";
import { usePersonalegrupper } from "~/hooks/use-personalegrupper";
import { useVagtlag } from "~/hooks/use-vagtlag";
import { PageHeader } from "~/components/ui/page-header";
import { DataTable } from "~/components/ui/data-table";
import type { Column } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { ColorBadge } from "~/components/ui/color-badge";

type PersonaleRow = {
  ansaettelseId: string;
  timerPrUge: number;
  startdato: string;
  slutdato: string;
  user: { id: string; navn: string; email: string; rolleAdmin: boolean; rollePersonale: boolean } | undefined;
  afsnit: { id: string; navn: string; farve: string } | undefined;
  personalegruppe: { id: string; navn: string } | undefined;
  vagtlag: { id: string; navn: string } | undefined;
};

// Sentinel-værdi der betyder "vis alle" i dropdown-filtre
const ALL = "__all__";

export default function Personale() {
  // Dato-filter sendes til hooken som filtrerer ansættelser på aktiv periode
  const [filterStart, setFilterStart] = useState("");
  const [filterSlut, setFilterSlut] = useState("");
  const [search, setSearch] = useState("");
  const [filterAfsnitId, setFilterAfsnitId] = useState(ALL);
  const [filterPersonalegruppeId, setFilterPersonalegruppeId] = useState(ALL);
  const [filterVagtlagId, setFilterVagtlagId] = useState(ALL);

  // usePersonale returnerer allerede joined data fra ansaettelser + users + afsnit + mm.
  const personale = usePersonale(filterStart, filterSlut);
  const { afsnit } = useAfsnit();
  const { personalegrupper } = usePersonalegrupper();
  const { vagtlag } = useVagtlag();

  // Dropdown-options med "Alle"-valg øverst
  const afsnitOptions = useMemo(
    () => [{ label: "Alle afsnit", value: ALL }, ...afsnit.map((a) => ({ label: a.navn, value: a.id }))],
    [afsnit]
  );
  const personalegruppeOptions = useMemo(
    () => [{ label: "Alle personalegrupper", value: ALL }, ...personalegrupper.map((pg) => ({ label: pg.navn, value: pg.id }))],
    [personalegrupper]
  );
  const vagtlagOptions = useMemo(
    () => [{ label: "Alle vagtlag", value: ALL }, ...vagtlag.map((vl) => ({ label: vl.navn, value: vl.id }))],
    [vagtlag]
  );

  // Klient-side filtrering oven på dato-filteret fra hooken
  const filtered = useMemo(() => {
    return personale.filter((row) => {
      if (search && !row.user?.navn.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterAfsnitId !== ALL && row.afsnit?.id !== filterAfsnitId) return false;
      if (filterPersonalegruppeId !== ALL && row.personalegruppe?.id !== filterPersonalegruppeId) return false;
      if (filterVagtlagId !== ALL && row.vagtlag?.id !== filterVagtlagId) return false;
      return true;
    });
  }, [personale, search, filterAfsnitId, filterPersonalegruppeId, filterVagtlagId]);

  const columns: Column<PersonaleRow>[] = [
    { key: "user", header: "Navn", sortable: true, getValue: (r) => r.user?.navn ?? "", render: (r) => r.user?.navn ?? "—" },
    {
      key: "afsnit", header: "Afsnit", sortable: true,
      getValue: (r) => r.afsnit?.navn ?? "",
      // Viser farvet cirkel + navn via ColorBadge
      render: (r) => r.afsnit ? <ColorBadge farve={r.afsnit.farve} label={r.afsnit.navn} /> : "—",
    },
    { key: "personalegruppe", header: "Personalegruppe", sortable: true, getValue: (r) => r.personalegruppe?.navn ?? "", render: (r) => r.personalegruppe?.navn ?? "—" },
    { key: "vagtlag", header: "Vagtlag", sortable: true, getValue: (r) => r.vagtlag?.navn ?? "", render: (r) => r.vagtlag?.navn ?? "—" },
    { key: "timerPrUge", header: "Timer/uge", sortable: true, getValue: (r) => String(r.timerPrUge), render: (r) => `${r.timerPrUge} t` },
    { key: "startdato", header: "Startdato", sortable: true },
    { key: "slutdato", header: "Slutdato", sortable: true },
  ];

  return (
    <>
      <PageHeader title="Personale" />

      {/* Filterkontroller øverst — dato-filtre, søgefelt og tre dropdowns */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="w-48">
          <Input label="Fra dato" type="date" value={filterStart} onChange={(e) => setFilterStart(e.target.value)} />
        </div>
        <div className="w-48">
          <Input label="Til dato" type="date" value={filterSlut} onChange={(e) => setFilterSlut(e.target.value)} />
        </div>
        <div className="w-56">
          <Input label="Søg på navn" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="F.eks. Anna" />
        </div>
        <div className="w-48">
          <Select label="Afsnit" options={afsnitOptions} value={filterAfsnitId} onValueChange={setFilterAfsnitId} />
        </div>
        <div className="w-48">
          <Select label="Personalegruppe" options={personalegruppeOptions} value={filterPersonalegruppeId} onValueChange={setFilterPersonalegruppeId} />
        </div>
        <div className="w-48">
          <Select label="Vagtlag" options={vagtlagOptions} value={filterVagtlagId} onValueChange={setFilterVagtlagId} />
        </div>
      </div>

      {/* Read-only tabel — ingen onEdit eller onDelete */}
      <DataTable
        data={filtered}
        columns={columns}
        getKey={(r) => r.ansaettelseId}
        emptyText="Ingen personale matcher filteret"
        isLoading={false}
      />
    </>
  );
}