export type Area = 'Helsinki' | 'Tampere' | 'Turku';

export interface Shift {
  id: string;
  area: Area;
  booked: boolean;
  startTime: number;
  endTime: number;
}

export type CityFilterOption = 'All' | Area;

export type ShiftActionStatus = 'available' | 'booked' | 'overlapping' | 'started' | 'finished';

export interface ShiftGroup {
  dateKey: string;
  dateHeading: string;
  timestamp: number;
  shifts: Shift[];
  totalShifts: number;
  totalDurationHours: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}
