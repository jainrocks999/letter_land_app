import { Platform, StyleSheet } from 'react-native';
import { hp, rf, wp } from '../../utils/responsive';

export const styles = StyleSheet.create({
  skipBtn: {
    top: 15,
    right: 15,
    borderWidth: 2,
    borderRadius: 20,
    position: 'absolute',
    paddingVertical: 8,
    paddingHorizontal: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffffb3',
    borderColor: '#ffffffe0',
  },
  skipBtnText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: '#0000008a',
  },
  actionNextBtn: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
  },
  singleSlide: {
    height: hp(95),
    width: wp(100),
    paddingTop: Platform.OS=='ios' ? 0 : 70,
  },
  slideCard: {
    marginTop: Platform.OS=='ios'? rf(70): 0,
    height: Platform.OS=='ios'? '70%':'77%',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderWidth: 2,
    borderBottomWidth: 7,
    borderRadius: 20,
    borderColor: '#d84e16',
    gap: 20,
  },
  badgeSection: {
    flexDirection: 'row',
    backgroundColor: '#ffe8e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  badgeIconSection: {
    padding: 6,
    backgroundColor: '#fff',
    fontSize: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffccbc',
  },
  badgeText: {
    fontSize: 13,
    fontFamily: 'Fredoka-Bold',
    color: '#d84e16',
  },
  cardImgContainer: {
    // height: hp(35),
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardImg: {
    height: '100%',
    width: '100%',
  },

  cardTitleText: {
    fontSize: 34,
    color: '#1a105f',
    fontFamily: 'Fredoka-Bold',
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: 30,
  },
  cardDescriptionText: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: 25,
    // borderWidth: 1,
  },
  dotContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: Platform.OS=='ios'? rf(105):rf(145),
  },
  btnText: {
    fontSize: 22,
    fontFamily: 'Fredoka-Bold',
    color: '#fff',
    padding:Platform.OS==='ios'? rf(20):0
  },
  btnIcon: {
    backgroundColor: '#ffffff66',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight:Platform.OS==='ios'? rf(20):0
  },
});
