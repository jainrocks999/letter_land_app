import { Platform, StyleSheet } from 'react-native';
import { isTablet, rf } from '../../utils/responsive';

const tablet = isTablet();

const contentWidth = {};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tablet ? rf(24) : rf(15),
    gap: rf(tablet ? 5 : 10),
  },
  headingSection: contentWidth,
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: rf(15),
  },
  indicatorText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 13 : 10),
    letterSpacing: 0.5,
    paddingVertical: rf(8),
    paddingHorizontal: rf(18),
    borderRadius: rf(50),
    borderWidth: 2,
  },
  matchingPairContainer: {
    ...contentWidth,
    borderWidth: 1.5,
    borderRadius: rf(10),
    marginVertical: rf(tablet ? 5: 10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: rf(tablet ? 16:20),
    position: 'relative',
    overflow: 'visible',
  },
  emojiColumnSection: {
    alignItems: 'center',
    zIndex: 2,
    justifyContent: 'space-around',
  },
  actInfoSection: {
    ...contentWidth,
    borderWidth: 1,
    borderBottomWidth: rf(7),
    borderRadius: rf(10),
    padding: rf(12),
    paddingBottom: Platform.OS==='ios'? tablet? 18: 0 : rf(10),
  },
  questionTextContainer: {
    width: rf(54),
    height: rf(54),
    borderRadius: rf(10),
    backgroundColor: '#ffffffd9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(32),
  },
  instructionTextContainer: {
    flex: 1,
    gap: rf(6),
    alignItems: 'center',
  },
  instructionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 22 : 17),
    color: '#1a105f',
    textAlign: 'center',
  },
  cocoImage: {
    width: rf(tablet? 110: Platform.OS==='ios'? 110: 130),
    height: rf(tablet?110:Platform.OS==='ios'? 110: 130),
    resizeMode: 'contain',
  },
  rowWithSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoSection: {
    gap: rf(tablet ? 22 : 12),
    width: '70%',
  },
});
