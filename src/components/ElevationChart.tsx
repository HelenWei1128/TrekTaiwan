import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path, Polygon } from 'react-native-svg';
import { colors } from '../theme';
import { ElevationPoint } from '../types';

interface Props {
  profile: ElevationPoint[];
  width: number;
  height?: number;
}

export function ElevationChart({ profile, width, height = 120 }: Props) {
  if (profile.length < 2) return null;

  const padding = 24;
  const chartW = width - padding * 2;
  const chartH = height - padding;

  const maxDist = Math.max(...profile.map((p) => p.distanceKm));
  const minElev = Math.min(...profile.map((p) => p.elevationM));
  const maxElev = Math.max(...profile.map((p) => p.elevationM));
  const elevRange = maxElev - minElev || 1;

  const toX = (d: number) => padding + (d / maxDist) * chartW;
  const toY = (e: number) => padding / 2 + chartH - ((e - minElev) / elevRange) * chartH;

  const linePoints = profile.map((p) => `${toX(p.distanceKm)},${toY(p.elevationM)}`).join(' ');
  const areaPoints = `${toX(0)},${toY(minElev)} ${linePoints} ${toX(maxDist)},${toY(minElev)}`;
  const pathD = `M ${linePoints.split(' ').join(' L ')}`;

  return (
    <View>
      <Svg width={width} height={height}>
        <Line
          x1={padding}
          y1={padding / 2 + chartH}
          x2={width - padding}
          y2={padding / 2 + chartH}
          stroke={colors.border}
          strokeWidth={1}
        />
        <Polygon points={areaPoints} fill={`${colors.primary}22`} />
        <Path d={pathD} stroke={colors.primary} strokeWidth={2} fill="none" />
      </Svg>
      <View style={styles.labelsRow}>
        <Text style={styles.label}>{minElev}m</Text>
        <Text style={styles.label}>最高 {maxElev}m</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
