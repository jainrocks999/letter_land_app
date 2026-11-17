import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { rf } from '../../utils/responsive';

interface Props {
  heading: string;
  subText: string;
  style?: StyleProp<ViewStyle>;
}

const ScreenHeadingSection: React.FC<Props> = ({ heading, subText, style }) => {
  return (
    <View style={[{ marginBottom: rf(5) }, style]}>
      <Text style={styles.handingText}>{heading}</Text>
      <Text style={styles.subText}>{subText}</Text>
    </View>
  );
};

export default ScreenHeadingSection;

const styles = StyleSheet.create({
  handingText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(35),
    letterSpacing: 1,
    color: '#1a105f',
  },
  subText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(13),
    letterSpacing: 0.5,
    color: '#9e9e9e',
  },
});
