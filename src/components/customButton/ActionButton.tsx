import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { rf } from '../../utils/responsive';

interface Props {
  backgroundColor: string;
  bottomBorderColor: string;
  radius: number | string;
  bottomBorderWidth: number;
  onPress: TouchableOpacityProps['onPress'];
  children: React.ReactNode;
  styles?: StyleProp<ViewStyle>;
}

const ActionButton: React.FC<Props> = ({
  children,
  backgroundColor,
  bottomBorderColor,
  radius,
  bottomBorderWidth,
  onPress,
  styles: customStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        { backgroundColor: bottomBorderColor, borderRadius: radius },
        styles.playBtn,
        customStyle,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.rowCenter,
          {
            backgroundColor: backgroundColor,
            borderRadius: radius,
            marginBottom: bottomBorderWidth,
          },
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: rf(10),
  },
  playBtn: {
    width: rf(50),
    height: rf(56),
    overflow: 'hidden',
  },
});
