import { searchingConstants } from '../config/constants';
import { LetterCardType } from '../features/learning/data/learning.data';

type activityType =
  (typeof searchingConstants.ACTIVITY)[keyof typeof searchingConstants.ACTIVITY];

export interface LetterOptionWithPosType {
  data: LetterCardType;
  x: number;
  y: number;
}

export interface SearchQuestionType {
  id: number;
  activity: activityType;
  target: LetterCardType;
//   options: LetterCardType[];
  options: LetterOptionWithPosType[];
}

export interface RectType{
  x:number;
  y:number;
  width:number;
  height:number;
}

export type colorData = {
  darkColor: string;
  midColor: string;
  lightColor?: string;
};