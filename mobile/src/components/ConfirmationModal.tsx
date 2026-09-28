import React from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radii } from '../theme/spacing';
import { Shift } from '../types/shift';
import { formatTimeRange, formatDateHeading } from '../utils/dateUtils';
import { LoadingIndicator } from './LoadingIndicator';

interface ConfirmationModalProps {
  visible: boolean;
  shift: Shift | null;
  isLoading: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

const Overlay = styled.View`
  flex: 1;
  background-color: ${colors.overlay};
  justify-content: center;
  align-items: center;
  padding: ${spacing.xl}px;
`;

const ModalCard = styled.View`
  width: 100%;
  max-width: 360px;
  background-color: ${colors.white};
  border-radius: ${radii.lg}px;
  padding: ${spacing.xxl}px;
  align-items: center;
  elevation: 8;
  shadow-color: ${colors.black};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
`;

const Title = styled.Text`
  font-size: ${typography.sizes.xl}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm}px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: ${typography.sizes.md}px;
  color: ${colors.textSecondary};
  text-align: center;
  margin-bottom: ${spacing.lg}px;
`;

const ShiftDetailsBox = styled.View`
  width: 100%;
  background-color: ${colors.headerBackground};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: ${radii.md}px;
  padding: ${spacing.md}px;
  margin-bottom: ${spacing.xl}px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 3px;
`;

const DetailLabel = styled.Text`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.medium};
  color: ${colors.textSecondary};
`;

const DetailValue = styled.Text`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.textPrimary};
`;

const ButtonRow = styled.View`
  flex-direction: row;
  width: 100%;
  gap: ${spacing.md}px;
`;

const KeepButton = styled.TouchableOpacity`
  flex: 1;
  height: 44px;
  border-radius: ${radii.pill}px;
  border-width: 1.5px;
  border-color: ${colors.border};
  justify-content: center;
  align-items: center;
  background-color: ${colors.white};
`;

const KeepButtonText = styled.Text`
  font-size: ${typography.sizes.base}px;
  font-weight: ${typography.weights.semibold};
  color: ${colors.textPrimary};
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  height: 44px;
  border-radius: ${radii.pill}px;
  background-color: ${colors.cancelRed};
  justify-content: center;
  align-items: center;
`;

const CancelButtonText = styled.Text`
  font-size: ${typography.sizes.base}px;
  font-weight: ${typography.weights.semibold};
  color: ${colors.white};
`;

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  shift,
  isLoading,
  onConfirm,
  onDismiss,
}) => {
  if (!shift) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss} disabled={isLoading}>
        <Overlay>
          <TouchableWithoutFeedback>
            <ModalCard>
              <Title>Cancel Shift?</Title>
              <Subtitle>
                Are you sure you want to cancel this booking? This shift will become available to other team members.
              </Subtitle>

              <ShiftDetailsBox>
                <DetailRow>
                  <DetailLabel>City</DetailLabel>
                  <DetailValue>{shift.area}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Date</DetailLabel>
                  <DetailValue>{formatDateHeading(shift.startTime)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Time</DetailLabel>
                  <DetailValue>
                    {formatTimeRange(shift.startTime, shift.endTime)}
                  </DetailValue>
                </DetailRow>
              </ShiftDetailsBox>

              <ButtonRow>
                <KeepButton onPress={onDismiss} disabled={isLoading} activeOpacity={0.7}>
                  <KeepButtonText>Keep Shift</KeepButtonText>
                </KeepButton>

                <CancelButton onPress={onConfirm} disabled={isLoading} activeOpacity={0.7}>
                  {isLoading ? (
                    <LoadingIndicator color="white" size={20} />
                  ) : (
                    <CancelButtonText>Cancel Shift</CancelButtonText>
                  )}
                </CancelButton>
              </ButtonRow>
            </ModalCard>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
