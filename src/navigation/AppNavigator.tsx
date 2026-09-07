import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import LearnScreen from '../screens/LearnScreen';
import TopicDetailScreen from '../screens/TopicDetailScreen';

export type LearnStackParamList = {
  LearnMain: undefined;
  TopicDetail: { topicId: string };
};

export type MainTabParamList = {
  CryptoLab: undefined;
  LearnTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const LearnStack = createNativeStackNavigator<LearnStackParamList>();

function LearnStackNavigator() {
  return (
    <LearnStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <LearnStack.Screen name="LearnMain" component={LearnScreen} />
      <LearnStack.Screen name="TopicDetail" component={TopicDetailScreen} />
    </LearnStack.Navigator>
  );
}

interface TabBarIconProps {
  name: 'lab' | 'learn';
  focused: boolean;
  color: string;
}

function TabBarIcon({ name, focused, color }: TabBarIconProps) {
  const iconName =
    name === 'lab'
      ? focused
        ? 'shield-checkmark'
        : 'shield-checkmark-outline'
      : focused
      ? 'school'
      : 'school-outline';

  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeIndicator} />}
      <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
        <Ionicons name={iconName} size={20} color={color} />
      </View>
    </View>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#34D399',
        tabBarInactiveTintColor: '#71717A',
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tab.Screen
        name="CryptoLab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Crypto Lab',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="lab" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LearnTab"
        component={LearnStackNavigator}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="learn" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#09090B',
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    top: -4,
    width: 28,
    height: 3,
    backgroundColor: '#34D399',
    borderRadius: 2,
  },
  iconWrapper: {
    width: 42,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  iconWrapperFocused: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
  },
});

export default AppNavigator;
