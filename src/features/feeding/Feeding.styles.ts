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
    fontSize: rf(13),
  },
  normalHeadingText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(16),
  },
  trayImg:{
    height:"100%",
    width: tablet ? "60%":"100%",
    alignSelf:"center",
  },
  playArea: {
    ...contentWidth,
    backgroundColor: '#fff',
    paddingVertical: rf(12),
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: rf(7),
    borderRadius: rf(10),
    height: tablet ? '60%':"62%",
  },
  speakBtn: {
    height: '10%',
    width: '13%',
    position: 'absolute',
    right: rf(10),
    top: rf(10),
  },
  questionText: {
    paddingLeft: rf(20),
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(23),
    width: '85%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    letterSpacing: 0.8,
    marginBottom: rf(10),
  },
  targetLetterContainer: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: rf(10),
    borderWidth: 1,
    borderRadius: rf(15),
    borderBottomWidth: rf(7),
  },
  optionsContainer: {
    width: '100%',
    height: '50%',
  },
});
