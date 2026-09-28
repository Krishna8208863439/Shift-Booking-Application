import { apiClient } from './api';
import { Shift } from '../types/shift';

/**
 * Shifts Service
 * Integrates directly with the Shift Booking Mock API:
 * - GET  /shifts           Fetch all shifts
 * - GET  /shifts/{id}      Fetch a single shift by ID
 * - POST /shifts/{id}/book Book a shift
 * - POST /shifts/{id}/cancel Cancel a shift
 */

export async function getShifts(): Promise<Shift[]> {
  const response = await apiClient.get<Shift[]>('/shifts');
  return response.data;
}

export async function getShiftById(id: string): Promise<Shift> {
  const response = await apiClient.get<Shift>(`/shifts/${encodeURIComponent(id)}`);
  return response.data;
}

export async function bookShift(id: string): Promise<Shift> {
  const response = await apiClient.post<Shift>(`/shifts/${encodeURIComponent(id)}/book`);
  return response.data;
}

export async function cancelShift(id: string): Promise<Shift> {
  const response = await apiClient.post<Shift>(`/shifts/${encodeURIComponent(id)}/cancel`);
  return response.data;
}
