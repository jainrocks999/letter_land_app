import { StyleSheet } from 'react-native';
import { wp } from '../../utils/Responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90d5fc',
  },
  imgSection: {
    width: wp(90),
    height: wp(90),
    resizeMode: 'contain',
  },
});
