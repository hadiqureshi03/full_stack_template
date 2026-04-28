import type { User } from "~/types";

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} er påkrævet`;
  return null;
}

export function validateEmail(
  email: string,
  existingUsers: User[],
  excludeId?: string
): string | null {
  if (!email.trim()) return "Email er påkrævet";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email er ugyldig";
  const duplicate = existingUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== excludeId
  );
  if (duplicate) return "Email er allerede i brug";
  return null;
}

export function validateDateRange(startdato: string, slutdato: string): string | null {
  if (!startdato) return "Startdato er påkrævet";
  if (!slutdato) return "Slutdato er påkrævet";
  if (slutdato <= startdato) return "Slutdato skal være efter startdato";
  return null;
}

export function validateTimerPrUge(timer: number | string): string | null {
  const n = Number(timer);
  if (!Number.isInteger(n) || n < 0 || n > 37)
    return "Timer pr. uge skal være et heltal mellem 0 og 37";
  return null;
}
