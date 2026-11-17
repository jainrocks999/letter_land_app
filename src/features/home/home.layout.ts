import { screenWidth, wp } from '../../utils/responsive';

// Width of one page of the castle carousel. Kept at 85% of the screen so the
// castle art sits fully centred with no part of the next page peeking in.
export const HOME_ITEM_WIDTH = wp(85);

// Padding that keeps the active page centred in the carousel.
export const HOME_ITEM_SIDE_PADDING = (screenWidth - HOME_ITEM_WIDTH) / 2;
