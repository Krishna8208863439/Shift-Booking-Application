import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { ShiftActionStatus } from '../types/shift';

interface StatusBadgeProps {
  status: ShiftActionStatus;
}

const TextWrapper = styled.View`
  justify-content: center;
  align-items: flex-end;
  padding-right: 8px;
`;

const StatusText = styled.Text<{ status: ShiftActionStatus }>`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${(props) =>
    props.status === 'overlapping'
      ? typography.weights.bold
      : typography.weights.semibold};
  color: ${(props) => {
    switch (props.status) {
      case 'booked':
        return colors.textPrimary;
      case 'overlapping':
        return colors.cancelRed;
      case 'started':
      case 'finished':
        return colors.textSecondary;
      default:
        return 'transparent';
    }
  }};
`;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === 'available') {
    return null;
  }

  let label = '';
  switch (status) {
    case 'booked':
      label = 'Booked';
      break;
    case 'overlapping':
      label = 'Overlapping';
      break;
    case 'started':
      label = 'Started';
      break;
    case 'finished':
      label = 'Finished';
      break;
  }

  return (
    <TextWrapper>
      <StatusText status={status}>{label}</StatusText>
    </TextWrapper>
  );
};
