import React from 'react';
import { Path } from 'react-native-svg';

interface Stroke {
  path: string;
}

interface Props {
  strokes: Stroke[];

  guideColor: string;
  fillColor: string;

  outStrokeWidth: number;
  innerStrokeWidth: number;
  dashStrokeWidth: number;
}

const GuidePaths: React.FC<Props> = ({
  strokes,
  guideColor,
  fillColor,
  outStrokeWidth,
  innerStrokeWidth,
  dashStrokeWidth,
}) => {
  return (
    <>
      {strokes.map((strokeItem, index) => (
        <Path
          key={`guide-bg-${index}`}
          d={strokeItem.path}
          stroke={`${guideColor}34`}
          strokeWidth={outStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
      {strokes.map((strokeItem, index) => (
        <Path
          key={`guide-inner-${index}`}
          d={strokeItem.path}
          stroke={fillColor}
          strokeWidth={innerStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
      {strokes.map((strokeItem, index) => (
        <Path
          key={`guide-dash-${index}`}
          d={strokeItem.path}
          stroke={`${guideColor}42`}
          strokeWidth={dashStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 14"
          fill="none"
        />
      ))}
    </>
  );
};

export default GuidePaths;
