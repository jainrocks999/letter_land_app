import { StyleSheet } from 'react-native';
import { hp, isTablet, rf, wp } from '../../utils/responsive';
import { HOME_ITEM_WIDTH } from '../../features/home/home.layout';

// Castle art is big on tablets, so cap it by height to leave room for the
// activity card, the platform and the heading.
const CASTLE_SIZE = Math.min(wp(70), hp(42));
const CHARACTER_SIZE = CASTLE_SIZE * 0.37;

const tablet=isTablet();

export const styles = StyleSheet.create({
  pageContainer: {
    width: HOME_ITEM_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityCard: {
    width: '96%',
    maxWidth: isTablet() ? 660 : undefined,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: rf(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: rf(tablet? 30 : 15),
    borderWidth: 2,
    borderBottomWidth: rf(7),
  },
  iconContainer: {
    width: '16%',
    alignItems: 'center',
    borderRadius: rf(10),
    borderWidth: 2,
    borderBottomWidth: rf(7),
  },
  icon: {
    padding: rf(10),
    fontSize: isTablet() ? rf(30) : 20,
  },
  contentSection: {
    width: '58%',
    gap: rf(tablet? 15: 12),
  },
  cardTitleText: {
    fontSize: rf(22),
    fontFamily: 'Fredoka-Bold',
    letterSpacing: 0.5,
  },
  descText: {
    fontSize: rf(13),
    fontFamily: 'Fredoka-Bold',
    color: '#9e9e9e',
  },
  tagText: {
    width: '60%',
    borderRadius: rf(20),
    textAlign: 'center',
    padding: rf(8),
    fontSize: rf(11),
    fontFamily: 'Fredoka-Bold',
  },
  cardBtnContainer: {
    paddingVertical: rf(14),
    borderRadius: 999,
    width: tablet? '12%' : '17%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: rf(7),
  },
  singlePage: {
    width: wp(100),
    alignItems: 'center',
  },
  singlePageContent: {
    width: '100%',
    alignItems: 'center',
  },
  // wraps the castle art so Buddy can be positioned right on top of it
  castleWrapper: {
    position: 'relative',
  },
  characterImage: {
    position: 'absolute',
    bottom: -rf(tablet? 16: 12),
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE,
    left: -rf(20),
    resizeMode: 'contain',
  },
  imgContainer: {
    width: CASTLE_SIZE,
    height: CASTLE_SIZE,
    resizeMode: 'contain',
  },
  // greys out the castle art while the level is still locked
  lockedImage: {
    filter: [{ grayscale: 1 }],
    opacity: 0.85,
  },
  bottomPlatform: {
    width: '80%',
    height: rf(20),
    backgroundColor: '#738f9c',
    borderTopLeftRadius: rf(12),
    borderTopRightRadius: rf(12),
  },
  headingContainer: {
    width: '100%',
    height: rf(120),
    backgroundColor: '#52656d',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: rf(15),
    borderColor: '#647c87',
  },
  headingText: {
    fontSize: rf(28),
    color: '#fff',
    fontFamily: 'Fredoka-Bold',
    textAlign: 'center',
  },
});
