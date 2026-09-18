import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrailCard } from '../components/TrailCard';
import { getTrailById } from '../data/trails';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { favorites, isFavorite, toggleFavorite } = useAppData();

  const trails = useMemo(
    () => favorites.map((id) => getTrailById(id)).filter((t): t is NonNullable<typeof t> => !!t),
    [favorites]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>收藏</Text>
      <FlatList
        data={trails}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>還沒有收藏的路線</Text>
            <Text style={styles.emptySub}>在路線列表點選愛心即可加入收藏</Text>
          </View>
        }
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
  header: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, marginTop: spacing.sm, marginBottom: spacing.md },
  listContent: { paddingBottom: spacing.xl },
  empty: { alignItems: 'center', marginTop: spacing.xl * 2 },
  emptyText: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
});
