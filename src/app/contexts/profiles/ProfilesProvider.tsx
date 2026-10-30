import React, { useCallback, useMemo, useState } from 'react';
import ProfileService, {
  NewProfileType,
  ProfilesStateType,
} from '../../../services/profile.service';
import { ProfilesContext } from './ProfilesContext';

interface Props {
  children: React.ReactNode;
}

export const ProfilesProvider = ({ children }: Props) => {
  const [state, setState] = useState<ProfilesStateType>(
    ProfileService.getProfiles,
  );

  const saveState = useCallback(
    (update: (prev: ProfilesStateType) => ProfilesStateType) => {
      setState(prev => {
        const updated = update(prev);
        ProfileService.setProfiles(updated);
        return updated;
      });
    },
    [],
  );

  const addProfile = useCallback(
    (profile: NewProfileType) => {
      const created = ProfileService.createProfile(profile);
      saveState(prev => ({ ...prev, list: [...prev.list, created] }));
      return created;
    },
    [saveState],
  );

  const updateProfile = useCallback(
    (profileId: string, changes: Partial<NewProfileType>) => {
      saveState(prev => ({
        ...prev,
        list: prev.list.map(profile =>
          profile.id === profileId
            ? {
                ...profile,
                ...changes,
                name: (changes.name ?? profile.name).trim(),
              }
            : profile,
        ),
      }));
    },
    [saveState],
  );

  const removeProfile = useCallback(
    (profileId: string) => {
      // there must always be one kid left to play as
      if (state.list.length <= 1) return;
      saveState(prev => {
        const list = prev.list.filter(profile => profile.id !== profileId);
        return {
          list,
          activeId: prev.activeId === profileId ? list[0].id : prev.activeId,
        };
      });
      ProfileService.removeProfileData(profileId);
    },
    [saveState, state.list.length],
  );

  // first-run setup names the placeholder kid, keeping any progress already saved on it
  const completeSetup = useCallback(
    (profile: NewProfileType) => {
      saveState(prev => ({
        ...prev,
        needsSetup: false,
        list: prev.list.map(item =>
          item.id === prev.activeId
            ? { ...item, ...profile, name: profile.name.trim() }
            : item,
        ),
      }));
    },
    [saveState],
  );

  const switchProfile = useCallback(
    (profileId: string) => {
      saveState(prev =>
        prev.list.some(profile => profile.id === profileId)
          ? { ...prev, activeId: profileId }
          : prev,
      );
    },
    [saveState],
  );

  const activeProfile =
    state.list.find(profile => profile.id === state.activeId) ?? state.list[0];

  const value = useMemo(
    () => ({
      profiles: state.list,
      activeProfile,
      activeProfileId: activeProfile.id,
      needsSetup: !!state.needsSetup,
      completeSetup,
      addProfile,
      updateProfile,
      removeProfile,
      switchProfile,
    }),
    [
      state.list,
      state.needsSetup,
      activeProfile,
      completeSetup,
      addProfile,
      updateProfile,
      removeProfile,
      switchProfile,
    ],
  );

  return (
    <ProfilesContext.Provider value={value}>
      {children}
    </ProfilesContext.Provider>
  );
};
