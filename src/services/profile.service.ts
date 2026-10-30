import { storage } from './mmkv.service';
import {
  PROFILE_AVATARS,
  PROFILE_COLORS,
  STORAGE_KEYS,
} from '../config/constants';

export interface ProfileType {
  id: string;
  name: string;
  avatar: string;
  color: string;
  createdAt: number;
}

export interface ProfilesStateType {
  activeId: string;
  list: ProfileType[];
  // true until a grown-up names the first kid after onboarding
  needsSetup?: boolean;
}

export type NewProfileType = Pick<ProfileType, 'name' | 'avatar' | 'color'>;

// every kid keeps their own stars, progress and stats under a suffixed key
export const getProfileKey = (baseKey: string, profileId: string) =>
  `${baseKey}_${profileId}`;

const PROFILE_DATA_KEYS = [
  STORAGE_KEYS.REWARDS,
  STORAGE_KEYS.USER_PERFORMANCE,
  STORAGE_KEYS.STATS,
];

const moveKey = (fromKey: string, toKey: string) => {
  const data = storage.getString(fromKey);
  if (data === undefined) return;
  storage.set(toKey, data);
  storage.remove(fromKey);
};

const ProfileService = {
  createProfile: (profile: NewProfileType): ProfileType => ({
    ...profile,
    name: profile.name.trim(),
    id: `kid_${Date.now().toString(36)}${Math.random()
      .toString(36)
      .slice(2, 6)}`,
    createdAt: Date.now(),
  }),

  getProfiles: (): ProfilesStateType => {
    const data = storage.getString(STORAGE_KEYS.PROFILES);
    if (data) {
      try {
        const parsed = JSON.parse(data) as ProfilesStateType;
        if (parsed.list?.length) {
          const hasActive = parsed.list.some(p => p.id === parsed.activeId);
          return hasActive
            ? parsed
            : { ...parsed, activeId: parsed.list[0].id };
        }
      } catch {}
    }

    // first launch with profiles: progress saved before this update becomes the first kid's
    const firstProfile = ProfileService.createProfile({
      name: 'Explorer',
      avatar: PROFILE_AVATARS[0],
      color: PROFILE_COLORS[0],
    });
    PROFILE_DATA_KEYS.forEach(key =>
      moveKey(key, getProfileKey(key, firstProfile.id)),
    );
    const state = {
      activeId: firstProfile.id,
      list: [firstProfile],
      needsSetup: true,
    };
    ProfileService.setProfiles(state);
    return state;
  },

  setProfiles: (state: ProfilesStateType) => {
    storage.set(STORAGE_KEYS.PROFILES, JSON.stringify(state));
  },

  removeProfileData: (profileId: string) => {
    PROFILE_DATA_KEYS.forEach(key =>
      storage.remove(getProfileKey(key, profileId)),
    );
  },
};

export default ProfileService;
