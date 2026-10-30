import { activityData, ActivityCard } from '../../home/data/home.data';
import StorageService, {
  UserActivitiesType,
  UserRewardsType,
} from '../../../services/mmkv.service';
import StatsService, {
  ActivityStatsType,
  EMPTY_ACTIVITY_STATS,
  getDayKey,
  ProfileStatsType,
} from '../../../services/stats.service';
import { getProfileKey } from '../../../services/profile.service';
import { STORAGE_KEYS } from '../../../config/constants';

// below this many answers the accuracy is too noisy to call a strength or weakness
const MIN_ANSWERS_FOR_INSIGHT = 5;
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export interface ActivityReportType {
  id: string;
  card: ActivityCard;
  progress: number;
  hasTrophy: boolean;
  stats: ActivityStatsType;
  accuracy: number | null;
}

export interface DayBarType {
  key: string;
  label: string;
  isToday: boolean;
  minutes: number;
  stars: number;
}

export interface KidReportType {
  rewards: UserRewardsType;
  activities: ActivityReportType[];
  week: DayBarType[];
  totalTime: number;
  accuracy: number | null;
  activeDays: number;
  strongest: ActivityReportType | null;
  needsPractice: ActivityReportType | null;
  notTried: ActivityReportType[];
}

const getAccuracy = (correct: number, wrong: number) =>
  correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : null;

const getWeek = (stats: ProfileStatsType): DayBarType[] =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = getDayKey(date);
    const day = stats.daily[key];
    return {
      key,
      label: DAY_LABELS[date.getDay()],
      isToday: index === 6,
      minutes: Math.round((day?.timeSpent ?? 0) / 60),
      stars: day?.stars ?? 0,
    };
  });

// everything the dashboard shows for one kid, read straight from storage
export const getKidReport = (profileId: string): KidReportType => {
  const rewards = StorageService.getRewards(
    getProfileKey(STORAGE_KEYS.REWARDS, profileId),
  );
  const progress: UserActivitiesType = StorageService.getUserPerformance(
    getProfileKey(STORAGE_KEYS.USER_PERFORMANCE, profileId),
  );
  const stats = StatsService.getStats(profileId);

  const activities = activityData
    .filter(castle => castle.innerCard.navigate)
    .map(castle => {
      const id = castle.innerCard.navigate!.toLowerCase();
      const activityStats = stats.activities[id] ?? EMPTY_ACTIVITY_STATS;
      return {
        id,
        card: castle.innerCard,
        progress: progress[id as keyof UserActivitiesType] ?? 0,
        hasTrophy: rewards.trophies.includes(id),
        stats: activityStats,
        accuracy: getAccuracy(activityStats.correct, activityStats.wrong),
      };
    });

  const totals = activities.reduce(
    (sum, activity) => ({
      time: sum.time + activity.stats.timeSpent,
      correct: sum.correct + activity.stats.correct,
      wrong: sum.wrong + activity.stats.wrong,
    }),
    { time: 0, correct: 0, wrong: 0 },
  );

  const rated = activities
    .filter(
      activity =>
        activity.stats.correct + activity.stats.wrong >=
        MIN_ANSWERS_FOR_INSIGHT,
    )
    .sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0));
  const weakest = rated[rated.length - 1];
  const week = getWeek(stats);

  return {
    rewards,
    activities,
    week,
    totalTime: totals.time,
    accuracy: getAccuracy(totals.correct, totals.wrong),
    activeDays: week.filter(day => day.minutes > 0 || day.stars > 0).length,
    strongest: rated[0] ?? null,
    needsPractice:
      rated.length > 1 && weakest && (weakest.accuracy ?? 100) < 80
        ? weakest
        : null,
    // progress and trophies from before stats tracking also count as tried
    notTried: activities.filter(
      activity =>
        activity.stats.plays === 0 &&
        activity.progress === 0 &&
        !activity.hasTrophy,
    ),
  };
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return seconds > 0 ? '<1m' : '0m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
};

export const formatLastPlayed = (timestamp: number) => {
  if (!timestamp) return 'Not played yet';
  const today = new Date();
  const played = new Date(timestamp);
  const dayDiff = Math.round(
    (new Date(today.toDateString()).getTime() -
      new Date(played.toDateString()).getTime()) /
      86400000,
  );
  if (dayDiff <= 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return `${dayDiff} days ago`;
  return `${MONTH_LABELS[played.getMonth()]} ${played.getDate()}`;
};
