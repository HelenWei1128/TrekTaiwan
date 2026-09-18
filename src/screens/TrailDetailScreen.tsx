import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { ElevationChart } from '../components/ElevationChart';
import { getTrailById, DIFFICULTY_COLOR } from '../data/trails';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { formatDuration } from '../utils/geo';

const { width } = Dimensions.get('window');

type DetailRoute = RouteProp<{ TrailDetail: { trailId: string } }, 'TrailDetail'>;

export default function TrailDetailScreen() {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<any>();
  const { isFavorite, toggleFavorite } = useAppData();
  const trail = getTrailById(route.params.trailId);

  if (!trail) {
    return (
      <View style={styles.center}>
        <Text>找不到此路線</Text>
      </View>
    );
  }

  const favorite = isFavorite(trail.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.mapWrap}>
        <MapView
          style={{ width, height: 220 }}
          initialRegion={{
            latitude: trail.path[Math.floor(trail.path.length / 2)].latitude,
            longitude: trail.path[Math.floor(trail.path.length / 2)].longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        >
          <Polyline
            coordinates={trail.path}
            strokeColor={DIFFICULTY_COLOR[trail.difficulty]}
            strokeWidth={4}
          />
          <Marker coordinate={trail.path[0]} title="起點" pinColor="#2E7D32" />
          <Marker coordinate={trail.path[trail.path.length - 1]} title="終點" pinColor="#C62828" />
        </MapView>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{trail.name}</Text>
            <Text style={styles.nameEn}>{trail.nameEn}</Text>
            <Text style={styles.region}>
              {trail.county} · {trail.region}
            </Text>
          </View>
          <Pressable onPress={() => toggleFavorite(trail.id)} hitSlop={10}>
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={28}
              color={favorite ? colors.accent : colors.textMuted}
            />
          </Pressable>
        </View>

        <View style={styles.badgeRow}>
          <DifficultyBadge difficulty={trail.difficulty} />
          {trail.permitRequired && (
            <View style={styles.permitBadge}>
              <Ionicons name="document-text-outline" size={13} color={colors.danger} />
              <Text style={styles.permitText}>需申請入山證</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <Stat label="距離" value={`${trail.distanceKm} km`} />
          <Stat label="預估時間" value={formatDuration(trail.estimatedDurationMin)} />
          <Stat label="爬升" value={`↑${trail.elevationGainM}m`} />
          <Stat label="下降" value={`↓${trail.elevationLossM}m`} />
          <Stat label="最高海拔" value={`${trail.maxElevationM}m`} />
          <Stat label="最低海拔" value={`${trail.minElevationM}m`} />
        </View>

        <Text style={styles.sectionTitle}>高度剖面</Text>
        <ElevationChart profile={trail.elevationProfile} width={width - spacing.md * 2} />

        <Text style={styles.sectionTitle}>路線介紹</Text>
        <Text style={styles.description}>{trail.description}</Text>

        <Text style={styles.sectionTitle}>建議季節</Text>
        <Text style={styles.description}>{trail.season}</Text>

        <View style={styles.tagRow}>
          {trail.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.cta}
          onPress={() =>
            navigation.navigate('記錄', { screen: 'RecordHome', params: { trailId: trail.id } })
          }
        >
          <Ionicons name="navigate" size={18} color="#fff" />
          <Text style={styles.ctaText}>開始記錄這條路線</Text>
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
  mapWrap: { backgroundColor: colors.border },
  body: { padding: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  nameEn: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  region: { fontSize: 14, color: colors.textMuted, marginTop: 6 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: spacing.md, alignItems: 'center' },
  permitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C6282822',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  permitText: { fontSize: 12, color: colors.danger, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  statBox: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 16, fontWeight: '700', color: colors.primaryDark },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  description: { fontSize: 14, color: colors.text, lineHeight: 21 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.md },
  tag: { backgroundColor: colors.border, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, color: colors.textMuted },
  cta: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
