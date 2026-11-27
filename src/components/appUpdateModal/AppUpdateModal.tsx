import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppUpdateType } from '../../config/appUpdate';

type Props = {
  visible: boolean;
  type: AppUpdateType;
  onUpdate: () => void;
  onLater?: () => void;
};

const AppUpdateModal = ({ visible, type, onUpdate, onLater }: Props) => {
  const isForce = type === AppUpdateType.FORCE;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isForce) onLater?.();
      }}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isForce ? 'Update required' : 'Update available'}
          </Text>
          <Text style={styles.message}>
            {isForce
              ? 'A new version of eLetter is required to continue.'
              : 'A new version of eLetter is available. Update now for the best experience.'}
          </Text>

          <View style={styles.actions}>
            {!isForce && (
              <Pressable style={[styles.btn, styles.laterBtn]} onPress={onLater}>
                <Text style={styles.laterText}>Later</Text>
              </Pressable>
            )}
            <Pressable style={[styles.btn, styles.updateBtn]} onPress={onUpdate}>
              <Text style={styles.updateText}>Update</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  laterBtn: {
    backgroundColor: '#eee',
  },
  updateBtn: {
    backgroundColor: '#111',
  },
  laterText: {
    color: '#111',
    fontWeight: '600',
  },
  updateText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AppUpdateModal;
