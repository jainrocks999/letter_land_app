import { NewProfileType, ProfileType } from '../../../services/profile.service';

export interface profilesType {
  profiles: ProfileType[];
  activeProfile: ProfileType;
  activeProfileId: string;
  needsSetup: boolean;
  completeSetup: (profile: NewProfileType) => void;
  addProfile: (profile: NewProfileType) => ProfileType;
  updateProfile: (profileId: string, changes: Partial<NewProfileType>) => void;
  removeProfile: (profileId: string) => void;
  switchProfile: (profileId: string) => void;
}
