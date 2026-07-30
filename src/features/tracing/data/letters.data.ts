export interface TraceLetter {
  letter: string;
  path: string;
  hint: string;
  checkpoints: number[];
}

const CHECKPOINTS = [0, 0.18, 0.36, 0.54, 0.72, 0.9, 1];

const makeLetter = (
  letter: string,
  path: string,
  hint: string,
  checkpoints?: number[],
): TraceLetter => ({
  letter,
  path,
  hint,
  checkpoints: checkpoints ?? CHECKPOINTS,
});

export const traceLetters: TraceLetter[] = [
  makeLetter(
    'A',
    'M45 220 L120 35 L195 220 M78 150 L162 150',
    'Start at the top, slide down, then cross the middle.',
    [0, 0.415, 0.82, 0.85, 0.98],
  ),
   makeLetter(
    'B',
    'M62 35 L62 220 M62 35 C178 28 190 116 62 128 M62 128 C196 132 188 230 62 220',
    'Draw the tall line, then round both bumps.',
    [0,0.29,0.32,0.45,0.65,0.66,0.82,1]
  ),
  makeLetter(
    'C',
    'M190 62 C128 18 45 54 45 130 C45 205 125 242 192 198',
    'Curve around like a big open smile.',
    [0,0.5, 1]
  ),
  makeLetter(
    'D',
    'M62 35 L62 220 M62 35 C188 42 207 210 62 220',
    'Go down the back, then make one round belly.',
  ),
  makeLetter(
    'E',
    'M190 40 L60 40 L60 220 L194 220 M60 130 L170 130',
    'Trace the spine and touch each straight arm.',
    [0,0.23,0.55,0.80,0.82,1]
  ),
  makeLetter(
    'F',
    'M60 220 L60 40 L192 40 M60 130 L168 130',
    'Go up the tall line, then add the two arms.',
    [0,0.42,0.74,0.77,1]
  ),
  makeLetter(
    'G',
    'M190 66 C120 18 45 58 45 132 C45 210 126 244 194 196 L194 146 L138 146',
    'Curve around, then tuck the little line inward.',
     [0, 0.18, 0.36, 0.54, 0.72, 0.9, 1]
  ),
  makeLetter(
    'H',
    'M55 35 L55 220 M185 35 L185 220 M55 132 L185 132',
    'Down one side, down the other, then bridge the middle.',
     [0, 0.37,0.39,0.74,0.77,1]
  ),
  makeLetter(
    'I',
    'M70 40 L170 40 M120 40 L120 220 M70 220 L170 220',
    'Trace the top, middle, and bottom lines.',
      [0, 0.26,0.32,0.70,0.75,1]
  ),
  makeLetter(
    'J',
    'M180 40 L180 170 C180 230 75 238 62 178',
    'Go down, then hook around the bottom.',
    [0,0.45,1]
  ),
  makeLetter(
    'K',
    'M62 35 L62 220 M184 42 L62 132 L190 220',
    'Draw the back, then the two sharp arms.',
    [0,0.37,0.40,0.71,1]
  ),
  makeLetter(
    'L',
    'M62 35 L62 220 L192 220',
    'Slide down and turn across the floor.',
    [0,0.58,1]
  ),
  makeLetter(
    'M',
    'M42 220 L42 40 L120 145 L198 40 L198 220',
    'Climb, dip to the middle, climb again, then go down.',
    [0,0.29,0.50,0.71,1]
  ),
  makeLetter(
    'N',
    'M52 220 L52 40 L188 220 L188 40',
    'Go up, slant down, then finish up the side.',
    [0,0.29,0.50,0.71,1]
  ),
  makeLetter(
    'O',
    'M120 32 C192 32 212 96 202 150 C190 214 154 230 120 230 C72 230 38 190 38 132 C38 72 72 32 120 32',
    'Follow the loop all the way around.',
    [0,0.25,0.5,0.75,1]
  ),
  makeLetter(
    'P',
    'M62 220 L62 35 M62 35 C188 28 192 135 62 136',
    'Draw the tall line and round the top bubble.',
    [0,0.44,0.73,1]
  ),
  makeLetter(
    'Q',
    'M120 32 C192 32 212 96 202 150 C190 214 154 230 120 230 C72 230 38 190 38 132 C38 72 72 32 120 32 M150 190 L202 232',
    'Make the loop, then add the little tail.',
    [0,0.23,0.7,0.90,1]
  ),
  makeLetter(
    'R',
    'M62 220 L62 35 M62 35 C188 28 192 135 62 136 M96 136 L192 220',
    'Round the top, then kick the leg down.',
  ),
  makeLetter(
    'S',
    'M190 62 C112 10 45 58 70 118 C88 164 192 138 185 196 C178 248 82 236 48 198',
    'Snake from the top around to the bottom.',
    [0,0.3,0.65,1]
  ),
  makeLetter(
    'T',
    'M45 40 L195 40 M120 40 L120 220',
    'Trace the roof first, then the center line.',
    [0,0.45,0.49,1]
  ),
  makeLetter(
    'U',
    'M54 38 L54 156 C54 246 186 246 186 156 L186 38',
    'Go down, around the bottom, and back up.',
    [0,0.3,0.5,0.7,1]
  ),
  makeLetter(
    'V',
    'M44 40 L120 220 L196 40',
    'Slide down to the point, then climb up.',
    [0,0.5,1]
  ),
  makeLetter(
    'W',
    'M34 40 L72 220 L120 118 L168 220 L206 40',
    'Make two pointy dips across the page.',
    [0,0.3,0.5,0.7,1]
  ),
  makeLetter(
    'X',
    'M48 42 L192 220 M192 42 L48 220',
    'Trace one diagonal, then cross it.',
    [0,0.5,0.53,1]
  ),
  makeLetter(
    'Y',
    'M44 40 L120 128 L196 40 M120 128 L120 220',
    'Make the fork, then pull down the stem.',
    [0,0.36,0.71,0.77,1]
  ),
  makeLetter(
    'Z',
    'M48 40 L192 40 L52 220 L196 220',
    'Go across, zip diagonally, then across again.',
    [0,0.28,0.72,1]
  ),
];
