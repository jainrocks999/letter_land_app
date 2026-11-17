import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import useRewardsContext from '../../app/contexts/rewards/useRewards';
import { Castle } from '../../features/home/data/home.data';
import { rf } from '../../utils/responsive';

export interface StarCounterStaticProps {
  size?: 'small' | 'large';
  data?: Castle;
}

const DEFAULT_BG_COLOR = '#fff';
const DEFAULT_BORDER_COLOR = '#e09b00';

export const getStarCounterColors = (data?: Castle) => {
  const cardColors = data?.innerCard;
  return {
    bg: cardColors ? `${cardColors.lightColor}99` : DEFAULT_BG_COLOR,
    border: cardColors?.darkColor ?? DEFAULT_BORDER_COLOR,
  };
};

const StarCounterStatic: React.FC<StarCounterStaticProps> = ({
  size = 'small',
  data,
}) => {
  const { rewards } = useRewardsContext();
  const isLarge = size === 'large';
  const { bg, border } = getStarCounterColors(data);

  return (
    <View
      style={[
        styles.pill,
        isLarge && styles.pillLarge,
        { backgroundColor: bg, borderColor: border },
      ]}
    >
      <FontAwesome6
        name="star"
        iconStyle="solid"
        size={isLarge ? rf(22) : rf(18)}
        color="#f5df00"
      />
      <Text
        style={[styles.count, isLarge && styles.countLarge, { color: border }]}
      >
        {rewards.stars}
      </Text>
    </View>
  );
};

export default StarCounterStatic;

export const starCounterStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rf(4),
    borderWidth: 2,
    borderBottomWidth: rf(6),
    borderRadius: 999,
    paddingVertical: rf(4),
    paddingHorizontal: rf(10),
  },
  pillLarge: {
    paddingVertical: rf(8),
    paddingHorizontal: rf(16),
    gap: rf(6),
  },
  count: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(16),
    color: '#ffffff',
    minWidth: rf(18),
    textAlign: 'center',
  },
  countLarge: { fontSize: rf(20) },
});

const styles = starCounterStyles;
