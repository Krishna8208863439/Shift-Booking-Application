import { useCallback } from 'react';
import { useShiftContext } from '../context/ShiftContext';

/**
 * Hook for executing shift mutations (booking and cancellation)
 */
export function useShiftActions() {
  const { bookShift, cancelShift, actionLoadingId } = useShiftContext();

  const isShiftActionLoading = useCallback(
    (shiftId: string): boolean => {
      return actionLoadingId === shiftId;
    },
    [actionLoadingId]
  );

  return {
    bookShift,
    cancelShift,
    isShiftActionLoading,
    activeActionShiftId: actionLoadingId,
  };
}
