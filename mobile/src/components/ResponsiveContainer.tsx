import React, { useState } from 'react';
import {
  useWindowDimensions,
  Platform,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radii } from '../theme/spacing';
import { useShifts } from '../hooks/useShifts';
import { formatHoursSummary } from '../utils/dateUtils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

const DesktopBackground = styled.View`
  flex: 1;
  background-color: #ebf1f8;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xl}px;
`;

const DesktopSidebar = styled.View`
  width: 340px;
  height: 840px;
  max-height: 90vh;
  margin-right: ${spacing.xl}px;
  padding: ${spacing.xl}px;
  background-color: ${colors.white};
  border-radius: ${radii.xl}px;
  border-width: 1px;
  border-color: ${colors.border};
  elevation: 4;
  shadow-color: ${colors.black};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 20px;
  justify-content: space-between;
`;

const SidebarTop = styled.View``;

const SidebarBrand = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${spacing.sm}px;
`;

const SidebarBrandText = styled.Text`
  font-size: ${typography.sizes.xl}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.primary};
  margin-left: 10px;
`;

const SidebarDescription = styled.Text`
  font-size: ${typography.sizes.sm}px;
  color: ${colors.textSecondary};
  line-height: ${typography.lineHeights.normal}px;
  margin-bottom: ${spacing.xl}px;
`;

const StatsGroup = styled.View`
  margin-bottom: ${spacing.lg}px;
`;

const StatCard = styled.View`
  background-color: ${colors.headerBackground};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: ${radii.md}px;
  padding: ${spacing.md}px;
  margin-bottom: ${spacing.sm}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.Text`
  font-size: ${typography.sizes.sm}px;
  color: ${colors.textPrimary};
  font-weight: ${typography.weights.medium};
`;

const StatValue = styled.Text`
  font-size: ${typography.sizes.base}px;
  color: ${colors.primary};
  font-weight: ${typography.weights.bold};
`;

const ModeToggleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${colors.primary};
  padding-vertical: ${spacing.md}px;
  border-radius: ${radii.pill}px;
  margin-top: ${spacing.md}px;
`;

const ModeToggleText = styled.Text`
  color: ${colors.white};
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.bold};
  margin-left: 8px;
`;

const ConnectionCard = styled.View`
  background-color: ${colors.white};
  border-top-width: 1px;
  border-top-color: ${colors.border};
  padding-top: ${spacing.md}px;
`;

const ConnectionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ConnectionLabel = styled.Text`
  font-size: ${typography.sizes.xs}px;
  color: ${colors.textSecondary};
  font-weight: ${typography.weights.medium};
