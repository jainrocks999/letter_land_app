import { UserRewardsType } from '../../../services/mmkv.service';
import { StickerType } from '../../../features/rewards/data/rewards.data';

export interface PointsToastType {
  id: number;
  amount: number;
  label?: string;
}

export interface rewardsType {
  rewards: UserRewardsType;
  pointsToast: PointsToastType | null;
  unlockedQueue: StickerType[];
  addStars: (amount: number, label?: string) => void;
  addTrophy: (trophyId: string) => void;
  collectSticker: (stickerId: string) => boolean;
  resetRewards: () => void;
  dismissUnlocked: () => void;
}
