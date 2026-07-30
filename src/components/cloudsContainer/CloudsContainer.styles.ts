import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/Responsive';

export const styles = StyleSheet.create({
  clouds: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  cloud1: {
    width: wp(55),
    height: hp(12),
    top: 30,
    opacity: 0.7,
  },
  cloud2: {
    width: wp(26),
    height: hp(12),
    top: 45,
    right: 60,
    opacity: 0.7,
  },
  cloud7: {
    width: wp(36),
    height: hp(12),
    top: 45,
    right: -100,
    opacity: 0.7,
  },
  cloud3: {
    width: wp(80),
    height: hp(14),
    top: 150,
    right: 10,
    opacity: 0.6,
  },
  cloud4: {
    width: wp(26),
    height: hp(12),
    top: 240,
    right: -80,
    opacity: 0.5,
  },
  cloud5: {
    width: wp(55),
    height: hp(12),
    top: 320,
    opacity: 0.4,
  },
  cloud6: {
    width: wp(55),
    height: hp(12),
    top: 380,
    right: -50,
    opacity: 0.4,
  },
});
