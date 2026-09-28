import { Shift } from '../../types/shift';
import {
  sortShiftsChronologically,
  filterShiftsByCity,
  isShiftOverlapping,
  getShiftStatus,
  groupShiftsByDate,
  getCityCounts,
} from '../shiftUtils';

describe('shiftUtils', () => {
  const baseTime = new Date(2026, 8, 26, 10, 0, 0).getTime();
  const makeShift = (overrides: Partial<Shift>): Shift => ({
    id: 'test-id',
    area: 'Helsinki',
    booked: false,
    startTime: baseTime,
    endTime: baseTime + 2 * 3600 * 1000, // 10:00 - 12:00
    ...overrides,
  });

  describe('sortShiftsChronologically', () => {
    it('sorts shifts by startTime ascending', () => {
      const s1 = makeShift({ id: '1', startTime: baseTime + 3600000 }); // 11:00
      const s2 = makeShift({ id: '2', startTime: baseTime }); // 10:00
      const s3 = makeShift({ id: '3', startTime: baseTime + 7200000 }); // 12:00

      const sorted = sortShiftsChronologically([s1, s3, s2]);
      expect(sorted.map((s) => s.id)).toEqual(['2', '1', '3']);
    });
  });

  describe('filterShiftsByCity', () => {
    const list: Shift[] = [
      makeShift({ id: '1', area: 'Helsinki' }),
      makeShift({ id: '2', area: 'Tampere' }),
      makeShift({ id: '3', area: 'Turku' }),
      makeShift({ id: '4', area: 'Helsinki' }),
    ];

    it('returns all shifts when city is All', () => {
      expect(filterShiftsByCity(list, 'All')).toHaveLength(4);
    });

    it('filters shifts for a specific city', () => {
      const helsinkiShifts = filterShiftsByCity(list, 'Helsinki');
      expect(helsinkiShifts).toHaveLength(2);
      expect(helsinkiShifts.every((s) => s.area === 'Helsinki')).toBe(true);

      const turkuShifts = filterShiftsByCity(list, 'Turku');
      expect(turkuShifts).toHaveLength(1);
      expect(turkuShifts[0].id).toBe('3');
    });
  });

  describe('isShiftOverlapping', () => {
    // Target shift: 12:00 - 14:00
    const target = makeShift({
      id: 'target',
      startTime: baseTime + 2 * 3600000,
      endTime: baseTime + 4 * 3600000,
    });

    it('returns false when booked list is empty', () => {
      expect(isShiftOverlapping(target, [])).toBe(false);
    });

    it('returns true when a booked shift overlaps in time', () => {
      // Booked shift: 13:00 - 15:00 (overlaps with 12:00 - 14:00)
      const booked = [
        makeShift({
          id: 'booked-1',
          booked: true,
          startTime: baseTime + 3 * 3600000,
          endTime: baseTime + 5 * 3600000,
        }),
      ];
      expect(isShiftOverlapping(target, booked)).toBe(true);
    });

    it('returns false when booked shift is completely adjacent (touches border)', () => {
      // Booked shift: 14:00 - 16:00 (starts right when target ends)
      const booked = [
        makeShift({
          id: 'booked-2',
          booked: true,
          startTime: baseTime + 4 * 3600000,
          endTime: baseTime + 6 * 3600000,
        }),
      ];
      expect(isShiftOverlapping(target, booked)).toBe(false);
    });

    it('ignores itself if it is already in the booked list', () => {
      expect(isShiftOverlapping(target, [target])).toBe(false);
    });
  });

  describe('groupShiftsByDate', () => {
    it('groups shifts by calendar date and calculates sums', () => {
      const day1Shift1 = makeShift({
        id: 'd1s1',
        startTime: baseTime,
        endTime: baseTime + 2 * 3600000, // 2 hours
      });
      const day1Shift2 = makeShift({
        id: 'd1s2',
        startTime: baseTime + 4 * 3600000,
        endTime: baseTime + 6 * 3600000, // 2 hours
      });
      const day2Shift1 = makeShift({
        id: 'd2s1',
        startTime: baseTime + 24 * 3600000,
        endTime: baseTime + 27 * 3600000, // 3 hours
      });

      const groups = groupShiftsByDate([day1Shift2, day2Shift1, day1Shift1]);
      expect(groups).toHaveLength(2);
      expect(groups[0].shifts).toHaveLength(2);
      expect(groups[0].totalShifts).toBe(2);
      expect(groups[0].totalDurationHours).toBe(4);
      expect(groups[1].shifts).toHaveLength(1);
      expect(groups[1].totalDurationHours).toBe(3);
    });
  });

  describe('getCityCounts', () => {
    it('calculates counts correctly per city and total', () => {
      const list: Shift[] = [
        makeShift({ id: '1', area: 'Helsinki' }),
        makeShift({ id: '2', area: 'Helsinki' }),
        makeShift({ id: '3', area: 'Tampere' }),
        makeShift({ id: '4', area: 'Turku' }),
      ];

      const counts = getCityCounts(list);
      expect(counts.All).toBe(4);
      expect(counts.Helsinki).toBe(2);
      expect(counts.Tampere).toBe(1);
      expect(counts.Turku).toBe(1);
    });
  });
});
