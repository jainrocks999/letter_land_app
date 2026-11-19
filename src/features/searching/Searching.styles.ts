import { StyleSheet } from 'react-native';
import { isTablet, rf } from '../../utils/responsive';

const tablet = isTablet();

const contentWidth = {};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tablet ? rf(24) : rf(15),
    gap: rf(18),
  },
  headingSection: contentWidth,
  challengeInfoContainer: {
    ...contentWidth,
    paddingVertical: rf(15),
    paddingHorizontal: rf(10),
    marginBottom: rf(10),
    borderRadius: rf(20),
    borderWidth: 1,
    borderBottomWidth: rf(7),
    gap: rf(10),
  },
  badgeText: {
    borderRadius: rf(20),
    width: '40%',
    textAlign: 'center',
    padding: rf(8),
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 16 : 13),
  },
  normalHeadingText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 22 : 16),
  },
  playArea: {
    ...contentWidth,
    backgroundColor: '#fff',
    paddingVertical: rf(12),
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: rf(7),
    borderRadius: rf(10),
    height: '62%',
  },
  playBtn: {
    borderWidth: 3,
    paddingVertical: rf(tablet ? 15 : 10),
    paddingHorizontal: rf(tablet ? 18 : 13),
    borderRadius: rf(50),
    elevation: 5,
    backgroundColor: '#fff',
    top: -rf(20),
  },
  questionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 28 : 25),
    marginHorizontal: rf(35),
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  optionsContianer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
    gap: rf(25),
    marginVertical: 'auto',
  },
  optionBtn: {
    borderWidth: 3,
    // height: rf(70),
    width: '35%',
    borderRadius: rf(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTxt: {
    fontFamily: 'Fredoka-Medium',
    fontSize: rf(tablet ? 50 : 30),
    paddingVertical: rf(10),
  },
});
