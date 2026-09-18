import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DIFFICULTY_LABEL, TRAILS } from '../data/trails';
import { TrailCard } from '../components/TrailCard';
import { useAppData } from '../context/AppDataContext';
import { TrailsStackParamList } from '../navigation/RootNavigator';
import { colors, spacing } from '../theme';
import { Difficulty } from '../types';

const DIFFICULTY_FILTERS: Difficulty[] = ['easy', 'moderate', 'hard', 'expert'];

export default function TrailListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<TrailsStackParamList>>();
  const { isFavorite, toggleFavorite } = useAppData();
  const [query, setQuery] = useState('');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    return TRAILS.filter((t) => {
      const matchesQuery =
        query.trim().length === 0 ||
        t.name.includes(query) ||
        t.region.includes(query) ||
        t.county.includes(query);
      const matchesDifficulty = !activeDifficulty || t.difficulty === activeDifficulty;
      return matchesQuery && matchesDifficulty;
    });
  }, [query, activeDifficulty]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>路線</Text>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜尋步道名稱或地區"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, !activeDifficulty && styles.filterChipActive]}
          onPress={() => setActiveDifficulty(null)}
        >
          <Text style={[styles.filterText, !activeDifficulty && styles.filterTextActive]}>
            全部
          </Text>
        </Pressable>
        {DIFFICULTY_FILTERS.map((d) => (
          <Pressable
            key={d}
            style={[styles.filterChip, activeDifficulty === d && styles.filterChipActive]}
            onPress={() => setActiveDifficulty(d === activeDifficulty ? null : d)}
          >
            <Text style={[styles.filterText, activeDifficulty === d && styles.filterTextActive]}>
              {DIFFICULTY_LABEL[d]}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>找不到符合條件的步道</Text>}
        renderItem={({ item }) => (
          <TrailCard
            trail={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('TrailDetail', { trailId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md },
  header: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, marginTop: spacing.sm },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  listContent: { paddingBottom: spacing.xl },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
});
