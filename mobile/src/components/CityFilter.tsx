import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { CityFilterOption } from '../types/shift';

interface CityFilterProps {
  selectedCity: CityFilterOption;
  onSelectCity: (city: CityFilterOption) => void;
  cityCounts: Record<CityFilterOption, number>;
}

const FilterContainer = styled.View`
  background-color: ${colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
  padding-vertical: ${spacing.md}px;
  padding-horizontal: ${spacing.md}px;
`;

const ScrollWrapper = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
})``;

const TabButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding-horizontal: ${spacing.md}px;
  padding-vertical: ${spacing.xs}px;
  margin-right: ${spacing.sm}px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.isSelected ? colors.primaryLight : 'transparent'};
`;

const TabText = styled.Text<{ isSelected: boolean }>`
  font-size: ${typography.sizes.base}px;
  font-weight: ${(props) =>
    props.isSelected ? typography.weights.bold : typography.weights.medium};
  color: ${(props) => (props.isSelected ? colors.primary : colors.textSecondary)};
`;

const CITIES: CityFilterOption[] = ['All', 'Helsinki', 'Tampere', 'Turku'];

export const CityFilter: React.FC<CityFilterProps> = ({
  selectedCity,
  onSelectCity,
  cityCounts,
}) => {
  return (
    <FilterContainer>
      <ScrollWrapper>
        {CITIES.map((city) => {
          const isSelected = selectedCity === city;
          const count = cityCounts[city] ?? 0;
          const label = `${city === 'All' ? 'All' : city} (${count})`;

          return (
            <TabButton
              key={city}
              isSelected={isSelected}
              onPress={() => onSelectCity(city)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter by ${city}, ${count} shifts available`}
            >
              <TabText isSelected={isSelected}>{label}</TabText>
            </TabButton>
          );
        })}
      </ScrollWrapper>
    </FilterContainer>
  );
};
