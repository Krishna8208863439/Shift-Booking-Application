import { Shift, CityFilterOption, ShiftGroup, ShiftActionStatus } from '../types/shift';
import {
  getDateKey,
  formatDateHeading,
  calculateDurationHours,
  isShiftStarted,
  isShiftFinished,
} from './dateUtils';

/**
 * Sorts shifts chronologically by start time ascending.
 * If start times are equal, sorts by end time.
 */
export function sortShiftsChronologically(shifts: Shift[]): Shift[] {
  return [...shifts].sort((a, b) => {
    if (a.startTime !== b.startTime) {
      return a.startTime - b.startTime;
    }
    return a.endTime - b.endTime;
  });
}

/**
 * Filters shifts by the selected city.
 * 'All' returns all shifts.
 */
export function filterShiftsByCity(shifts: Shift[], city: CityFilterOption): Shift[] {
  if (city === 'All') {
    return shifts;
  }
  return shifts.filter((shift) => shift.area === city);
}

/**
 * Checks if a shift overlaps with any currently booked shift.
 * Matches backend validation logic:
 * s.startTime < shift.endTime && s.endTime > shift.startTime
 */
export function isShiftOverlapping(shift: Shift, bookedShifts: Shift[]): boolean {
  return bookedShifts.some(
    (booked) =>
      booked.id !== shift.id &&
      booked.startTime < shift.endTime &&
      booked.endTime > shift.startTime
  );
}

/**
 * Evaluates the visual status for a shift in the Available Shifts list.
 */
export function getShiftStatus(shift: Shift, bookedShifts: Shift[]): ShiftActionStatus {
  if (shift.booked) {
    return 'booked';
  }
  if (isShiftFinished(shift.endTime)) {
    return 'finished';
  }
  if (isShiftStarted(shift.startTime)) {
    return 'started';
  }
  if (isShiftOverlapping(shift, bookedShifts)) {
    return 'overlapping';
  }
  return 'available';
}

/**
 * Groups shifts by calendar date.
 * Groups are sorted chronologically.
 * Shifts within each group are sorted by start time.
 */
export function groupShiftsByDate(shifts: Shift[], referenceDate: Date = new Date()): ShiftGroup[] {
  if (!shifts || shifts.length === 0) {
    return [];
  }

  const sortedShifts = sortShiftsChronologically(shifts);
  const groupsMap = new Map<string, ShiftGroup>();

  for (const shift of sortedShifts) {
    const dateKey = getDateKey(shift.startTime);
    let group = groupsMap.get(dateKey);

    if (!group) {
      const dateHeading = formatDateHeading(shift.startTime, referenceDate);
      group = {
        dateKey,
        dateHeading,
        timestamp: shift.startTime,
        shifts: [],
        totalShifts: 0,
        totalDurationHours: 0,
      };
      groupsMap.set(dateKey, group);
    }

    group.shifts.push(shift);
    group.totalShifts += 1;
    group.totalDurationHours += calculateDurationHours(shift.startTime, shift.endTime);
  }

  // Sort groups chronologically
  return Array.from(groupsMap.values()).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Computes shift counts for each city filter option.
 * Used in city filter tabs (e.g. Helsinki (5), Tampere (8), Turku (5), All (18))
 */
export function getCityCounts(shifts: Shift[]): Record<CityFilterOption, number> {
  const counts: Record<CityFilterOption, number> = {
    All: shifts.length,
    Helsinki: 0,
    Tampere: 0,
    Turku: 0,
  };

  for (const shift of shifts) {
    if (counts[shift.area] !== undefined) {
      counts[shift.area] += 1;
    }
  }

  return counts;
}

/**
 * Calculates total hours across an entire list of shifts.
 */
export function calculateTotalShiftHours(shifts: Shift[]): number {
  return shifts.reduce((total, s) => total + calculateDurationHours(s.startTime, s.endTime), 0);
}
