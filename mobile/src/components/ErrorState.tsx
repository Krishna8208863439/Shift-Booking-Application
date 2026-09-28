import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radii } from '../theme/spacing';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

const FullContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xxxl}px;
  min-height: 280px;
`;

const CompactBanner = styled.View`
  background-color: ${colors.cancelTint};
  border-width: 1px;
  border-color: ${colors.cancelBorder};
  border-radius: ${radii.md}px;
  margin: ${spacing.md}px;
  padding: ${spacing.md}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MessageRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: ${spacing.sm}px;
`;

const BannerText = styled.Text`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.medium};
  color: ${colors.cancelRed};
  margin-left: ${spacing.sm}px;
  flex: 1;
`;

const RetryTextButton = styled.TouchableOpacity`
  padding-horizontal: ${spacing.sm}px;
  padding-vertical: 4px;
`;

const RetryButtonLabel = styled.Text`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.cancelRed};
  text-decoration-line: underline;
`;

const FullTitle = styled.Text`
  font-size: ${typography.sizes.xl}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.textPrimary};
  margin-top: ${spacing.md}px;
  margin-bottom: ${spacing.xs}px;
`;

const FullMessage = styled.Text`
  font-size: ${typography.sizes.md}px;
  color: ${colors.textSecondary};
  text-align: center;
  margin-bottom: ${spacing.xl}px;
  max-width: 300px;
  line-height: ${typography.lineHeights.normal}px;
`;

const RetryPillButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding-horizontal: ${spacing.xxl}px;
  padding-vertical: ${spacing.md}px;
  border-radius: ${radii.pill}px;
`;

const RetryPillText = styled.Text`
  font-size: ${typography.sizes.base}px;
  font-weight: ${typography.weights.semibold};
  color: ${colors.white};
`;

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onDismiss,
  compact = false,
}) => {
  if (compact) {
    return (
      <CompactBanner>
        <MessageRow>
          <Ionicons name="alert-circle" size={20} color={colors.cancelRed} />
          <BannerText>{message}</BannerText>
        </MessageRow>
        {onRetry ? (
          <RetryTextButton onPress={onRetry}>
            <RetryButtonLabel>Retry</RetryButtonLabel>
          </RetryTextButton>
        ) : onDismiss ? (
          <RetryTextButton onPress={onDismiss}>
            <Ionicons name="close" size={18} color={colors.cancelRed} />
          </RetryTextButton>
        ) : null}
      </CompactBanner>
    );
  }

  return (
    <FullContainer>
      <Ionicons name="cloud-offline-outline" size={54} color={colors.cancelRed} />
      <FullTitle>Something went wrong</FullTitle>
      <FullMessage>{message}</FullMessage>
      {onRetry ? (
        <RetryPillButton onPress={onRetry} activeOpacity={0.8}>
          <RetryPillText>Try Again</RetryPillText>
        </RetryPillButton>
      ) : null}
    </FullContainer>
  );
};
