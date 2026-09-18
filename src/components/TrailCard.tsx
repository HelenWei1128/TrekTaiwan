import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Trail } from '../types';
import { formatDuration } from '../utils/geo';
import { DifficultyBadge } from './DifficultyBadge';

interface Props {
  trail: Trail;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function TrailCard({ trail, onPress, isFavorite, onToggleFavorite }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{trail.name}</Text>
          <Text style={styles.subtitle}>{trail.region}</Text>
        </View>
        <Pressable hitSlop={10} onPress={onToggleFavorite}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? colors.accent : colors.textMuted}
          />
        </Pressable>
      </View>
      <View style={styles.metaRow}>
        <DifficultyBadge difficulty={trail.difficulty} />
        <Text style={styles.meta}>{trail.distanceKm} 公里</Text>
        <Text style={styles.meta}>↑{trail.elevationGainM}m</Text>
        <Text style={styles.meta}>{formatDuration(trail.estimatedDurationMin)}</Text>
      </View>
      {trail.permitRequired && (
        <View style={styles.permitRow}>
          <Ionicons name="document-text-outline" size={14} color={colors.danger} />
          <Text style={styles.permitText}>需申請入山證</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  permitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  permitText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
});
