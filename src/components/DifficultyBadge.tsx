import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DIFFICULTY_COLOR, DIFFICULTY_LABEL } from '../data/trails';
import { Difficulty } from '../types';

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const color = DIFFICULTY_COLOR[difficulty];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{DIFFICULTY_LABEL[difficulty]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
