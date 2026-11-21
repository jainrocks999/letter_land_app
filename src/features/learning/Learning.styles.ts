import { Platform, StyleSheet } from 'react-native';
import { isTablet, rf } from '../../utils/responsive';

const tablet = isTablet();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tablet ? rf(24) : rf(15),
  },
  headingSection: {},
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: rf(10),
  },
  subText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(13),
    letterSpacing: 0.5,
    color: '#9e9e9e',
  },
  letterText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet? 110: 140),
    color: '#e85216',
  },
  lettersCard: {
    borderWidth: 1.5,
    borderRadius: rf(10),
    paddingBottom: rf(15),
    marginVertical: rf(15),
  },
  rowSpacebetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnIcon: {
    paddingHorizontal: rf(13),
    paddingVertical: rf(8),
    borderRadius: rf(20),
  },
  btnText: {
    paddingVertical:Platform.OS=='ios'? rf(15):0,
    fontSize: rf(22),
    fontFamily: 'Fredoka-Bold',
  },
  emojiContainer: {
    fontSize: rf(tablet ? 90: 120),
    lineHeight: rf(tablet ? 120 :170),
  },
  wordText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(18),
    letterSpacing: 0.5,
    color: '#9e9e9e',
  },
  letterSliderSection: {
    backgroundColor: '#fff',
    marginVertical: rf(10),
    borderRadius: rf(10),
  },
  letterSliderTitleText: {
    paddingTop: rf(15),
    textAlign: 'center',
  },
  lettersList: {
    gap: rf(10),
    paddingVertical: rf(15),
  },
  lettersListItem: {
    width: rf(50),
    height: rf(50),
    borderRadius: rf(10),
    borderWidth: 2,
  },
  playBtn: {
    width: rf(50),
    height: rf(56),
    borderRadius: rf(40),
    overflow: 'hidden',
  },
  btnWrapper: {
    borderRadius: rf(40),
    overflow: 'hidden',
    marginBottom: rf(6),
  },
  charecterSection: {
    borderWidth: 1,
    borderBottomWidth: rf(6),
    padding: rf(15),
    borderRadius: rf(10),
    gap: rf(10),
  },
  actionStatusSection: {
    flex: 1,
    top: -rf(5),
    right: rf(6),
    width: '75%',
    borderWidth: 1,
    borderRadius: rf(40),
    borderColor: '#e85216',
    opacity: 0.8,
    backgroundColor: '#ffffffb9',
  },
  wordContainer: {
    flex: tablet ? 2 :4,
    borderRadius: rf(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffcb',
  },
  imgContainer: {
    height: rf(tablet ? 120: Platform.OS=='ios'? 100 : 150),
    width: rf(tablet ? 120:150),
    justifyContent: 'space-between',
    marginBottom: rf(22),
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  imgTitle: {
    fontFamily: 'Fredoka-Bold',
    marginHorizontal: rf(tablet ? 5 :15),
    backgroundColor: '#fff',
    padding: rf(5),
    textAlign: 'center',
    borderRadius: 50,
    color: '#d84d16ce',
    fontSize: rf(12),
  },
  buttonsRow: {
    marginBottom: rf(10),
  },
});
