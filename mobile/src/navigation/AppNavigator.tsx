import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { AvailableShiftsScreen } from '../screens/AvailableShiftsScreen';
import { MyShiftsScreen } from '../screens/MyShiftsScreen';
import { useShifts } from '../hooks/useShifts';

export type RootTabParamList = {
  MyShifts: undefined;
  AvailableShifts: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator: React.FC = () => {
  const { bookedShifts } = useShifts();
  const bookedCount = bookedShifts.length;

  return (
    <Tab.Navigator
      initialRouteName="AvailableShifts"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: typography.sizes.sm,
          fontWeight: typography.weights.semibold,
        },
      }}
    >
      <Tab.Screen
        name="MyShifts"
        component={MyShiftsScreen}
        options={{
          tabBarLabel: 'My shifts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size - 2} color={color} />
          ),
          tabBarBadge: bookedCount > 0 ? bookedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: 10,
            lineHeight: 14,
          },
        }}
      />
      <Tab.Screen
        name="AvailableShifts"
        component={AvailableShiftsScreen}
        options={{
          tabBarLabel: 'Available shifts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size - 2} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
