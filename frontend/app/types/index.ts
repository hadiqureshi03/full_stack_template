export type Periode = {
  id: string;
  navn: string;
  startdato: string;
  slutdato: string;
};

export type User = {
  id: string;
  navn: string;
  email: string;
  rolleAdmin: boolean;
  rollePersonale: boolean;
};

export type Afsnit = {
  id: string;
  navn: string;
  farve: string;
};

export type Personalegruppe = {
  id: string;
  navn: string;
};

export type Vagtlag = {
  id: string;
  navn: string;
};

export type Ansaettelse = {
  id: string;
  userId: string;
  afsnitId: string;
  personalegruppeId: string;
  vagtlagId: string;
  timerPrUge: number;
  startdato: string;
  slutdato: string;
};

export type FarveOption = {
  label: string;
  value: string;
  hex: string;
};

export const FARVE_PALETTE: FarveOption[] = [
  { label: "Rød", value: "red", hex: "#e74c3c" },
  { label: "Orange", value: "orange", hex: "#e67e22" },
  { label: "Gul", value: "yellow", hex: "#f1c40f" },
  { label: "Grøn", value: "green", hex: "#2ecc71" },
  { label: "Blå", value: "blue", hex: "#3498db" },
  { label: "Lilla", value: "purple", hex: "#9b59b6" },
  { label: "Pink", value: "pink", hex: "#e91e8c" },
  { label: "Grå", value: "gray", hex: "#95a5a6" },
  { label: "Mørk", value: "dark", hex: "#2c3e50" },
];
