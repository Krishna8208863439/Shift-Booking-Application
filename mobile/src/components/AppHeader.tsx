import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radii } from '../theme/spacing';
import { useShifts } from '../hooks/useShifts';
import { setApiBaseUrl } from '../services/api';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const HeaderRoot = styled.View`
  background-color: ${colors.white};
  padding-horizontal: ${spacing.lg}px;
  padding-top: ${spacing.md}px;
  padding-bottom: ${spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xs}px;
`;

const BrandBadge = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BrandText = styled.Text`
  font-size: ${typography.sizes.xs}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.primary};
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-left: 5px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${spacing.sm}px;
`;

const StatusChip = styled.TouchableOpacity`
  background-color: ${colors.headerBackground};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: ${radii.pill}px;
  padding-horizontal: ${spacing.sm}px;
  padding-vertical: 3px;
  flex-direction: row;
  align-items: center;
`;

const StatusDot = styled.View<{ status: 'connected' | 'disconnected' | 'checking' }>`
  width: 7px;
  height: 7px;
  border-radius: 4px;
  background-color: ${(props) => {
    switch (props.status) {
      case 'connected':
        return colors.bookGreen;
      case 'disconnected':
        return colors.cancelRed;
      case 'checking':
      default:
        return colors.warning;
    }
  }};
  margin-right: 5px;
`;

const StatusLabelText = styled.Text`
  font-size: ${typography.sizes.xxs}px;
  font-weight: ${typography.weights.semibold};
  color: ${colors.textPrimary};
`;

const RefreshButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${colors.headerBackground};
  border-width: 1px;
  border-color: ${colors.border};
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: ${typography.sizes.header}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.textPrimary};
  margin-top: 2px;
`;

const Subtitle = styled.Text`
  font-size: ${typography.sizes.sm}px;
  color: ${colors.textSecondary};
  margin-top: 2px;
`;

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  isRefreshing = false,
}) => {
  const { connectionStatus, apiBaseUrl, checkConnection } = useShifts();
  const [currentUrl, setCurrentUrl] = useState<string>(apiBaseUrl);

  const handleStatusPress = () => {
    Alert.prompt
      ? Alert.prompt(
          'API Server Configuration',
          `Current server URL:\n${currentUrl}\n\nStatus: ${connectionStatus.toUpperCase()}\n\nEnter new API URL (or press Save to test):`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Save & Reconnect',
              onPress: (newUrl?: string) => {
                if (newUrl && newUrl.trim()) {
                  setApiBaseUrl(newUrl.trim());
                  setCurrentUrl(newUrl.trim());
                }
                checkConnection();
                if (onRefresh) onRefresh();
              },
            },
          ],
          'plain-text',
          currentUrl
        )
      : Alert.alert(
          'Backend Server Status',
          `Server: ${currentUrl}\nStatus: ${connectionStatus.toUpperCase()}\n\nTo change host or connect from another device, set EXPO_PUBLIC_API_URL or run the backend at http://localhost:8080.`,
          [
            { text: 'OK' },
            {
              text: 'Re-check Connection',
              onPress: () => {
                checkConnection();
                if (onRefresh) onRefresh();
              },
            },
          ]
        );
  };

  const statusDisplay =
    connectionStatus === 'connected'
      ? 'Connected'
      : connectionStatus === 'disconnected'
      ? 'Disconnected'
      : 'Checking...';

  return (
    <HeaderRoot>
      <TopRow>
        <BrandBadge>
          <Ionicons name="briefcase" size={14} color={colors.primary} />
          <BrandText>ShiftBook</BrandText>
        </BrandBadge>

        <ActionsRow>
          <StatusChip onPress={handleStatusPress} activeOpacity={0.7}>
            <StatusDot status={connectionStatus} />
            <StatusLabelText>{statusDisplay}</StatusLabelText>
          </StatusChip>

          {onRefresh ? (
            <RefreshButton onPress={onRefresh} disabled={isRefreshing} activeOpacity={0.7}>
              <Ionicons
                name="refresh"
                size={16}
                color={isRefreshing ? colors.primary : colors.textPrimary}
              />
            </RefreshButton>
          ) : null}
        </ActionsRow>
      </TopRow>

      <Title>{title}</Title>
      {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
    </HeaderRoot>
  );
};
