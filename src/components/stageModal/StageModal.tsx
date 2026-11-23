import { PropsWithChildren } from 'react';
import { Modal, ModalProps, Platform, StyleSheet, View } from 'react-native';
import { usePortraitStage } from '../../utils/orientation';

type StageModalProps = PropsWithChildren<ModalProps>;

/**
 * RN Modal opens in its own native window and would ignore the letterboxed
 * portrait stage while an iPad is in landscape. In that case render it as an
 * in-tree overlay so it stays inside the scaled white screen. iPads use the
 * in-tree overlay in both orientations so rotation never swaps modal types;
 * phones keep the native Modal behaviour (including Android back dismissal).
 */
const StageModal = ({ visible, children, ...modalProps }: StageModalProps) => {
  const { isLandscape, contentWidth } = usePortraitStage();
  const isIPad = Platform.OS === 'ios' && contentWidth >= 600;

  if (!visible) return null;

  // On iPad keep the same in-tree overlay in both orientations. Swapping it
  // for a native Modal when rotating back to portrait can crash mid-transition.
  if (isLandscape || isIPad) {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {children}
      </View>
    );
  }

  return (
    <Modal visible={visible} {...modalProps}>
      {children}
    </Modal>
  );
};

export default StageModal;
