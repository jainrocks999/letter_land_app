import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { DayBarType } from '../data/dashboard.helpers';

interface WeeklyChartProps {
  week: DayBarType[];
  color: string;
}

type ChartMode = 'minutes' | 'stars';

const BAR_MAX_HEIGHT = 110;

const WeeklyChart: React.FC<WeeklyChartProps> = ({ week, color }) => {
  const [mode, setMode] = useState<ChartMode>('minutes');
  const values = week.map(day => day[mode]);
  const maxValue = Math.max(...values, 1);
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Last 7 days</Text>
          <Text style={styles.subText}>
            {mode === 'minutes'
              ? `${total} min of learning`
              : `${total} stars earned`}
          </Text>
        </View>
        <View style={styles.toggle}>
          {(['minutes', 'stars'] as ChartMode[]).map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setMode(item)}
              style={[styles.toggleChip, item === mode && styles.toggleActive]}
            >
              <Text
                style={[
                  styles.toggleText,
                  item === mode && styles.toggleTextActive,
                ]}
              >
                {item === 'minutes' ? '⏱ Time' : '⭐ Stars'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chart}>
        {week.map(day => {
          const value = day[mode];
          return (
            <View key={day.key} style={styles.column}>
              <Text style={styles.value}>{value > 0 ? value : ''}</Text>
              <Animated.View
                key={mode}
                entering={FadeIn.duration(300)}
                style={[
                  styles.bar,
                  {
                    height: Math.max(
                      (value / maxValue) * BAR_MAX_HEIGHT,
                      value > 0 ? 6 : 3,
                    ),
                    backgroundColor: value > 0 ? color : '#e6dcc6',
                  },
                ]}
              />
              <Text style={[styles.day, day.isToday && styles.today]}>
                {day.isToday ? 'Today' : day.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default WeeklyChart;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: '#f3d27a',
    borderWidth: 1.5,
    borderBottomWidth: 5,
    borderRadius: 18,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 17,
    color: '#1a105f',
  },
  subText: {
    fontFamily: 'Fredoka-Medium',
    fontSize: 12,
    color: '#9e9e9e',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#fbf4e4',
    borderRadius: 999,
    padding: 3,
  },
  toggleChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  toggleActive: { backgroundColor: '#1a105f' },
  toggleText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 12,
    color: '#8c662e',
  },
  toggleTextActive: { color: '#fff' },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  column: { flex: 1, alignItems: 'center', gap: 4 },
  value: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 11,
    color: '#8c662e',
  },
  bar: { width: '55%', borderRadius: 8 },
  day: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 11,
    color: '#9e9e9e',
  },
  today: { color: '#1a105f' },
});
