import { StyleSheet, Text, View } from 'react-native';
import { LetterCardType } from '../../learning/data/learning.data';

interface Props {
  item: LetterCardType;
  disabled?: boolean;
  isMatched?: boolean;
  data: any;
  onLayoutPosition: (
    letter: string,
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
  ) => void;
}

const EmojiTarget = ({
  item,
  disabled = false,
  isMatched = false,
  data,
  onLayoutPosition,
}: Props) => {
  return (
    <View
      onLayout={e => {
        const { x, y, width, height } = e.nativeEvent.layout;

        onLayoutPosition(item.letter, {
          x,
          y,
          width,
          height,
        });
      }}
      style={[
        styles.itemSection,
        {
          borderColor: isMatched ? '#22C55E' : `${data.midColor}66`,
          backgroundColor: isMatched ? '#DCFCE7' : data.darkColor,
          opacity: disabled ? 0.55 : 1,
        },
      ]}
    >
      <Text style={styles.itemEmoji}>{item.emoji}</Text>
    </View>
    // </View>
  );
};

export default EmojiTarget;

const styles = StyleSheet.create({
  itemSection: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemEmoji: { fontSize: 40 },
});
