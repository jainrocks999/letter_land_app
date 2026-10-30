import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ProfileForm from '../../../components/profileForm/ProfileForm';
import { NewProfileType, ProfileType } from '../../../services/profile.service';

interface ProfileEditorModalProps {
  visible: boolean;
  // leave empty to create a new kid
  profile?: ProfileType | null;
  onSave: (profile: NewProfileType) => void;
  onClose: () => void;
}

const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  visible,
  profile,
  onSave,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {profile ? 'Edit profile' : 'New kid profile'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <FontAwesome6
                name="xmark"
                iconStyle="solid"
                size={24}
                color="#1a105f"
              />
            </TouchableOpacity>
          </View>

          {/* remount on each open so the form starts from the right profile */}
          {visible && (
            <ProfileForm
              initial={profile ?? undefined}
              submitLabel={profile ? 'Save changes' : 'Add kid'}
              onSubmit={onSave}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileEditorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: '#f4eee2',
    borderColor: '#d9a441',
    borderWidth: 2,
    borderBottomWidth: 10,
    borderRadius: 30,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 24,
    color: '#1a105f',
  },
});
