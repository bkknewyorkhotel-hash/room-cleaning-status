import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats ISO date string to Asia/Bangkok 24-hour time string (HH:mm)
 */
export function formatBangkokTime(dateInput?: string | Date | null): string {
  if (!dateInput) return '--:--';

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '--:--';

    return new Intl.DateTimeFormat('th-TH', {
      timeZone: 'Asia/Bangkok',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error('Time formatting error:', error);
    return '--:--';
  }
}

/**
 * Natural room number sorter (e.g., 101, 102, 103... 201, 202)
 */
export function compareRoomNumbers(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}
