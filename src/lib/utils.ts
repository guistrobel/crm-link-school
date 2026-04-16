import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
