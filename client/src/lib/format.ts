import { format, parseISO, isValid } from 'date-fns';

const randFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatRands(value: number | null | undefined): string {
  if (value == null) return 'R0';
  return randFormatter.format(value);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const date = parseISO(dateStr);
  if (!isValid(date)) return '—';
  return format(date, 'dd MMM yyyy');
}
