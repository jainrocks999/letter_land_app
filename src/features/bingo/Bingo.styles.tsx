import { StyleSheet } from 'react-native';
import { isTablet, rf, wp } from '../../utils/responsive';

const tablet = isTablet();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tablet ? rf(24) : rf(15),
    gap: rf(14),
  },
  askingCard: {
    width: '100%',
    height: '17%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: rf(15),
    borderWidth: 1,
    borderRadius: rf(15),
    borderBottomWidth: rf(7),
  },
  characterFeeback: {
    height: '100%',
    width:  tablet? '23%':'32%',
    alignSelf: 'center',
    marginTop: 0,
  },
  cardText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf( tablet ? 18 :13),
    letterSpacing: 0.5,
  },
  askingCopy: {
    flex: 1,
    gap: rf(3),
    alignItems: 'center',
  },
  difficultyBadge: {
    borderWidth: 1,
    borderRadius: rf(20),
    paddingHorizontal: rf(8),
    paddingVertical: rf(2),
    marginBottom: rf(2),
  },
  difficultyText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 15 : 9),
    letterSpacing: 0.4,
  },
  letterText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 70:80),
    color: '#e85216',
  },
  smallLetterCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomWidth: rf(7),
    paddingHorizontal: rf( tablet? 25: 18),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rf(20),
    borderColor: '#e85216',
  },
  letterCalledText: {
    borderWidth: 2,
    height: rf(25),
    width: rf(25),
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: rf(5),
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(18),
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
  calledRow: {
    flexDirection: 'row',
    gap: rf(10),
    alignItems: 'center',
    marginVertical: rf(10),
  },
  askingLetterLabel: {
    fontSize: rf(tablet ? 26 : 22),
    color: '#1a105f',
  },
  calledLabel: {
    color: '#9e9e9e',
  },
  calledList: {
    flexDirection: 'row',
    flex: 1,
    gap: rf(5),
    alignItems: 'center',
  },
  calledEmptyText: {
    fontFamily: 'Fredoka-Medium',
    fontSize: rf(tablet ? 14 : 12),
    color: '#9e9e9e',
    paddingVertical: rf(5),
  },
  statusText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(15),
    textAlign: 'right',
  },
  boardCard: {
    backgroundColor: '#fff',
    borderRadius: rf(10),
  },
  bingoColumnWrapper: {
    gap: rf(10),
  },
  bingoListContent: {
    gap: rf(10),
    width:tablet ? '50%':'100%',
    alignSelf:"center"
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: rf(10),
  },
  hearAgainIcon: {
    paddingVertical: rf(8),
  },
  bingoCell: {
    flex: 1,
    aspectRatio: 1,
  },
  bingoCellButton: {
    width: '100%',
    height: '100%',
  },
  bingoCellText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(29),
  },
  bingoCellStar: {
    position: 'absolute',
    top: rf(1),
    right: rf(3),
    fontSize: rf(17),
    color: '#F7B51B',
    textShadowColor: '#8B4B12',
    textShadowOffset: { width: 0.5, height: 1 },
    textShadowRadius: 1,
  },
  bingoOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 16, 95, 0.22)',
    zIndex: 999,
    elevation: 999,
  },
  confettiLayer: {
    position: 'absolute',
  },
  bingoTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(64),
    letterSpacing: 4,
    color: '#fff',
    textShadowColor: 'rgba(26, 16, 95, 0.45)',
    textShadowOffset: { width: 0, height: rf(5) },
    textShadowRadius: 1,
  },
  bingoSubtitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(17),
    color: '#fff',
    backgroundColor: 'rgba(26, 16, 95, 0.55)',
    paddingHorizontal: rf(16),
    paddingVertical: rf(6),
    borderRadius: rf(20),
    overflow: 'hidden',
    marginTop: rf(6),
  },
});
