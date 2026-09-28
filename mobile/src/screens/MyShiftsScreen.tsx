import React, { useState } from 'react';
import { SectionList, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useShifts } from '../hooks/useShifts';
import { useShiftActions } from '../hooks/useShiftActions';
import { AppHeader } from '../components/AppHeader';
import { DateSection } from '../components/DateSection';
import { ShiftCard } from '../components/ShiftCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Shift } from '../types/shift';
import { formatShiftsSummary, formatHoursSummary } from '../utils/dateUtils';

const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.View`
  flex: 1;
`;

const TotalSummaryBar = styled.View`
  background-color: ${colors.white};
  padding-horizontal: 16px;
  padding-vertical: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

const SummaryLabel = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.textSecondary};
`;

const SummaryValue = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.primary};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.background};
`;

const ToastBanner = styled.View`
  background-color: ${colors.cancelTint};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.cancelBorder};
  padding-vertical: 10px;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ToastText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.cancelRed};
`;

export const MyShiftsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    bookedGroups,
    bookedShifts,
    totalBookedHours,
    isLoading,
    isRefreshing,
    error,
    successMessage,
    refreshShifts,
    clearError,
  } = useShifts();

  const { cancelShift, isShiftActionLoading } = useShiftActions();
  const [shiftToCancel, setShiftToCancel] = useState<Shift | null>(null);

  const handleOpenCancelModal = (shift: Shift) => {
    setShiftToCancel(shift);
  };

  const handleConfirmCancel = async () => {
    if (!shiftToCancel) return;
    const ok = await cancelShift(shiftToCancel.id);
    if (ok) {
      setShiftToCancel(null);
    }
  };

  const sections = bookedGroups.map((group) => ({
    title: group.dateHeading,
    summary: formatShiftsSummary(group.totalShifts, group.totalDurationHours),
    data: group.shifts,
  }));

  return (
    <ScreenContainer edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <AppHeader
        title="My Shifts"
        subtitle="Manage your upcoming shifts"
        onRefresh={refreshShifts}
        isRefreshing={isRefreshing}
      />

      {bookedShifts.length > 0 ? (
        <TotalSummaryBar>
          <SummaryLabel>Total Booked Time</SummaryLabel>
          <SummaryValue>
            {bookedShifts.length} {bookedShifts.length === 1 ? 'shift' : 'shifts'} (
            {formatHoursSummary(totalBookedHours)})
          </SummaryValue>
        </TotalSummaryBar>
      ) : null}

      {successMessage ? (
        <ToastBanner>
          <ToastText>{successMessage}</ToastText>
        </ToastBanner>
      ) : null}

      {error ? (
        <ErrorState
          message={error}
          onRetry={refreshShifts}
          onDismiss={clearError}
          compact
        />
      ) : null}

      <ContentWrapper>
        {isLoading && !isRefreshing ? (
          <LoadingContainer>
            <LoadingIndicator color="primary" size={38} />
          </LoadingContainer>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section: { title, summary } }) => (
              <DateSection heading={title} summary={summary} />
            )}
            renderItem={({ item }) => {
              const isActionLoading = isShiftActionLoading(item.id);

              return (
                <ShiftCard
                  shift={item}
                  status="booked"
                  isLoading={isActionLoading}
                  onCancel={() => handleOpenCancelModal(item)}
                  showCitySubtitle
                />
              );
            }}
            ListEmptyComponent={
              !isLoading ? (
                <EmptyState
                  title="No shifts booked yet"
                  description="You haven't booked any shifts yet. Browse available shifts to pick up upcoming work."
                  iconName="time-outline"
                  actionLabel="Find Available Shifts"
                  onAction={() => navigation.navigate('AvailableShifts')}
                />
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshShifts}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
            stickySectionHeadersEnabled
          />
        )}
      </ContentWrapper>

      <ConfirmationModal
        visible={shiftToCancel !== null}
        shift={shiftToCancel}
        isLoading={shiftToCancel ? isShiftActionLoading(shiftToCancel.id) : false}
        onConfirm={handleConfirmCancel}
        onDismiss={() => setShiftToCancel(null)}
      />
    </ScreenContainer>
  );
};
