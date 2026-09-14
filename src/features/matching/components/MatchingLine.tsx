import { StyleSheet, View } from 'react-native';
import { Point } from '../../../types/tracing.types';

interface Props {
  start: Point;
  end: Point;
  color: string;
  thickness?: number;
}

const MatchingLine = ({ start, end, color, thickness = 5 }: Props) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const angle = Math.atan2(dy, dx);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.matchingLine,
        {
          width: distance,
          height: thickness,
          backgroundColor: color,
          left: start.x,
          top: start.y,
          transform: [{ rotate: `${angle}rad` }],
        },
      ]}
    />
  );
};

export default MatchingLine;

const styles = StyleSheet.create({
  matchingLine: {
    position: 'absolute',
    borderRadius: 100,
    transformOrigin: 'left center',
  },
});
