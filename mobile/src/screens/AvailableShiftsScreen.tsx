import React, { useState } from 'react';
import { SectionList, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { colors } from '../theme/colors';
import { useShifts } from '../hooks/useShifts';
import { useShiftActions } from '../hooks/useShiftActions';
import { AppHeader } from '../components/AppHeader';
import { CityFilter } from '../components/CityFilter';
import { DateSection } from '../components/DateSection';
import { ShiftCard } from '../components/ShiftCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Shift } from '../types/shift';
import { getShiftStatus } from '../utils/shiftUtils';
import { formatShiftsSummary } from '../utils/dateUtils';

const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.View`
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.background};
`;

const ToastBanner = styled.View`
  background-color: ${colors.bookTint};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.bookBorder};
  padding-vertical: 10px;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ToastText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.bookGreen};
`;

export const AvailableShiftsScreen: React.FC = () => {
  const {
    availableGroups,
    bookedShifts,
    selectedCity,
    isLoading,
    isRefreshing,
    error,
    successMessage,
    cityCounts,
    setSelectedCity,
    refreshShifts,
    fetchShifts,
    clearError,
  } = useShifts();

  const { bookShift, cancelShift, isShiftActionLoading } = useShiftActions();
  const [shiftToCancel, setShiftToCancel] = useState<Shift | null>(null);

  const handleBook = async (shift: Shift) => {
    await bookShift(shift.id);
  };

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

  const sections = availableGroups.map((group) => ({
    title: group.dateHeading,
    summary: formatShiftsSummary(group.totalShifts, group.totalDurationHours),
    data: group.shifts,
  }));

  return (
    <ScreenContainer edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <AppHeader
        title="Available Shifts"
        subtitle="Browse and book upcoming shifts"
        onRefresh={refreshShifts}
        isRefreshing={isRefreshing}
      />

      <CityFilter
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        cityCounts={cityCounts}
      />

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
              const status = getShiftStatus(item, bookedShifts);
              const isActionLoading = isShiftActionLoading(item.id);

              return (
                <ShiftCard
                  shift={item}
                  status={status}
                  isLoading={isActionLoading}
                  onBook={() => handleBook(item)}
                  onCancel={() => handleOpenCancelModal(item)}
                  showCitySubtitle={selectedCity === 'All'}
                />
              );
            }}
            ListEmptyComponent={
              !isLoading ? (
                <EmptyState
                  title="No available shifts found"
                  description={
                    selectedCity === 'All'
                      ? 'There are currently no shifts open for booking.'
                      : `No shifts currently available in ${selectedCity}. Try selecting All Cities.`
                  }
                  iconName="briefcase-outline"
                  actionLabel={selectedCity !== 'All' ? 'View All Cities' : 'Refresh Shifts'}
                  onAction={
                    selectedCity !== 'All'
                      ? () => setSelectedCity('All')
                      : refreshShifts
                  }
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