`;

const ConnectionBadge = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.headerBackground};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: ${radii.pill}px;
  padding-horizontal: 8px;
  padding-vertical: 3px;
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

const ConnectionStatusText = styled.Text<{ status: 'connected' | 'disconnected' | 'checking' }>`
  font-size: 11px;
  font-weight: ${typography.weights.bold};
  color: ${(props) => {
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
`;

const ConnectionDetailsText = styled.Text`
  font-size: 11px;
  color: ${colors.textSecondary};
  line-height: 15px;
  margin-top: 4px;
`;

// Right Application Panel for Desktop View
const DesktopAppPanel = styled.View<{ height: number }>`
  width: 580px;
  height: ${(props) => `${props.height}px`};
  max-height: 90vh;
  background-color: ${colors.white};
  border-radius: ${radii.xl}px;
  border-width: 1px;
  border-color: ${colors.border};
  overflow: hidden;
  elevation: 8;
  shadow-color: ${colors.black};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.12;
  shadow-radius: 24px;
`;

// Phone Frame for Mobile View
const PhoneFrame = styled.View<{ height: number }>`
  width: 420px;
  height: ${(props) => `${props.height}px`};
  max-height: 860px;
  background-color: ${colors.white};
  border-radius: 42px;
  border-width: 8px;
  border-color: #1e293b;
  overflow: hidden;
  elevation: 12;
  shadow-color: ${colors.black};
  shadow-offset: 0px 12px;
  shadow-opacity: 0.18;
  shadow-radius: 30px;
`;

const PhoneNotch = styled.View`
  width: 120px;
  height: 20px;
  background-color: #1e293b;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  align-self: center;
  position: absolute;
  top: 0;
  z-index: 100;
`;

const FloatingBackToDesktopButton = styled.TouchableOpacity`
  position: absolute;
  top: 24px;
  right: 24px;
  flex-direction: row;
  align-items: center;
  background-color: ${colors.white};
  border-width: 1px;
  border-color: ${colors.border};
  padding-horizontal: ${spacing.lg}px;
  padding-vertical: ${spacing.sm}px;
  border-radius: ${radii.pill}px;
  elevation: 4;
  shadow-color: ${colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  z-index: 200;
`;

const FloatingButtonText = styled.Text`
  font-size: ${typography.sizes.sm}px;
  font-weight: ${typography.weights.bold};
  color: ${colors.primary};
  margin-left: 6px;
`;

const MobileNativeWrapper = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${colors.background};
`;

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [isPhoneView, setIsPhoneView] = useState<boolean>(false);

  // Check if running on desktop browser
  const isDesktopWeb = Platform.OS === 'web' && width >= 800;

  // On native mobile devices or small screens, render full screen edge-to-edge
  if (!isDesktopWeb) {
    return <MobileNativeWrapper>{children}</MobileNativeWrapper>;
  }

  const frameHeight = Math.min(height - 60, 840);

  return (
    <DesktopContainerInner
      isPhoneView={isPhoneView}
      frameHeight={frameHeight}
      onTogglePhoneView={() => setIsPhoneView((prev) => !prev)}
    >
      {children}
    </DesktopContainerInner>
  );
};

const DesktopContainerInner: React.FC<{
  children: React.ReactNode;
  isPhoneView: boolean;
  frameHeight: number;
  onTogglePhoneView: () => void;
}> = ({ children, isPhoneView, frameHeight, onTogglePhoneView }) => {
  const {
    shifts,
    bookedShifts,
    totalBookedHours,
    selectedCity,
    connectionStatus,
    checkConnection,
    eligibleAvailableCount,
    apiBaseUrl,
  } = useShifts();

  const statusText =
    connectionStatus === 'connected'
      ? 'Connected'
      : connectionStatus === 'disconnected'
      ? 'Disconnected'
      : 'Checking...';

  // If user toggled to Phone Preview Mode
  if (isPhoneView) {
    return (
      <DesktopBackground>
        <FloatingBackToDesktopButton onPress={onTogglePhoneView} activeOpacity={0.8}>
          <Ionicons name="desktop-outline" size={16} color={colors.primary} />
          <FloatingButtonText>Switch to Desktop View</FloatingButtonText>
        </FloatingBackToDesktopButton>

        <PhoneFrame height={frameHeight}>
          <PhoneNotch />
          <View style={{ flex: 1, paddingTop: 10 }}>{children}</View>
        </PhoneFrame>
      </DesktopBackground>
    );
  }

  // Two-column Desktop Layout: Left Sidebar + Right App Panel
  return (
    <DesktopBackground>
      {/* Left Dashboard Sidebar */}
      <DesktopSidebar>
        <SidebarTop>
          <SidebarBrand>
            <Ionicons name="briefcase" size={26} color={colors.primary} />
            <SidebarBrandText>ShiftBook</SidebarBrandText>
          </SidebarBrand>

          <SidebarDescription>
            Shift scheduling and booking platform with real-time backend synchronization and overlap validation.
          </SidebarDescription>

          <StatsGroup>
            <StatCard>
              <StatLabel>Available Shifts</StatLabel>
              <StatValue>{eligibleAvailableCount}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel>My Booked Shifts</StatLabel>
              <StatValue>{bookedShifts.length}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel>Total Booked Hours</StatLabel>
              <StatValue>{formatHoursSummary(totalBookedHours)}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel>Active City Filter</StatLabel>
              <StatValue>{selectedCity}</StatValue>
            </StatCard>
          </StatsGroup>

          <ModeToggleButton onPress={onTogglePhoneView} activeOpacity={0.85}>
            <Ionicons name="phone-portrait-outline" size={18} color={colors.white} />
            <ModeToggleText>Switch to Phone View</ModeToggleText>
          </ModeToggleButton>
        </SidebarTop>

        {/* Backend Connection Status */}
        <ConnectionCard>
          <ConnectionRow>
            <ConnectionLabel>Backend Status</ConnectionLabel>
            <ConnectionBadge onPress={checkConnection} activeOpacity={0.7}>
              <StatusDot status={connectionStatus} />
              <ConnectionStatusText status={connectionStatus}>
                {statusText}
              </ConnectionStatusText>
            </ConnectionBadge>
          </ConnectionRow>
          <ConnectionDetailsText>
            API: {apiBaseUrl.replace('http://', '')} (Port 8080)
            {'\n'}All mutations synchronize with the live server.
          </ConnectionDetailsText>
        </ConnectionCard>
      </DesktopSidebar>

      {/* Right Application Panel */}
      <DesktopAppPanel height={frameHeight}>
        <View style={{ flex: 1 }}>{children}</View>
      </DesktopAppPanel>
    </DesktopBackground>
  );
};
