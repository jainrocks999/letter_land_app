import {
  ActivitiesKey,
  UserActivitiesType,
} from '../../../services/mmkv.service';

export interface updateProgressProp {
  key: ActivitiesKey;
  progress: number;
}

export interface activityProgressType {
  progressData: UserActivitiesType;
  // index of the level the home character stands on (-1 when unknown)
  characterIndex: number;
  getProgress: () => void;
  updateProgress: ({ key, progress }: updateProgressProp) => void;
  resetProgress: () => void;
}
