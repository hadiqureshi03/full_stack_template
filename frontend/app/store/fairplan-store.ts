import { create } from "zustand";
import type { Afsnit, Ansaettelse, Personalegruppe, Periode, User, Vagtlag } from "~/types";
import {
  initialAfsnit,
  initialAnsaettelser,
  initialPersonalegrupper,
  initialPerioder,
  initialUsers,
  initialVagtlag,
} from "~/data/mock-data";

type FairplanState = {
  perioder: Periode[];
  users: User[];
  afsnit: Afsnit[];
  personalegrupper: Personalegruppe[];
  vagtlag: Vagtlag[];
  ansaettelser: Ansaettelse[];

  // Perioder
  addPeriode: (data: Omit<Periode, "id">) => void;
  updatePeriode: (id: string, data: Partial<Omit<Periode, "id">>) => void;
  deletePeriode: (id: string) => void;

  // Users
  addUser: (data: Omit<User, "id">) => void;
  updateUser: (id: string, data: Partial<Omit<User, "id">>) => void;
  deleteUser: (id: string) => void;

  // Afsnit
  addAfsnit: (data: Omit<Afsnit, "id">) => void;
  updateAfsnit: (id: string, data: Partial<Omit<Afsnit, "id">>) => void;
  deleteAfsnit: (id: string) => void;

  // Personalegrupper
  addPersonalegruppe: (data: Omit<Personalegruppe, "id">) => void;
  updatePersonalegruppe: (id: string, data: Partial<Omit<Personalegruppe, "id">>) => void;
  deletePersonalegruppe: (id: string) => void;

  // Vagtlag
  addVagtlag: (data: Omit<Vagtlag, "id">) => void;
  updateVagtlag: (id: string, data: Partial<Omit<Vagtlag, "id">>) => void;
  deleteVagtlag: (id: string) => void;

  // Ansaettelser
  addAnsaettelse: (data: Omit<Ansaettelse, "id">) => void;
  updateAnsaettelse: (id: string, data: Partial<Omit<Ansaettelse, "id">>) => void;
  deleteAnsaettelse: (id: string) => void;
};

export const useFairplanStore = create<FairplanState>()((set) => ({
  perioder: initialPerioder,
  users: initialUsers,
  afsnit: initialAfsnit,
  personalegrupper: initialPersonalegrupper,
  vagtlag: initialVagtlag,
  ansaettelser: initialAnsaettelser,

  // Perioder
  addPeriode: (data) =>
    set((s) => ({ perioder: [...s.perioder, { ...data, id: crypto.randomUUID() }] })),
  updatePeriode: (id, data) =>
    set((s) => ({ perioder: s.perioder.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
  deletePeriode: (id) =>
    set((s) => ({ perioder: s.perioder.filter((p) => p.id !== id) })),

  // Users — cascade: sletter også ansaettelser
  addUser: (data) =>
    set((s) => ({ users: [...s.users, { ...data, id: crypto.randomUUID() }] })),
  updateUser: (id, data) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)) })),
  deleteUser: (id) =>
    set((s) => ({
      users: s.users.filter((u) => u.id !== id),
      ansaettelser: s.ansaettelser.filter((a) => a.userId !== id),
    })),

  // Afsnit
  addAfsnit: (data) =>
    set((s) => ({ afsnit: [...s.afsnit, { ...data, id: crypto.randomUUID() }] })),
  updateAfsnit: (id, data) =>
    set((s) => ({ afsnit: s.afsnit.map((a) => (a.id === id ? { ...a, ...data } : a)) })),
  deleteAfsnit: (id) =>
    set((s) => ({ afsnit: s.afsnit.filter((a) => a.id !== id) })),

  // Personalegrupper
  addPersonalegruppe: (data) =>
    set((s) => ({ personalegrupper: [...s.personalegrupper, { ...data, id: crypto.randomUUID() }] })),
  updatePersonalegruppe: (id, data) =>
    set((s) => ({
      personalegrupper: s.personalegrupper.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deletePersonalegruppe: (id) =>
    set((s) => ({ personalegrupper: s.personalegrupper.filter((p) => p.id !== id) })),

  // Vagtlag
  addVagtlag: (data) =>
    set((s) => ({ vagtlag: [...s.vagtlag, { ...data, id: crypto.randomUUID() }] })),
  updateVagtlag: (id, data) =>
    set((s) => ({ vagtlag: s.vagtlag.map((v) => (v.id === id ? { ...v, ...data } : v)) })),
  deleteVagtlag: (id) =>
    set((s) => ({ vagtlag: s.vagtlag.filter((v) => v.id !== id) })),

  // Ansaettelser
  addAnsaettelse: (data) =>
    set((s) => ({ ansaettelser: [...s.ansaettelser, { ...data, id: crypto.randomUUID() }] })),
  updateAnsaettelse: (id, data) =>
    set((s) => ({
      ansaettelser: s.ansaettelser.map((a) => (a.id === id ? { ...a, ...data } : a)),
    })),
  deleteAnsaettelse: (id) =>
    set((s) => ({ ansaettelser: s.ansaettelser.filter((a) => a.id !== id) })),
}));