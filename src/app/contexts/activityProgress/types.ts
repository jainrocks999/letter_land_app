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
  getProgress: () => void;
  updateProgress: ({ key, progress }: updateProgressProp) => void;
}
