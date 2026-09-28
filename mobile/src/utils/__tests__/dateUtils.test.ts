import {
  formatTime,
  formatTimeRange,
  getDateKey,
  formatDateHeading,
  calculateDurationHours,
  formatHoursSummary,
  formatShiftsSummary,
  isSameDay,
} from '../dateUtils';

describe('dateUtils', () => {
  describe('formatTime', () => {
    it('formats timestamps to HH:mm 24-hour time', () => {
      // 2026-09-26 14:30:00 local
      const d = new Date(2026, 8, 26, 14, 30, 0);
      expect(formatTime(d.getTime())).toBe('14:30');
    });

    it('pads single-digit hours and minutes with leading zero', () => {
      const d = new Date(2026, 8, 26, 9, 5, 0);
      expect(formatTime(d.getTime())).toBe('09:05');
    });

    it('handles invalid timestamp gracefully', () => {
      expect(formatTime(NaN)).toBe('--:--');
    });
  });

  describe('formatTimeRange', () => {
    it('formats a start and end timestamp to HH:mm-HH:mm', () => {
      const start = new Date(2026, 8, 26, 14, 0, 0).getTime();
      const end = new Date(2026, 8, 26, 16, 0, 0).getTime();
      expect(formatTimeRange(start, end)).toBe('14:00-16:00');
    });
  });

  describe('getDateKey', () => {
    it('returns normalized YYYY-MM-DD string', () => {
      const d = new Date(2026, 8, 26, 15, 0, 0);
      expect(getDateKey(d.getTime())).toBe('2026-09-26');
    });
  });

  describe('formatDateHeading', () => {
    const reference = new Date(2026, 8, 26, 12, 0, 0); // Today is Sep 26, 2026

    it('returns "Today" for current day shifts', () => {
      const todayShift = new Date(2026, 8, 26, 16, 0, 0).getTime();
      expect(formatDateHeading(todayShift, reference)).toBe('Today');
    });

    it('returns "Tomorrow" for next day shifts', () => {
      const tomorrowShift = new Date(2026, 8, 27, 10, 0, 0).getTime();
      expect(formatDateHeading(tomorrowShift, reference)).toBe('Tomorrow');
    });

    it('returns "Month Day" for shifts further in the future', () => {
      const futureShift = new Date(2026, 8, 30, 10, 0, 0).getTime();
      expect(formatDateHeading(futureShift, reference)).toBe('September 30');
    });
  });

  describe('calculateDurationHours', () => {
    it('calculates duration in hours correctly', () => {
      const start = new Date(2026, 8, 26, 12, 0, 0).getTime();
      const end = new Date(2026, 8, 26, 14, 0, 0).getTime();
      expect(calculateDurationHours(start, end)).toBe(2);
    });

    it('handles fractional hours', () => {
      const start = new Date(2026, 8, 26, 12, 0, 0).getTime();
      const end = new Date(2026, 8, 26, 15, 30, 0).getTime();
      expect(calculateDurationHours(start, end)).toBe(3.5);
    });
  });

  describe('formatShiftsSummary', () => {
    it('formats singular shift correctly', () => {
      expect(formatShiftsSummary(1, 4)).toBe('1 shift, 4 h');
    });

    it('formats multiple shifts correctly', () => {
      expect(formatShiftsSummary(2, 6.5)).toBe('2 shifts, 6.5 h');
    });
  });
});
