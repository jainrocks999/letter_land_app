import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import useSettingsContext from '../../app/contexts/settings/useSettings';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import useActivityProContext from '../../app/contexts/activityProgress/useActivityProgress';
import { VoiceSpeedType } from '../../services/mmkv.service';
import TTSService from '../../services/tts.service';
import CustomButton from '../customButton/CustomButton';
import ToggleSwitch from './components/ToggleSwitch';
import ParentGate from './components/ParentGate';
import { styles } from './SettingsModal.styles';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

type ModalStep = 'settings' | 'parentGate' | 'resetDone';

const speedOptions: { key: VoiceSpeedType; icon: string; label: string }[] = [
  { key: 'slow', icon: '🐢', label: 'Slow' },
  { key: 'normal', icon: '🙂', label: 'Normal' },
  { key: 'fast', icon: '🐇', label: 'Fast' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { settings, updateSettings } = useSettingsContext();
  const { resetRewards } = useRewardsContext();
  const { resetProgress } = useActivityProContext();
  const [step, setStep] = useState<ModalStep>('settings');

  const handleClose = () => {
    setStep('settings');
    onClose();
  };

  const handleVoiceToggle = (voiceOn: boolean) => {
    updateSettings({ voiceOn });
    if (voiceOn) {
      TTSService.setMuted(false);
      TTSService.speak('Hi! I can talk again!');
    }
  };

  const handleTestVoice = () => {
    TTSService.speak(
      "Hello, little learner! I'm here to help you learn your letters. Let's learn and have fun together!",
    );
  };

  const handleReset = () => {
    resetRewards();
    resetProgress();
    setStep('resetDone');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <FontAwesome6
                name="gear"
                iconStyle="solid"
                size={20}
                color="#fff"
              />
            </View>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={10}>
              <FontAwesome6
                name="xmark"
                iconStyle="solid"
                size={26}
                color="#1a105f"
              />
            </TouchableOpacity>
          </View>

          {step === 'settings' && (
            <Animated.View entering={FadeIn.duration(250)} style={styles.body}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, styles.musicIcon]}>
                  <FontAwesome6
                    name="music"
                    iconStyle="solid"
                    size={18}
                    color="#fff"
                  />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Music</Text>
                  <Text style={styles.rowSubText}>
                    Happy tunes while you play
                  </Text>
                </View>
                <ToggleSwitch
                  value={settings.musicOn}
                  onChange={musicOn => updateSettings({ musicOn })}
                />
              </View>

              {/* <View style={styles.row}>
                <View style={[styles.rowIcon, styles.soundIcon]}>
                  <FontAwesome6
                    name={settings.voiceOn ? 'volume-high' : 'volume-xmark'}
                    iconStyle="solid"
                    size={18}
                    color="#fff"
                  />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Sound</Text>
                  <Text style={styles.rowSubText}>
                    Sound tunes while you play
                  </Text>
                </View>
                <ToggleSwitch
                  value={settings.musicOn}
                  onChange={musicOn => updateSettings({ musicOn })}
                />
              </View> */}

              <View style={styles.row}>
                <View style={[styles.rowIcon, styles.voiceIcon]}>
                  <FontAwesome6
                    // name={settings.voiceOn ? 'volume-high' : 'volume-xmark'}
                    name={'bullhorn'}
                    iconStyle="solid"
                    size={18}
                    color="#fff"
                  />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Buddy's Voice</Text>
                  <Text style={styles.rowSubText}>Hear letters and words</Text>
                </View>
                <ToggleSwitch
                  value={settings.voiceOn}
                  onChange={handleVoiceToggle}
                />
              </View>

              <View
                style={[
                  styles.row,
                  styles.columnRow,
                  !settings.voiceOn && styles.disabled,
                ]}
              >
                <View style={styles.rowTop}>
                  <View style={[styles.rowIcon, styles.speedIcon]}>
                    <FontAwesome6
                      name="gauge-high"
                      iconStyle="solid"
                      size={18}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowTitle}>Talking Speed</Text>
                  </View>
                  <TouchableOpacity
                    disabled={!settings.voiceOn}
                    onPress={handleTestVoice}
                    style={styles.testBtn}
                  >
                    <FontAwesome6
                      name="play"
                      iconStyle="solid"
                      size={12}
                      color="#7b61ff"
                    />
                    <Text style={styles.testBtnText}>Hear Buddy</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.speedRow}>
                  {speedOptions.map(option => {
                    const isActive = settings.voiceSpeed === option.key;
                    return (
                      <TouchableOpacity
                        key={option.key}
                        disabled={!settings.voiceOn}
                        onPress={() =>
                          updateSettings({ voiceSpeed: option.key })
                        }
                        style={[
                          styles.speedChip,
                          isActive && styles.speedChipActive,
                        ]}
                      >
                        <Text style={styles.speedEmoji}>{option.icon}</Text>
                        <Text
                          style={[
                            styles.speedText,
                            isActive && styles.speedTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.rowIcon, styles.starIcon]}>
                  <FontAwesome6
                    name="star"
                    iconStyle="solid"
                    size={18}
                    color="#fff"
                  />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Star Popups</Text>
                  <Text style={styles.rowSubText}>
                    Show +⭐ when you earn stars
                  </Text>
                </View>
                <ToggleSwitch
                  value={settings.starPopups}
                  onChange={starPopups => updateSettings({ starPopups })}
                />
              </View>

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => setStep('parentGate')}
              >
                <FontAwesome6
                  name="rotate-left"
                  iconStyle="solid"
                  size={16}
                  color="#d8493a"
                />
                <Text style={styles.resetText}>Reset all progress</Text>
                <FontAwesome6
                  name="lock"
                  iconStyle="solid"
                  size={12}
                  color="#d8493a"
                />
              </TouchableOpacity>

              <CustomButton
                width={'100%'}
                bottomBorderColor="#0d8f3e"
                colors={['#35c46b', '#1ca952']}
                onPress={handleClose}
                padding={12}
                paddingBottom={9}
                btnRadius={15}
              >
                <Text style={styles.doneText}>Done</Text>
              </CustomButton>
            </Animated.View>
          )}

          {step === 'parentGate' && (
            <ParentGate
              onConfirm={handleReset}
              onCancel={() => setStep('settings')}
            />
          )}

          {step === 'resetDone' && (
            <Animated.View entering={ZoomIn} style={styles.resetDone}>
              <Text style={styles.resetDoneEmoji}>🌱</Text>
              <Text style={styles.title}>Fresh start!</Text>
              <Text style={[styles.rowSubText, styles.resetDoneText]}>
                All progress was reset. Time for a new adventure!
              </Text>
              <CustomButton
                width={'100%'}
                bottomBorderColor="#0d8f3e"
                colors={['#35c46b', '#1ca952']}
                onPress={handleClose}
                padding={12}
                paddingBottom={9}
                btnRadius={15}
              >
                <Text style={styles.doneText}>Let's Play</Text>
              </CustomButton>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;
