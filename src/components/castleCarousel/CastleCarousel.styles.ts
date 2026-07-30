import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/Responsive';

export const styles = StyleSheet.create({
  pageContainer: {
    width: wp(85),
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: hp(95),
    gap: '18%',
  },
  activityCard: {
    width: '96%',
    // height: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderBottomWidth: 7,
  },
  iconContainer: {
    width: '16%',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 7,
  },
  icon: {
    padding: 10,
    fontSize: 20,
  },
  contentSection: {
    width: '58%',
    gap: 12,
  },
  cardTitleText: {
    fontSize: 22,
    fontFamily: 'Fredoka-Bold',
    letterSpacing: 0.5,
  },
  descText: {
    fontSize: 13,
    fontFamily: 'Fredoka-Bold',
    color: '#9e9e9e',
  },
  tagText: {
    width: '60%',
    borderRadius: 20,
    textAlign: 'center',
    padding: 8,
    fontSize: 11,
    fontFamily: 'Fredoka-Bold',
  },
  cardBtnContainer: {
    paddingVertical: 14,
    borderRadius: '100%',
    width: '17%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 7,
  },
  singlePage: {
    width: wp(100),
    // flex: 1,
    // justifyContent: 'flex-end',
    alignItems: 'center',
  },
  singlePageContent: {
    width: '100%',
    alignItems: 'center',
  },
  imgContainer: {
    width: wp(70),
    height: wp(70),
    resizeMode: 'contain',
  },
  bottomPlatform: {
    width: '80%',
    height: 20,
    backgroundColor: '#738f9c',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headingContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#52656d',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 15,
    borderColor: '#647c87',
  },
  headingText: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Fredoka-Bold',
    textAlign: 'center',
  },
});
