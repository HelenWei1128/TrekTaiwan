import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { SavedTrack, TrackPoint } from '../types';
import { formatDurationSec, haversineDistanceM } from '../utils/geo';

type Status = 'idle' | 'recording' | 'paused' | 'finished';

export default function RecordScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addSavedTrack, savedTracks } = useAppData();

  const [status, setStatus] = useState<Status>('idle');
  const [points, setPoints] = useState<TrackPoint[]>([]);
  const [distanceM, setDistanceM] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [trackName, setTrackName] = useState('');

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);
  const lastAltitudeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      watchRef.current?.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const handleStart = async () => {
    const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
    if (permStatus !== 'granted') {
      setPermissionError('需要定位權限才能記錄路徑，請至系統設定開啟。');
      return;
    }
    setPermissionError(null);
    setPoints([]);
    setDistanceM(0);
    setElevationGain(0);
    setElapsedSec(0);
    lastAltitudeRef.current = null;
    startedAtRef.current = Date.now();
    setStatus('recording');
    startTimer();

    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5, timeInterval: 3000 },
      (loc) => {
        const point: TrackPoint = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
          altitude: loc.coords.altitude,
          speed: loc.coords.speed,
        };
        setPoints((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            setDistanceM((d) => d + haversineDistanceM(last, point));
          }
          return [...prev, point];
        });
        if (loc.coords.altitude != null) {
          if (lastAltitudeRef.current != null && loc.coords.altitude > lastAltitudeRef.current) {
            setElevationGain((g) => g + (loc.coords.altitude! - lastAltitudeRef.current!));
          }
          lastAltitudeRef.current = loc.coords.altitude;
        }
      }
    );
  };

  const handlePauseResume = () => {
    if (status === 'recording') {
      watchRef.current?.remove();
      stopTimer();
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('recording');
      startTimer();
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5, timeInterval: 3000 },
        (loc) => {
          const point: TrackPoint = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: loc.timestamp,
            altitude: loc.coords.altitude,
            speed: loc.coords.speed,
          };
          setPoints((prev) => {
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              setDistanceM((d) => d + haversineDistanceM(last, point));
            }
            return [...prev, point];
          });
        }
      ).then((sub) => {
        watchRef.current = sub;
      });
    }
  };

  const handleStop = () => {
    watchRef.current?.remove();
    stopTimer();
    setStatus('finished');
    setTrackName(`健行記錄 ${new Date().toLocaleDateString('zh-TW')}`);
    setNameModalVisible(true);
  };

  const handleSave = () => {
    const track: SavedTrack = {
      id: `${Date.now()}`,
      name: trackName || '未命名記錄',
      startedAt: startedAtRef.current,
      finishedAt: Date.now(),
      points,
      distanceKm: Math.round((distanceM / 1000) * 100) / 100,
      elevationGainM: Math.round(elevationGain),
      durationSec: elapsedSec,
      linkedTrailId: route.params?.trailId,
    };
    addSavedTrack(track);
    setNameModalVisible(false);
    setStatus('idle');
    navigation.navigate('TrackDetail', { trackId: track.id });
  };

  const handleDiscard = () => {
    setNameModalVisible(false);
    setStatus('idle');
    setPoints([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>記錄健行</Text>
      <View style={styles.mapBox}>
        {points.length > 0 ? (
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: points[0].latitude,
              longitude: points[0].longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Polyline coordinates={points} strokeColor={colors.primary} strokeWidth={4} />
            <Marker coordinate={points[0]} pinColor="#2E7D32" title="起點" />
            <Marker coordinate={points[points.length - 1]} pinColor={colors.accent} title="目前位置" />
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="walk-outline" size={40} color={colors.textMuted} />
            <Text style={styles.placeholderText}>按下開始以記錄你的路徑</Text>
          </View>
        )}
      </View>

      {permissionError && <Text style={styles.errorText}>{permissionError}</Text>}

      <View style={styles.statsRow}>
        <Stat label="距離" value={`${(distanceM / 1000).toFixed(2)} km`} />
        <Stat label="時間" value={formatDurationSec(elapsedSec)} />
        <Stat label="爬升" value={`${Math.round(elevationGain)} m`} />
      </View>

      <View style={styles.controls}>
        {status === 'idle' && (
          <Pressable style={[styles.controlBtn, styles.startBtn]} onPress={handleStart}>
            <Ionicons name="play" size={22} color="#fff" />
            <Text style={styles.controlText}>開始</Text>
          </Pressable>
        )}
        {(status === 'recording' || status === 'paused') && (
          <>
            <Pressable style={[styles.controlBtn, styles.pauseBtn]} onPress={handlePauseResume}>
              <Ionicons name={status === 'recording' ? 'pause' : 'play'} size={22} color="#fff" />
              <Text style={styles.controlText}>{status === 'recording' ? '暫停' : '繼續'}</Text>
            </Pressable>
            <Pressable style={[styles.controlBtn, styles.stopBtn]} onPress={handleStop}>
              <Ionicons name="stop" size={22} color="#fff" />
              <Text style={styles.controlText}>結束</Text>
            </Pressable>
          </>
        )}
      </View>

      {status === 'idle' && savedTracks.length > 0 && (
        <>
          <Text style={styles.historyTitle}>過去的記錄</Text>
          <FlatList
            data={savedTracks}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            renderItem={({ item }) => (
              <Pressable
                style={styles.historyItem}
                onPress={() => navigation.navigate('TrackDetail', { trackId: item.id })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyName}>{item.name}</Text>
                  <Text style={styles.historyMeta}>
                    {new Date(item.startedAt).toLocaleDateString('zh-TW')} · {item.distanceKm} km ·{' '}
                    {formatDurationSec(item.durationSec)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          />
        </>
      )}

      <Modal visible={nameModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>儲存這次記錄？</Text>
            <TextInput
              style={styles.modalInput}
              value={trackName}
              onChangeText={setTrackName}
              placeholder="為這次健行命名"
            />
            <View style={styles.modalRow}>
              <Pressable style={styles.modalBtnSecondary} onPress={handleDiscard}>
                <Text style={styles.modalBtnSecondaryText}>捨棄</Text>
              </Pressable>
              <Pressable style={styles.modalBtnPrimary} onPress={handleSave}>
                <Text style={styles.modalBtnPrimaryText}>儲存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md },
  header: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, marginTop: spacing.sm },
  mapBox: {
    marginTop: spacing.md,
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeholderText: { color: colors.textMuted, fontSize: 13 },
  errorText: { color: colors.danger, marginTop: spacing.sm, fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.primaryDark },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  controls: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, justifyContent: 'center' },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  startBtn: { backgroundColor: colors.primary },
  pauseBtn: { backgroundColor: colors.accent },
  stopBtn: { backgroundColor: colors.danger },
  controlText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalBox: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, width: '100%' },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  modalRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  modalBtnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalBtnSecondaryText: { color: colors.textMuted, fontWeight: '600' },
  modalBtnPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: colors.primary },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '700' },
  historyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyName: { fontSize: 15, fontWeight: '700', color: colors.text },
  historyMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
