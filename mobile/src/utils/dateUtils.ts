/**
 * Date and time formatting utilities for ShiftBook
 */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Validates and converts a millisecond timestamp to a Date object.
 */
export function toValidDate(timestamp: number | string | Date): Date {
  const date = new Date(Number(timestamp));
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }
  return date;
}

/**
 * Formats a timestamp into 24-hour time "HH:mm" (e.g., "09:00", "14:30")
 */
export function formatTime(timestamp: number): string {
  try {
    const date = toValidDate(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '--:--';
  }
}

/**
 * Formats a start and end timestamp into a time range string "HH:mm-HH:mm"
 * e.g., "14:00-16:00" matching design spec
 */
export function formatTimeRange(startTime: number, endTime: number): string {
  return `${formatTime(startTime)}-${formatTime(endTime)}`;
}

/**
 * Normalizes a date to YYYY-MM-DD string for reliable grouping.
 */
export function getDateKey(timestamp: number): string {
  try {
    const date = toValidDate(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return 'unknown-date';
  }
}

/**
 * Checks if two dates are on the same calendar day.
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Returns human-readable date heading:
 * - "Today" if the date is today
 * - "Tomorrow" if the date is tomorrow
 * - "September 22" (Month Day) matching the design specification
 */
export function formatDateHeading(timestamp: number, referenceDate: Date = new Date()): string {
  try {
    const date = toValidDate(timestamp);
    const today = new Date(referenceDate);
    const tomorrow = new Date(referenceDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (isSameDay(date, today)) {
      return 'Today';
    }

    if (isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    }

    const monthName = MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    return `${monthName} ${day}`;
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Returns full date heading with day name: "Monday, 28 September"
 */
export function formatFullDateHeading(timestamp: number): string {
  try {
    const date = toValidDate(timestamp);
    const dayName = DAY_NAMES[date.getDay()];
    const day = date.getDate();
    const monthName = MONTH_NAMES[date.getMonth()];
    return `${dayName}, ${day} ${monthName}`;
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Calculates duration between two timestamps in hours.
 */
export function calculateDurationHours(startTime: number, endTime: number): number {
  if (endTime <= startTime) return 0;
  const diffMs = endTime - startTime;
  const hours = diffMs / (1000 * 60 * 60);
  // Round to at most 1 decimal place if fractional (e.g. 2.5)
  return Math.round(hours * 10) / 10;
}

/**
 * Formats duration in hours (e.g. "4 h", "2.5 h")
 */
export function formatHoursSummary(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded} h`;
}

/**
 * Formats shift count and duration summary (e.g. "2 shifts, 4 h" or "1 shift, 2 h")
 * Sourced directly from design-spec.pdf headers
 */
export function formatShiftsSummary(count: number, hours: number): string {
  const shiftText = count === 1 ? '1 shift' : `${count} shifts`;
  return `${shiftText}, ${formatHoursSummary(hours)}`;
}

/**
 * Checks if a shift has already started relative to current time.
 */
export function isShiftStarted(startTime: number): boolean {
  return Date.now() > startTime;
}

/**
 * Checks if a shift is already finished relative to current time.
 */
export function isShiftFinished(endTime: number): boolean {
  return Date.now() >= endTime;
}
