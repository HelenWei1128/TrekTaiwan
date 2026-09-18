import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { formatDurationSec } from '../utils/geo';
import { getTrailById } from '../data/trails';

const { width } = Dimensions.get('window');

type DetailRoute = RouteProp<{ TrackDetail: { trackId: string } }, 'TrackDetail'>;

export default function TrackDetailScreen() {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<any>();
  const { savedTracks, deleteSavedTrack } = useAppData();
  const track = savedTracks.find((t) => t.id === route.params.trackId);

  if (!track) {
    return (
      <View style={styles.center}>
        <Text>找不到此記錄</Text>
      </View>
    );
  }

  const linkedTrail = track.linkedTrailId ? getTrailById(track.linkedTrailId) : undefined;

  const handleDelete = () => {
    Alert.alert('刪除記錄', `確定要刪除「${track.name}」嗎？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: () => {
          deleteSavedTrack(track.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      {track.points.length > 0 && (
        <MapView
          style={{ width, height: 240 }}
          initialRegion={{
            latitude: track.points[0].latitude,
            longitude: track.points[0].longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          <Polyline coordinates={track.points} strokeColor={colors.primary} strokeWidth={4} />
          <Marker coordinate={track.points[0]} pinColor="#2E7D32" title="起點" />
          <Marker coordinate={track.points[track.points.length - 1]} pinColor="#C62828" title="終點" />
        </MapView>
      )}

      <View style={styles.body}>
        <Text style={styles.name}>{track.name}</Text>
        <Text style={styles.date}>
          {new Date(track.startedAt).toLocaleString('zh-TW')}
        </Text>
        {linkedTrail && <Text style={styles.linked}>路線：{linkedTrail.name}</Text>}

        <View style={styles.statsGrid}>
          <Stat label="距離" value={`${track.distanceKm} km`} />
          <Stat label="時間" value={formatDurationSec(track.durationSec)} />
          <Stat label="爬升" value={`${track.elevationGainM} m`} />
        </View>

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.deleteText}>刪除這筆記錄</Text>
        </Pressable>
      </View>
    </ScrollView>
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
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: spacing.md },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  date: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  linked: { fontSize: 13, color: colors.primaryDark, marginTop: 4, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
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
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xl,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteText: { color: colors.danger, fontWeight: '700' },
});
