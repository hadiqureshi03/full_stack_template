import type { Afsnit, Ansaettelse, Personalegruppe, Periode, User, Vagtlag } from "~/types";

// Startdata til store — bruges kun ved første indlæsning hvis localStorage er tom

export const initialPerioder: Periode[] = [
  { id: "p1", navn: "Forår 2025", startdato: "2025-02-01", slutdato: "2025-05-31" },
  { id: "p2", navn: "Sommer 2025", startdato: "2025-06-01", slutdato: "2025-08-31" },
  { id: "p3", navn: "Efterår 2025", startdato: "2025-09-01", slutdato: "2025-11-30" },
];

// u1 og u5 er admins — u2, u3, u4 og u5 er personale der kan ansættes
export const initialUsers: User[] = [
  { id: "u1", navn: "Anna Nielsen", email: "anna@hospital.dk", rolleAdmin: true, rollePersonale: false },
  { id: "u2", navn: "Lars Christensen", email: "lars@hospital.dk", rolleAdmin: false, rollePersonale: true },
  { id: "u3", navn: "Maria Pedersen", email: "maria@hospital.dk", rolleAdmin: false, rollePersonale: true },
  { id: "u4", navn: "Jonas Møller", email: "jonas@hospital.dk", rolleAdmin: false, rollePersonale: true },
  { id: "u5", navn: "Sara Jensen", email: "sara@hospital.dk", rolleAdmin: true, rollePersonale: true },
];

export const initialAfsnit: Afsnit[] = [
  { id: "a1", navn: "Skadestue", farve: "red" },
  { id: "a2", navn: "Sengeafsnit A", farve: "blue" },
  { id: "a3", navn: "Intensiv", farve: "orange" },
  { id: "a4", navn: "Børneafsnit", farve: "green" },
];

export const initialPersonalegrupper: Personalegruppe[] = [
  { id: "pg1", navn: "Overlæge" },
  { id: "pg2", navn: "Reservelæge" },
  { id: "pg3", navn: "Sygeplejerske" },
];

export const initialVagtlag: Vagtlag[] = [
  { id: "v1", navn: "Dagvagt" },
  { id: "v2", navn: "Aftenvagt" },
  { id: "v3", navn: "Nattevagt" },
];

// Demoansættelser — én pr. personalemedlem fordelt over de tre perioder
export const initialAnsaettelser: Ansaettelse[] = [
  {
    id: "ans1",
    userId: "u2",
    afsnitId: "a1",
    personalegruppeId: "pg2",
    vagtlagId: "v1",
    timerPrUge: 37,
    startdato: "2025-02-01",
    slutdato: "2025-05-31",
  },
  {
    id: "ans2",
    userId: "u3",
    afsnitId: "a2",
    personalegruppeId: "pg3",
    vagtlagId: "v2",
    timerPrUge: 30,
    startdato: "2025-06-01",
    slutdato: "2025-08-31",
  },
  {
    id: "ans3",
    userId: "u4",
    afsnitId: "a3",
    personalegruppeId: "pg1",
    vagtlagId: "v1",
    timerPrUge: 37,
    startdato: "2025-09-01",
    slutdato: "2025-11-30",
  },
  {
    id: "ans4",
    userId: "u5",
    afsnitId: "a4",
    personalegruppeId: "pg2",
    vagtlagId: "v3",
    timerPrUge: 20,
    startdato: "2025-02-01",
    slutdato: "2025-11-30",
  },
];
