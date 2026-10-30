import { storage } from './mmkv.service';
import { STORAGE_KEYS } from '../config/constants';
import { getProfileKey } from './profile.service';

export interface ActivityStatsType {
  plays: number;
  completions: number;
  correct: number;
  wrong: number;
  starsEarned: number;
  timeSpent: number; // seconds
  lastPlayed: number; // ms timestamp, 0 = never
}

export interface DailyStatsType {
  timeSpent: number; // seconds
  stars: number;
}

export interface ProfileStatsType {
  activities: Record<string, ActivityStatsType>;
  daily: Record<string, DailyStatsType>;
}

export const EMPTY_ACTIVITY_STATS: ActivityStatsType = {
  plays: 0,
  completions: 0,
  correct: 0,
  wrong: 0,
  starsEarned: 0,
  timeSpent: 0,
  lastPlayed: 0,
};

const EMPTY_STATS: ProfileStatsType = { activities: {}, daily: {} };
const KEEP_DAYS = 30;

// local calendar day, so "today" matches the parent's clock
export const getDayKey = (date: Date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;

const getStatsKey = (profileId: string) =>
  getProfileKey(STORAGE_KEYS.STATS, profileId);

const pruneDaily = (daily: Record<string, DailyStatsType>) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - KEEP_DAYS);
  const cutoffKey = getDayKey(cutoff);
  return Object.fromEntries(
    Object.entries(daily).filter(([day]) => day >= cutoffKey),
  );
};

const updateStats = (
  profileId: string,
  activityId: string,
  changes: Partial<ActivityStatsType>,
  dailyChanges?: Partial<DailyStatsType>,
) => {
  const stats = StatsService.getStats(profileId);
  const activity = stats.activities[activityId] ?? EMPTY_ACTIVITY_STATS;
  const updatedActivity = { ...activity };
  (Object.keys(changes) as (keyof ActivityStatsType)[]).forEach(field => {
    updatedActivity[field] =
      field === 'lastPlayed'
        ? changes[field] ?? activity[field]
        : activity[field] + (changes[field] ?? 0);
  });

  let daily = stats.daily;
  if (dailyChanges) {
    const today = getDayKey();
    const day = daily[today] ?? { timeSpent: 0, stars: 0 };
    daily = pruneDaily({
      ...daily,
      [today]: {
        timeSpent: day.timeSpent + (dailyChanges.timeSpent ?? 0),
        stars: day.stars + (dailyChanges.stars ?? 0),
      },
    });
  }

  storage.set(
    getStatsKey(profileId),
    JSON.stringify({
      activities: { ...stats.activities, [activityId]: updatedActivity },
      daily,
    }),
  );
};

// numbers are added to what is saved, except lastPlayed which is replaced
const StatsService = {
  getStats: (profileId: string): ProfileStatsType => {
    const data = storage.getString(getStatsKey(profileId));
    if (!data) return EMPTY_STATS;
    try {
      return { ...EMPTY_STATS, ...(JSON.parse(data) as ProfileStatsType) };
    } catch {
      return EMPTY_STATS;
    }
  },

  recordPlay: (profileId: string, activityId: string) => {
    updateStats(profileId, activityId, { plays: 1, lastPlayed: Date.now() });
  },

  recordAnswer: (profileId: string, activityId: string, isCorrect: boolean) => {
    updateStats(
      profileId,
      activityId,
      isCorrect ? { correct: 1 } : { wrong: 1 },
    );
  },

  recordCompletion: (profileId: string, activityId: string) => {
    updateStats(profileId, activityId, {
      completions: 1,
      lastPlayed: Date.now(),
    });
  },

  recordStars: (profileId: string, activityId: string, stars: number) => {
    if (stars <= 0) return;
    updateStats(profileId, activityId, { starsEarned: stars }, { stars });
  },

  recordTime: (profileId: string, activityId: string, seconds: number) => {
    if (seconds <= 0) return;
    updateStats(
      profileId,
      activityId,
      { timeSpent: seconds },
      { timeSpent: seconds },
    );
  },

  clearStats: (profileId: string) => {
    storage.remove(getStatsKey(profileId));
  },
};

export default StatsService;
