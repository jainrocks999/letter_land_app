import { UserSettingsType } from '../../../services/mmkv.service';

export interface settingsType {
  settings: UserSettingsType;
  updateSettings: (changes: Partial<UserSettingsType>) => void;
}
