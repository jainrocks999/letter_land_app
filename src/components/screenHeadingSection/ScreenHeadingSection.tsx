import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

interface Props {
  heading: string;
  subText: string;
}

const ScreenHeadingSection: React.FC<Props> = ({ heading, subText }) => {
  return (
    <View style={{ marginBottom: 5 }}>
      <Text style={styles.handingText}>{heading}</Text>
      <Text style={styles.subText}>{subText}</Text>
    </View>
  );
};

export default ScreenHeadingSection;

const styles = StyleSheet.create({
  handingText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 35,
    letterSpacing: 1,
    color: '#1a105f',
  },
  subText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 13,
    letterSpacing: 0.5,
    color: '#9e9e9e',
  },
});
