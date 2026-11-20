import { StyleSheet } from 'react-native';
import { isTablet, rf } from '../../utils/responsive';

const tablet = isTablet();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tablet ? rf(24) : rf(15),
    gap: rf(14),
  },
  rowSpacebetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderBottomWidth: rf(6),
    borderRadius: rf(10),
    padding: rf(15),
    gap: rf(10),
  },
  emojiBox: {
    backgroundColor: '#fff',
    padding: rf(20),
    borderRadius: rf(10),
  },
  emoji: { fontSize: rf(tablet ? 90 : 70) },
  cardInfo: { flex: 1 },
  letterText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 55 : 35),
    letterSpacing: 2,
  },
  speakBtn: { height: rf(tablet ? 55: 45), width: rf(tablet ? 55:45) },
  hintRow: { justifyContent: 'flex-end' },
  hintPill: {
    backgroundColor: '#fdf4ee',
    justifyContent: 'flex-start',
    gap: rf(8),
    flex: 1,
    borderWidth: 2,
    borderColor: '#f08a5d',
    borderRadius: rf(50),
    paddingVertical: rf(5),
    paddingHorizontal: rf(8),
    // bottom:tablet ? rf(-50):0
  },
  hintText: {
    flexShrink: 1,
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 16:12),
    color: '#e8541a',
  },
  character: { height: rf(tablet ? 120:80), width: rf(tablet ? 120:80), resizeMode: 'contain' },
  playArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomWidth: rf(7),
    borderRadius: rf(15),
    padding: rf(15),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  roundBadge: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: rf(20),
    paddingVertical: rf(6),
    paddingHorizontal: rf(14),
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet? 18 : 13),
    color: '#fff',
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tilesTray: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: rf(18),
    paddingVertical: rf(18),
    paddingHorizontal: rf(10),
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  dashborder: {
    borderTopWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#dfdfdf',
    width: '100%',
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rf(10),
  },
  buttonText: {
    fontFamily: 'Fredoka-Bold',
    color: '#fff',
    fontSize: rf(21),
  },
  buttonIcon: {
    backgroundColor: '#ffffff66',
    paddingHorizontal: rf(11),
    paddingVertical: rf(8),
    borderRadius: rf(20),
  },
});
