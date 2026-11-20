import { StyleSheet } from 'react-native';
import { isTablet, rf } from '../../utils/responsive';

const tablet = isTablet();

const contentWidth = {};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tablet ? rf(24) : rf(15),
    gap: rf( tablet ? 14:18),
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
  playAear: {
    ...contentWidth,
    backgroundColor: '#fff',
    paddingVertical: rf(12),
    paddingHorizontal: rf(12),
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: rf(7),
    borderRadius: rf(10),
    height: '62%',
    justifyContent: 'space-around',
  },
  speakBtn: {
    height: '10%',
    width: '13%',
    position: 'absolute',
    right: rf(10),
    top: rf(10),
  },
  questionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(20),
    width: '85%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    letterSpacing: 0.8,
  },
  targetLetterContainer: {
    width: '100%',
    height: tablet ? '40%':'30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: rf( tablet? 20: 10),
    borderWidth: 1,
    borderRadius: rf(15),
    borderBottomWidth: rf(7),
  },
  characterFeeback: {
    height: tablet ? '90%' : '100%',
    width: tablet ?'32%' :'37%',
    alignSelf: 'center',
    marginTop: 0,
  },
  letterEmojiSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '50%',
  },
  dropArea: {
    left: tablet ? 40 :0,
    width: '62%',
    height: '70%',
  },
  emoji: {

    fontSize: rf( tablet ? 140: 100),
    lineHeight: rf(tablet ? 160 : 120),
    right: rf(55),
  },
  optionsContainer: {
    width: '100%',
    height: tablet ? '40%':'50%',
    padding: rf(10),
    borderRadius: rf(20),
  },
});
