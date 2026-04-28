import { useMemo } from "react";
import { useFairplanStore } from "~/store/fairplan-store";

export function usePersonale(filterStart: string, filterSlut: string) {
  const ansaettelser = useFairplanStore((s) => s.ansaettelser);
  const users = useFairplanStore((s) => s.users);
  const afsnit = useFairplanStore((s) => s.afsnit);
  const personalegrupper = useFairplanStore((s) => s.personalegrupper);
  const vagtlag = useFairplanStore((s) => s.vagtlag);

  return useMemo(() => {
    return ansaettelser
      .filter((a) => {
        if (filterStart && a.slutdato < filterStart) return false;
        if (filterSlut && a.startdato > filterSlut) return false;
        return true;
      })
      .map((a) => ({
        ansaettelseId: a.id,
        timerPrUge: a.timerPrUge,
        startdato: a.startdato,
        slutdato: a.slutdato,
        user: users.find((u) => u.id === a.userId),
        afsnit: afsnit.find((af) => af.id === a.afsnitId),
        personalegruppe: personalegrupper.find((pg) => pg.id === a.personalegruppeId),
        vagtlag: vagtlag.find((v) => v.id === a.vagtlagId),
      }));
  }, [ansaettelser, users, afsnit, personalegrupper, vagtlag, filterStart, filterSlut]);
}
