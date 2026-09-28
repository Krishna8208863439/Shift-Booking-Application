import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface DateSectionProps {
  heading: string;
  summary?: string;
}

const HeaderContainer = styled.View`
  background-color: ${colors.headerBackground};
  border-top-width: 1px;
  border-top-color: ${colors.border};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
  padding-horizontal: ${spacing.lg}px;
  padding-vertical: ${spacing.md}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeadingText = styled.Text`
  font-size: ${typography.sizes.base}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.textPrimary};
`;

const SummaryText = styled.Text`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.medium};
  color: ${colors.textSecondary};
`;

export const DateSection: React.FC<DateSectionProps> = ({ heading, summary }) => {
  return (
    <HeaderContainer>
      <HeadingText>{heading}</HeadingText>
      {summary ? <SummaryText>{summary}</SummaryText> : null}
    </HeaderContainer>
  );
};
