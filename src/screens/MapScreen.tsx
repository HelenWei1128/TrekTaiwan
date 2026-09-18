import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { colors } from '../theme';
import { DIFFICULTY_COLOR } from '../data/trails';
import { TRAILS } from '../data/trails';
import { MapStackParamList } from '../navigation/RootNavigator';

const TAIWAN_REGION = {
  latitude: 23.7,
  longitude: 121.0,
  latitudeDelta: 4.2,
  longitudeDelta: 3.2,
};

export default function MapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={TAIWAN_REGION}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {TRAILS.map((trail) => (
          <React.Fragment key={trail.id}>
            <Polyline
              coordinates={trail.path}
              strokeColor={DIFFICULTY_COLOR[trail.difficulty]}
              strokeWidth={3}
            />
            <Marker
              coordinate={trail.path[0]}
              title={trail.name}
              description={`${trail.distanceKm} 公里 · ${trail.region}`}
              pinColor={DIFFICULTY_COLOR[trail.difficulty]}
              onCalloutPress={() => navigation.navigate('TrailDetail', { trailId: trail.id })}
            />
          </React.Fragment>
        ))}
      </MapView>
      <View style={styles.header}>
        <Text style={styles.title}>TrekTaiwan</Text>
        <Text style={styles.subtitle}>探索台灣步道 · 點選路線圖示查看詳情</Text>
      </View>
      {permissionDenied && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            未取得定位權限，僅顯示步道資訊。可至系統設定開啟定位以顯示目前位置。
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  banner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: colors.danger,
    borderRadius: 10,
    padding: 10,
  },
  bannerText: {
    color: '#fff',
    fontSize: 12,
  },
});
