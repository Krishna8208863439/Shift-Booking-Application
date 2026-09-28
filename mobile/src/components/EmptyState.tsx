import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radii } from '../theme/spacing';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xxxl}px;
  min-height: 320px;
`;

const IconCircle = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: ${colors.headerBackground};
  border-width: 1px;
  border-color: ${colors.border};
  justify-content: center;
  align-items: center;
  margin-bottom: ${spacing.lg}px;
`;

const Title = styled.Text`
  font-size: ${typography.sizes.xl}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: ${spacing.xs}px;
`;

const Description = styled.Text`
  font-size: ${typography.sizes.md}px;
  color: ${colors.textSecondary};
  text-align: center;
  line-height: ${typography.lineHeights.normal}px;
  max-width: 280px;
  margin-bottom: ${spacing.xl}px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding-horizontal: ${spacing.xxl}px;
  padding-vertical: ${spacing.md}px;
  border-radius: ${radii.pill}px;
`;

const ActionButtonText = styled.Text`
  font-size: ${typography.sizes.base}px;
  font-weight: ${typography.weights.semibold};
  color: ${colors.white};
`;

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'calendar-outline',
  actionLabel,
  onAction,
}) => {
  return (
    <Container>
      <IconCircle>
        <Ionicons name={iconName} size={36} color={colors.textSecondary} />
      </IconCircle>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {actionLabel && onAction ? (
        <ActionButton onPress={onAction} activeOpacity={0.8}>
          <ActionButtonText>{actionLabel}</ActionButtonText>
        </ActionButton>
      ) : null}
    </Container>
  );
};
