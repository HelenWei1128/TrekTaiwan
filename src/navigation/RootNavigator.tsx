import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../theme';
import { Trail, SavedTrack } from '../types';

import MapScreen from '../screens/MapScreen';
import TrailListScreen from '../screens/TrailListScreen';
import TrailDetailScreen from '../screens/TrailDetailScreen';
import RecordScreen from '../screens/RecordScreen';
import TrackDetailScreen from '../screens/TrackDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type TrailsStackParamList = {
  TrailList: undefined;
  TrailDetail: { trailId: string };
};

export type MapStackParamList = {
  MapHome: undefined;
  TrailDetail: { trailId: string };
};

export type RecordStackParamList = {
  RecordHome: undefined;
  TrackDetail: { trackId: string };
  TrailDetail: { trailId: string };
};

export type FavoritesStackParamList = {
  FavoritesHome: undefined;
  TrailDetail: { trailId: string };
};

const TrailsStack = createNativeStackNavigator<TrailsStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
const RecordStack = createNativeStackNavigator<RecordStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();
const Tab = createBottomTabNavigator();

function MapStackNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="MapHome" component={MapScreen} />
      <MapStack.Screen
        name="TrailDetail"
        component={TrailDetailScreen}
        options={{ headerShown: true, title: '' }}
      />
    </MapStack.Navigator>
  );
}

function TrailsStackNavigator() {
  return (
    <TrailsStack.Navigator screenOptions={{ headerShown: false }}>
      <TrailsStack.Screen name="TrailList" component={TrailListScreen} />
      <TrailsStack.Screen
        name="TrailDetail"
        component={TrailDetailScreen}
        options={{ headerShown: true, title: '' }}
      />
    </TrailsStack.Navigator>
  );
}

function RecordStackNavigator() {
  return (
    <RecordStack.Navigator screenOptions={{ headerShown: false }}>
      <RecordStack.Screen name="RecordHome" component={RecordScreen} />
      <RecordStack.Screen
        name="TrackDetail"
        component={TrackDetailScreen}
        options={{ headerShown: true, title: '記錄詳情' }}
      />
      <RecordStack.Screen
        name="TrailDetail"
        component={TrailDetailScreen}
        options={{ headerShown: true, title: '' }}
      />
    </RecordStack.Navigator>
  );
}

function FavoritesStackNavigator() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="FavoritesHome" component={FavoritesScreen} />
      <FavoritesStack.Screen
        name="TrailDetail"
        component={TrailDetailScreen}
        options={{ headerShown: true, title: '' }}
      />
    </FavoritesStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              地圖: 'map',
              路線: 'trail-sign',
              記錄: 'walk',
              收藏: 'heart',
              設定: 'settings-outline',
            };
            const name = icons[route.name] ?? 'ellipse';
            return <Ionicons name={name} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="地圖" component={MapStackNavigator} />
        <Tab.Screen name="路線" component={TrailsStackNavigator} />
        <Tab.Screen name="記錄" component={RecordStackNavigator} />
        <Tab.Screen name="收藏" component={FavoritesStackNavigator} />
        <Tab.Screen name="設定" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
