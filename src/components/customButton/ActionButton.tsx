import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import React from 'react';

interface Props {
  backgroundColor: string;
  bottomBorderColor: string;
  radius: number | string;
  bottomBorderWidth: number;
  onPress: TouchableOpacityProps['onPress'];
  children: React.ReactNode;
}

const ActionButton: React.FC<Props> = ({
  children,
  backgroundColor,
  bottomBorderColor,
  radius,
  bottomBorderWidth,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        { backgroundColor: bottomBorderColor, borderRadius: radius },
        styles.playBtn,
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
    gap: 10,
  },
  playBtn: {
    width: 50,
    height: 56,
    overflow: 'hidden',
  },
});
