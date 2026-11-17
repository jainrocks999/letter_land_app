import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProgressBar from '../../../components/progressBar/ProgressBar';
import {
  ActivityReportType,
  formatDuration,
  formatLastPlayed,
} from '../data/dashboard.helpers';
import { isTablet, rf } from '../../../utils/responsive';

interface ActivityReportCardProps {
  activity: ActivityReportType;
}

const tablet = isTablet();

const ActivityReportCard: React.FC<ActivityReportCardProps> = ({
  activity,
}) => {
  const { card, stats, progress, accuracy, hasTrophy } = activity;
  const details = [
    { label: 'Played', value: `${stats.plays}×` },
    { label: 'Finished', value: `${stats.completions}×` },
    { label: 'Accuracy', value: accuracy === null ? '–' : `${accuracy}%` },
    { label: 'Time', value: formatDuration(stats.timeSpent) },
  ];

  return (
    <View style={[styles.card, { borderColor: card.lightColor }]}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: `${card.lightColor}88`,
              borderColor: card.darkColor,
            },
          ]}
        >
          <Text style={styles.icon}>{card.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>
            {card.cardTitle} {hasTrophy ? '🏆' : ''}
          </Text>
          <Text style={styles.subText}>
            {formatLastPlayed(stats.lastPlayed)}
          </Text>
        </View>
        <Text style={styles.percent}>{Math.round(progress)}%</Text>
      </View>

      <ProgressBar progress={progress} />

      <View style={styles.details}>
        {details.map(detail => (
          <View key={detail.label} style={styles.detail}>
            <Text style={styles.detailValue}>{detail.value}</Text>
            <Text style={styles.detailLabel}>{detail.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ActivityReportCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderBottomWidth: rf(5),
    borderRadius: rf(18),
    padding: rf(14),
    gap: rf(10),
    marginBottom:tablet ? 10 :0
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: rf(tablet ? 50 : 44),
    height: rf(tablet ? 50 : 44),
    borderRadius: rf(12),
    borderWidth: rf(1),
    borderBottomWidth: rf(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: rf(22) },
  info: { flex: 1 },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(16),
    color: '#1a105f',
  },
  subText: {
    fontFamily: 'Fredoka-Medium',
    fontSize: rf(12),
    color: '#9e9e9e',
  },
  percent: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(18),
    color: '#1ca952',
  },
  details: {
    flexDirection: 'row',
    backgroundColor: '#fbf4e4',
    borderRadius: rf(12),
    paddingVertical: rf(8),
  },
  detail: { flex: 1, alignItems: 'center' },
  detailValue: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 18 : 15),
    color: '#1a105f',
  },
  detailLabel: {
    fontFamily: 'Fredoka-Medium',
    fontSize: rf(11),
    color: '#8c662e',
  },
});
