import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Animated, { ZoomIn } from 'react-native-reanimated';
import CustomButton from '../customButton/CustomButton';
import { PROFILE_AVATARS, PROFILE_COLORS } from '../../config/constants';
import { NewProfileType } from '../../services/profile.service';

interface ProfileFormProps {
  initial?: Partial<NewProfileType>;
  submitLabel: string;
  onSubmit: (profile: NewProfileType) => void;
}

const MAX_NAME_LENGTH = 16;

// name, avatar and color picker shared by first-run setup and the parent dashboard
const ProfileForm: React.FC<ProfileFormProps> = ({
  initial,
  submitLabel,
  onSubmit,
}) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [avatar, setAvatar] = useState(initial?.avatar ?? PROFILE_AVATARS[1]);
  const [color, setColor] = useState(initial?.color ?? PROFILE_COLORS[1]);

  const canSave = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit({ name: name.trim(), avatar, color });
  };

  return (
    <View>
      <Animated.View
        key={avatar + color}
        entering={ZoomIn.springify().damping(10)}
        style={[styles.preview, { backgroundColor: color }]}
      >
        <Text style={styles.previewEmoji}>{avatar}</Text>
      </Animated.View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Kid's name"
        placeholderTextColor="#b9aa8c"
        maxLength={MAX_NAME_LENGTH}
        autoCapitalize="words"
        returnKeyType="done"
        style={styles.input}
      />

      <Text style={styles.label}>Avatar</Text>
      <View style={styles.avatarGrid}>
        {PROFILE_AVATARS.map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setAvatar(item)}
            style={[
              styles.avatarOption,
              item === avatar && { borderColor: color },
            ]}
          >
            <Text style={styles.avatarEmoji}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {PROFILE_COLORS.map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setColor(item)}
            style={[
              styles.colorOption,
              { backgroundColor: item },
              item === color && styles.colorSelected,
            ]}
          >
            {item === color && (
              <FontAwesome6
                name="check"
                iconStyle="solid"
                size={14}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.saveWrap, !canSave && styles.disabled]}>
        <CustomButton
          width={'100%'}
          bottomBorderColor="#0d8f3e"
          colors={['#35c46b', '#1ca952']}
          onPress={handleSubmit}
          padding={12}
          paddingBottom={9}
          btnRadius={15}
        >
          <Text style={styles.saveText}>{submitLabel}</Text>
        </CustomButton>
      </View>
    </View>
  );
};

export default ProfileForm;

const styles = StyleSheet.create({
  preview: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  previewEmoji: { fontSize: 46 },
  label: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#8c662e',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#f3d27a',
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: '#1a105f',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarOption: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorOption: {
    width: 34,
    height: 34,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: { borderWidth: 3, borderColor: '#1a105f' },
  saveWrap: { marginTop: 18 },
  disabled: { opacity: 0.45 },
  saveText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: '#fff',
  },
});
