import { StyleSheet } from 'react-native';
import { hp, rf, wp } from '../../utils/responsive';

export const styles = StyleSheet.create({
  clouds: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  cloud1: {
    width: wp(55),
    height: hp(12),
    top: hp(3.7),
    opacity: 0.7,
  },
  cloud2: {
    width: wp(26),
    height: hp(12),
    top: hp(5.5),
    right: rf(60),
    opacity: 0.7,
  },
  cloud7: {
    width: wp(36),
    height: hp(12),
    top: hp(5.5),
    right: -rf(100),
    opacity: 0.7,
  },
  cloud3: {
    width: wp(80),
    height: hp(14),
    top: hp(18.5),
    right: rf(10),
    opacity: 0.6,
  },
  cloud4: {
    width: wp(26),
    height: hp(12),
    top: hp(29.5),
    right: -rf(80),
    opacity: 0.5,
  },
  cloud5: {
    width: wp(55),
    height: hp(12),
    top: hp(39.5),
    opacity: 0.4,
  },
  cloud6: {
    width: wp(55),
    height: hp(12),
    top: hp(47),
    right: -rf(50),
    opacity: 0.4,
  },
});
