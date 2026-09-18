import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

function Row({ icon, title, subtitle }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.primary} style={{ width: 28 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Text style={styles.header}>設定</Text>

        <Text style={styles.sectionTitle}>關於 TrekTaiwan</Text>
        <View style={styles.card}>
          <Text style={styles.about}>
            TrekTaiwan 是一款專為台灣登山健行愛好者設計的路線探索與 GPS
            記錄工具，收錄全台各地知名步道資訊，協助你規劃行程、掌握路線難度與海拔變化，並記錄每一次的健行足跡。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>權限說明</Text>
        <View style={styles.card}>
          <Row
            icon="location-outline"
            title="定位權限"
            subtitle="用於顯示地圖上的目前位置，以及記錄健行時的 GPS 路徑"
          />
        </View>

        <Text style={styles.sectionTitle}>資料來源與免責聲明</Text>
        <View style={styles.card}>
          <Text style={styles.about}>
            步道資訊與座標為概略整理，僅供行程規劃參考，實際路況請以林務局、國家公園管理處等主管機關公告與現場標示為準。高風險路線（百岳、需申請入山證路段）請務必事先申請許可、確認天候並衡量自身體能與裝備再行前往。
          </Text>
        </View>

        <Text style={styles.sectionTitle}>版本資訊</Text>
        <View style={styles.card}>
          <Row icon="information-circle-outline" title="版本" subtitle="1.0.0" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md },
  header: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, marginTop: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  about: { fontSize: 13, color: colors.text, lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
