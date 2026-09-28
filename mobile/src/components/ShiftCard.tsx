import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radii } from '../theme/spacing';
import { Shift, ShiftActionStatus } from '../types/shift';
import { formatTimeRange, isShiftStarted } from '../utils/dateUtils';
import { StatusBadge } from './StatusBadge';
import { LoadingIndicator } from './LoadingIndicator';

interface ShiftCardProps {
  shift: Shift;
  status: ShiftActionStatus;
  isLoading: boolean;
  onBook?: () => void;
  onCancel?: () => void;
  showCitySubtitle?: boolean;
}

const CardRow = styled.View`
  background-color: ${colors.cardBackground};
  padding-horizontal: ${spacing.lg}px;
  padding-vertical: ${spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

const LeftSection = styled.View`
  flex: 1;
  justify-content: center;
`;

const TimeText = styled.Text`
  font-size: ${typography.sizes.base}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.textPrimary};
  margin-bottom: 2px;
`;

const CityText = styled.Text`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.medium};
  color: ${colors.textSecondary};
`;

const MiddleSection = styled.View`
  margin-horizontal: ${spacing.sm}px;
  justify-content: center;
`;

const ActionButton = styled.TouchableOpacity<{
  variant: 'book' | 'cancel' | 'disabled';
}>`
  width: 96px;
  height: 38px;
  border-radius: ${radii.pill}px;
  border-width: 1.5px;
  border-color: ${(props) => {
    switch (props.variant) {
      case 'book':
        return colors.bookBorder;
      case 'cancel':
        return colors.cancelBorder;
      case 'disabled':
      default:
        return colors.disabledBorder;
    }
  }};
  background-color: ${colors.white};
  justify-content: center;
  align-items: center;
`;

const ActionButtonText = styled.Text<{
  variant: 'book' | 'cancel' | 'disabled';
}>`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.bold};
  color: ${(props) => {
    switch (props.variant) {
      case 'book':
        return colors.bookGreen;
      case 'cancel':
        return colors.cancelRed;
      case 'disabled':
      default:
        return colors.disabledText;
    }
  }};
`;

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  status,
  isLoading,
  onBook,
  onCancel,
  showCitySubtitle = true,
}) => {
  const started = isShiftStarted(shift.startTime);

  // Determine button state and variant
  let buttonLabel = 'Book';
  let buttonVariant: 'book' | 'cancel' | 'disabled' = 'book';
  let buttonDisabled = false;
  let onPressHandler: (() => void) | undefined = onBook;
  let spinnerColor: 'green' | 'red' = 'green';

  if (shift.booked) {
    buttonLabel = 'Cancel';
    spinnerColor = 'red';
    if (started) {
      buttonVariant = 'disabled';
      buttonDisabled = true;
      onPressHandler = undefined;
    } else {
      buttonVariant = 'cancel';
      buttonDisabled = false;
      onPressHandler = onCancel;
    }
  } else {
    // Unbooked
    if (status === 'overlapping' || status === 'started' || status === 'finished') {
      buttonVariant = 'disabled';
      buttonDisabled = true;
      buttonLabel = 'Book';
      onPressHandler = undefined;
    } else {
      buttonVariant = 'book';
      buttonDisabled = false;
      buttonLabel = 'Book';
      onPressHandler = onBook;
    }
  }

  return (
    <CardRow>
      <LeftSection>
        <TimeText>{formatTimeRange(shift.startTime, shift.endTime)}</TimeText>
        {showCitySubtitle ? <CityText>{shift.area}</CityText> : null}
      </LeftSection>

      <MiddleSection>
        <StatusBadge status={status} />
      </MiddleSection>

      <ActionButton
        variant={buttonVariant}
        disabled={buttonDisabled || isLoading}
        onPress={onPressHandler}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${buttonLabel} shift in ${shift.area} from ${formatTimeRange(shift.startTime, shift.endTime)}`}
      >
        {isLoading ? (
          <LoadingIndicator color={spinnerColor} size={20} />
        ) : (
          <ActionButtonText variant={buttonVariant}>{buttonLabel}</ActionButtonText>
        )}
      </ActionButton>
    </CardRow>
  );
};
