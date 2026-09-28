import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Shift, CityFilterOption, ShiftGroup } from '../types/shift';
import * as shiftsService from '../services/shiftsService';
import { extractErrorMessage, pingBackend, getApiBaseUrl } from '../services/api';
import {
  filterShiftsByCity,
  groupShiftsByDate,
  getCityCounts,
  sortShiftsChronologically,
  calculateTotalShiftHours,
  isShiftOverlapping,
} from '../utils/shiftUtils';

export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

interface ShiftContextValue {
  // State
  shifts: Shift[];
  bookedShifts: Shift[];
  availableShifts: Shift[];
  selectedCity: CityFilterOption;
  isLoading: boolean;
  isRefreshing: boolean;
  actionLoadingId: string | null;
  error: string | null;
  successMessage: string | null;
  connectionStatus: ConnectionStatus;
  apiBaseUrl: string;

  // Derived groups & statistics
  availableGroups: ShiftGroup[];
  bookedGroups: ShiftGroup[];
  cityCounts: Record<CityFilterOption, number>;
  totalBookedHours: number;
  eligibleAvailableCount: number;

  // Actions
  fetchShifts: () => Promise<void>;
  refreshShifts: () => Promise<void>;
  checkConnection: () => Promise<void>;
  bookShift: (id: string) => Promise<boolean>;
  cancelShift: (id: string) => Promise<boolean>;
  setSelectedCity: (city: CityFilterOption) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

const ShiftContext = createContext<ShiftContextValue | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityFilterOption>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');

  /**
   * Actively checks backend health
   */
  const checkConnection = useCallback(async () => {
    setConnectionStatus('checking');
    const isOnline = await pingBackend();
    setConnectionStatus(isOnline ? 'connected' : 'disconnected');
  }, []);

  /**
   * Fetches all shifts from the Mock API
   */
  const fetchShifts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setConnectionStatus('checking');
      const data = await shiftsService.getShifts();
      setShifts(data);
      setConnectionStatus('connected');
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Pull-to-refresh handler
   */
  const refreshShifts = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      setConnectionStatus('checking');
      const data = await shiftsService.getShifts();
      setShifts(data);
      setConnectionStatus('connected');
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      setConnectionStatus('disconnected');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  /**
   * Book a shift with backend validation
   */
  const bookShift = useCallback(
    async (id: string): Promise<boolean> => {
      if (actionLoadingId) return false;

      try {
        setActionLoadingId(id);
        setError(null);
        const updatedShift = await shiftsService.bookShift(id);

        // Update single source of truth
        setShifts((prev) =>
          prev.map((s) => (s.id === updatedShift.id ? updatedShift : s))
        );

        setConnectionStatus('connected');
        setSuccessMessage(`Shift in ${updatedShift.area} successfully booked!`);
        return true;
      } catch (err) {
        const msg = extractErrorMessage(err);
        setError(msg);
        return false;
      } finally {
        setActionLoadingId(null);
      }
    },
    [actionLoadingId]
  );

  /**
   * Cancel a booked shift
   */
  const cancelShift = useCallback(
    async (id: string): Promise<boolean> => {
      if (actionLoadingId) return false;

      try {
        setActionLoadingId(id);
        setError(null);
        const updatedShift = await shiftsService.cancelShift(id);

        // Update single source of truth
        setShifts((prev) =>
          prev.map((s) => (s.id === updatedShift.id ? updatedShift : s))
        );

        setConnectionStatus('connected');
        setSuccessMessage(`Shift in ${updatedShift.area} successfully cancelled.`);
        return true;
      } catch (err) {
        const msg = extractErrorMessage(err);
        setError(msg);
        return false;
      } finally {
        setActionLoadingId(null);
      }
    },
    [actionLoadingId]
  );

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccessMessage(null), []);

  // Auto-dismiss success notification after 3.5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Derived lists
  const bookedShifts = useMemo(() => {
    return sortShiftsChronologically(shifts.filter((s) => s.booked));
  }, [shifts]);

  const availableShifts = useMemo(() => {
    return sortShiftsChronologically(shifts.filter((s) => !s.booked));
  }, [shifts]);

  // Filtered available (unbooked) shifts by selected city
  const filteredAvailableShifts = useMemo(() => {
    return filterShiftsByCity(availableShifts, selectedCity);
  }, [availableShifts, selectedCity]);

  // Grouped shifts by calendar date
  const availableGroups = useMemo(() => {
    return groupShiftsByDate(filteredAvailableShifts);
  }, [filteredAvailableShifts]);

  const bookedGroups = useMemo(() => {
    return groupShiftsByDate(bookedShifts);
  }, [bookedShifts]);

  // City counts for filter bar: shows count of AVAILABLE (unbooked) shifts per city
  const cityCounts = useMemo(() => {
    return getCityCounts(availableShifts);
  }, [availableShifts]);

  // Total booked hours
  const totalBookedHours = useMemo(() => {
    return calculateTotalShiftHours(bookedShifts);
  }, [bookedShifts]);

  // Number of shifts eligible for booking (unbooked, not started, not finished, not overlapping)
  const eligibleAvailableCount = useMemo(() => {
    const now = Date.now();
    return shifts.filter(
      (s) => !s.booked && now < s.startTime && !isShiftOverlapping(s, bookedShifts)
    ).length;
  }, [shifts, bookedShifts]);

  const value = useMemo(
    () => ({
      shifts,
      bookedShifts,
      availableShifts,
      selectedCity,
      isLoading,
      isRefreshing,
      actionLoadingId,
      error,
      successMessage,
      connectionStatus,
      apiBaseUrl: getApiBaseUrl(),
      availableGroups,
      bookedGroups,
      cityCounts,
      totalBookedHours,
      eligibleAvailableCount,
      fetchShifts,
      refreshShifts,
      checkConnection,
      bookShift,
      cancelShift,
      setSelectedCity,
      clearError,
      clearSuccess,
    }),
    [
      shifts,
      bookedShifts,
      availableShifts,
      selectedCity,
      isLoading,
      isRefreshing,
      actionLoadingId,
      error,
      successMessage,
      connectionStatus,
      availableGroups,
      bookedGroups,
      cityCounts,
      totalBookedHours,
      eligibleAvailableCount,
      fetchShifts,
      refreshShifts,
      checkConnection,
      bookShift,
      cancelShift,
      setSelectedCity,
      clearError,
      clearSuccess,
    ]
  );

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
};

export function useShiftContext(): ShiftContextValue {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShiftContext must be used within a ShiftProvider');
  }
  return context;
}
