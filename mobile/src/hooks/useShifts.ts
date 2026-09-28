import { useShiftContext } from '../context/ShiftContext';

/**
 * Hook for consuming shift data and query states
 */
export function useShifts() {
  const context = useShiftContext();
  return context;
}
