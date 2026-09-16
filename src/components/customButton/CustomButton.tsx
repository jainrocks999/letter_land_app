import {
  DimensionValue,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';

interface CustomButtonProps {
  width: number | DimensionValue;
  colors: string[];
  bottomBorderColor: string;
  onPress: TouchableOpacityProps['onPress'];
  children: React.ReactNode;
  padding?: number;
  paddingBottom?: number;
  btnRadius?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  width,
  colors,
  bottomBorderColor,
  onPress,
  children,
  padding,
  paddingBottom,
  btnRadius,
}) => {
  return (
    <TouchableOpacity
      style={{
        width: width,
        backgroundColor: bottomBorderColor,
        paddingBottom: paddingBottom || 10,
        borderRadius: btnRadius || 20,
      }}
      onPress={onPress}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.gradientContainer,
          { padding: padding || 20, borderRadius: btnRadius || 20 },
        ]}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btnContainer: {
    borderRadius: 20,
  },
  gradientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
