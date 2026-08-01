import { TraceLetter } from "../../../types/tracing.types";

const lineCheckpoints = [0, 0.5, 1];
const curveCheckpoints = [0, 0.33, 0.66, 1];
const loopCheckpoints = [0, 0.25, 0.5, 0.75, 1];

const stroke = (path: string, checkpoints: number[] = lineCheckpoints) => ({
  path,
  checkpoints,
});

export const traceLetters: TraceLetter[] = [
  {
    letter: 'A',
    hint: 'Start at the top, slide down, then cross the middle.',
    hint2: [
      'Start at the bottom and slide up to the top.',
      'Next, slide down to the other side.',
      ' Then draw a line across the middle.',
    ],
    strokes: [
      stroke('M45 220 L120 35'),
      stroke('M120 35 L195 220'),
      stroke('M78 150 L162 150', [0, 1]),
    ],
  },
  {
    letter: 'B',
    hint: 'Draw the tall line, then round both bumps.',
    hint2: [
      'Start at the top and slide down.',
      'Make a big bump to the middle.',
      'Then make another big bump to the bottom.',
    ],
    strokes: [
      stroke('M62 35 L62 220'),
      stroke('M62 35 C178 28 190 116 62 128', curveCheckpoints),
      stroke('M62 128 C196 132 188 230 62 220', curveCheckpoints),
    ],
  },
  {
    letter: 'C',
    hint: 'Curve around like a big open smile.',
    hint2: ['Start at the top and make a big curve around to the bottom.'],
    strokes: [
      stroke(
        'M190 62 C128 18 45 54 45 130 C45 205 125 242 192 198',
        loopCheckpoints,
      ),
    ],
  },
  {
    letter: 'D',
    hint: 'Go down the back, then make one round belly.',
    hint2: [
      'Start at the top and slide down.',
      'Go back to the top and make one big curve to the bottom.',
    ],
    strokes: [
      stroke('M62 35 L62 220'),
      stroke('M62 35 C188 42 207 210 62 220', curveCheckpoints),
    ],
  },
  {
    letter: 'E',
    hint: 'Trace the spine and touch each straight arm.',
    hint2: [
      'Start at the top right and draw a line to the left.',
      'Next, draw a line straight down.',
      'Then draw the bottom line from left to right.',
      'Last, draw the middle line from left to right.',
    ],
    strokes: [
      stroke('M190 40 L60 40'),
      stroke('M60 40 L60 220'),
      stroke('M60 220 L194 220'),
      stroke('M60 130 L170 130', [0, 1]),
    ],
  },
  {
    letter: 'F',
    hint: 'Go up the tall line, then add the two arms.',
    hint2: [
      'Start form left at the Bottom and slide up.',
      'Draw the top line from left to right.',
      'then the middle line.',
    ],
    strokes: [
      stroke('M60 220 L60 40'),
      stroke('M60 40 L192 40'),
      stroke('M60 130 L168 130', [0, 1]),
    ],
  },
  {
    letter: 'G',
    hint: 'Curve around, then tuck the little line inward.',
    hint2: [
      'Start at the top and make a big curve around.',
      'Finish by drawing a little line inward in the middle.',
    ],
    strokes: [
      stroke(
        'M190 66 C120 18 45 58 45 132 C45 210 126 244 194 196',
        loopCheckpoints,
      ),
      stroke('M194 196 L194 146 L138 146', lineCheckpoints),
    ],
  },
  {
    letter: 'H',
    hint: 'Down one side, down the other, then bridge the middle.',
    hint2: [
      'Start at the top and slide down at lift.',
      'Draw the second line from top to bottom at right.',
      'Then draw a line across the middle from left to right.',
    ],
    strokes: [
      stroke('M55 35 L55 220'),
      stroke('M185 35 L185 220'),
      stroke('M55 132 L185 132', [0, 1]),
    ],
  },
  {
    letter: 'I',
    hint: 'Trace the top, middle, and bottom lines.',
    hint2: [
      'Start from the top at left slide right.',
      'then middle from top to bottom',
      'now bottom lines. from left to right',
    ],
    strokes: [
      stroke('M70 40 L170 40', [0, 1]),
      stroke('M120 40 L120 220'),
      stroke('M70 220 L170 220', [0, 1]),
    ],
  },
  {
    letter: 'J',
    hint: 'Go down, then hook around the bottom.',
    hint2: [
      'Start at the top and slide down',
      'then curve around at the bottom.',
    ],
    strokes: [
      stroke('M180 40 L180 170'),
      stroke('M180 170 C180 230 75 238 62 178', curveCheckpoints),
    ],
  },
  {
    letter: 'K',
    hint: 'Draw the back, then the two sharp arms.',
    hint2: [
      'Start from left at the top and slide down.',
      'Go to the right at top, draw a line up to the top right down to the middle.',
      'then another line down form middle to the bottom right.',
    ],
    strokes: [
      stroke('M62 35 L62 220'),
      stroke('M184 42 L62 132'),
      stroke('M62 132 L190 220'),
    ],
  },
  {
    letter: 'L',
    hint: 'Slide down and turn across the floor.',
    hint2: [
      'Start at the top and slide down.',
      'Then draw a line across the bottom.',
    ],
    strokes: [stroke('M62 35 L62 220'), stroke('M62 220 L192 220')],
  },
  {
    letter: 'M',
    hint: 'Climb, dip to the middle, climb again, then go down.',
    hint2: [
      'Start at the bottom left and slide up.',
      'Slide down to the middle.',
      'up to the top right.',
      'then down to the bottom right.',
    ],
    strokes: [
      stroke('M42 220 L42 40'),
      stroke('M42 40 L120 145'),
      stroke('M120 145 L198 40'),
      stroke('M198 40 L198 220'),
    ],
  },
  {
    letter: 'N',
    hint: 'Go up, slant down, then finish up the side.',
    hint2: [
      'Start at the bottom left and slide up.',
      'Draw a diagonal line down to the bottom right.',
      'Then slide up to the top right.',
    ],
    strokes: [
      stroke('M52 220 L52 40'),
      stroke('M52 40 L188 220'),
      stroke('M188 220 L188 40'),
    ],
  },
  {
    letter: 'O',
    hint: 'Follow the loop all the way around.',
    hint2: ['Start at the top and make one big circle back to the top'],
    strokes: [
      stroke(
        'M120 32 C192 32 212 96 202 150 C190 214 154 230 120 230 C72 230 38 190 38 132 C38 72 72 32 120 32',
        loopCheckpoints,
      ),
    ],
  },
  {
    letter: 'P',
    hint: 'Draw the tall line and round the top bubble.',
    hint2: [
      'Start at the bottom left and draw a straight line up to the top.',
      'Go back to the top, then make one big curve to the middle.',
    ],
    strokes: [
      stroke('M62 220 L62 35'),
      stroke('M62 35 C188 28 192 135 62 136', curveCheckpoints),
    ],
  },
  {
    letter: 'Q',
    hint: 'Make the loop, then add the little tail.',
    hint2: [
      'Start at the top and make one big circle.',
      'Then draw a short slanted line at the bottom right',
    ],
    strokes: [
      stroke(
        'M120 32 C192 32 212 96 202 150 C190 214 154 230 120 230 C72 230 38 190 38 132 C38 72 72 32 120 32',
        loopCheckpoints,
      ),
      stroke('M150 190 L202 232', [0, 1]),
    ],
  },
  {
    letter: 'R',
    hint: 'Round the top, then kick the leg down.',
    hint2: [
      'Start from left at the bottom and slide up.',
      'Go back to the top, make one curve to the middle.',
      'then draw a slanted line to the bottom right.',
    ],
    strokes: [
      stroke('M62 220 L62 35'),
      stroke('M62 35 C188 28 192 135 62 136', curveCheckpoints),
      stroke('M96 136 L192 220'),
    ],
  },
  {
    letter: 'S',
    hint: 'Snake from the top around to the bottom.',
    hint2: [
      'Start at the top and make a curve to the middle. Then make another curve to the bottom.',
    ],
    strokes: [
      stroke(
        'M190 62 C112 10 45 58 70 118 C88 164 192 138 185 196 C178 248 82 236 48 198',
        loopCheckpoints,
      ),
    ],
  },
  {
    letter: 'T',
    hint: 'Trace the roof first, then the center line.',
    hint2: [
      'Start at the top and draw a line across left to right.',
      'Then slide down from the middle starts from top to bottom.',
    ],
    strokes: [stroke('M45 40 L195 40'), stroke('M120 40 L120 220')],
  },
  {
    letter: 'U',
    hint: 'Go down, around the bottom, and back up.',
    hint2: [
      'Start at the top left, slide down, curve around the bottom, and slide up to the top right.',
    ],
    strokes: [
      stroke('M54 38 L54 156 C54 246 186 246 186 156 L186 38', loopCheckpoints),
    ],
  },
  {
    letter: 'V',
    hint: 'Slide down to the point, then climb up.',
    hint2: [
      'Start at the top left and slide down to the bottom.',
      'Then slide up to the top right.',
    ],
    strokes: [stroke('M44 40 L120 220'), stroke('M120 220 L196 40')],
  },
  {
    letter: 'W',
    hint: 'Make two pointy dips across the page.',
    hint2: [
      'Start at the top left, slide down.',
      'then slide up.',
      'again down.',
      'up again to the top right',
    ],
    strokes: [
      stroke('M34 40 L72 220'),
      stroke('M72 220 L120 118'),
      stroke('M120 118 L168 220'),
      stroke('M168 220 L206 40'),
    ],
  },
  {
    letter: 'X',
    hint: 'Trace one diagonal, then cross it.',
    hint2: [
      'Draw a slanted line from the top left to the bottom right.',
      'Then draw another slanted line from the top right to the bottom left.',
    ],
    strokes: [stroke('M48 42 L192 220'), stroke('M192 42 L48 220')],
  },
  {
    letter: 'Y',
    hint: 'Make the fork, then pull down the stem.',
    hint2: [
      'Draw slanted line form left top to middle.',
      'Then draw another slanted line from the top right to middle.',
      ' Then slide down to the bottom.',
    ],
    strokes: [
      stroke('M44 40 L120 128'),
      stroke('M196 40 L120 128'),
      stroke('M120 128 L120 220', [0, 1]),
    ],
  },
  {
    letter: 'Z',
    hint: 'Go across, zip diagonally, then across again.',
    hint2: [
      'Start at the top left and draw a line across to the right.',
      'Next, draw a slanted line down to the bottom left.',
      'Then draw a line across the bottom to the right',
    ],
    strokes: [
      stroke('M48 40 L192 40'),
      stroke('M192 40 L52 220'),
      stroke('M52 220 L196 220'),
    ],
  },
];
