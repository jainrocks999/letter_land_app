import { StyleSheet } from 'react-native';
import { isTablet, rf, wp } from '../../utils/responsive';

const tablet = isTablet();

const contentWidth = {};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: tablet ? rf(24) : rf(15),
    gap: rf(12),
  },
  headingSection: contentWidth,
  traceSection: {
    ...contentWidth,
    flex: 1,
    minHeight: rf(250),
  },
  startBadge: {
    position: 'absolute',
    top: rf(14),
    left: rf(14),
    backgroundColor: '#ffffffee',
    borderRadius: rf(40),
    paddingHorizontal: rf(14),
    paddingVertical: rf(8),
    borderWidth: 1,
    borderColor: '#ff8a2b',
  },
  startBadgeText: {
    fontFamily: 'Fredoka-Bold',
    color: '#d84e16',
    fontSize: rf(12),
  },
  tracingProgressSection: {
    minHeight: rf(50),
    backgroundColor: '#fffdf8',
  },
  infoSection: {
    ...contentWidth,
    minHeight: rf(110),
    borderWidth: 1,
    borderBottomWidth: rf(6),
    borderRadius: rf(10),
    padding: rf(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: rf(10),
  },
  feedbackCopy: {
    flex: 1,
    gap: rf(6),
  },
  letterPill: {
    width: rf(tablet ? 65 : 54),
    height: rf(tablet ? 65 : 54),
    borderRadius: rf(10),
    backgroundColor: '#ffffffd9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterPillText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(tablet ? 50 : 32),
  },
  statusText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(17),
    color: '#1a105f',
  },
  hintText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: rf(12),
    color: '#c48c83',
    lineHeight: rf(15),
    letterSpacing: 0.5,
  },
  activeHintText: {
    color: '#d84d16ce',
    fontSize: rf(17),
  },
  characterImage: {
    width: rf(92),
    height: rf(92),
    resizeMode: 'contain',
  },
  actionRow: {
    ...contentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: rf(10),
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
  tracingProgress: {
    backgroundColor: '#f4e2dd',
    borderRadius: rf(20),
  },
  traceProgessText: {
    paddingHorizontal: rf(12),
    paddingVertical: rf(6),
  },
  characterMsg: {
    borderWidth: 0,
    position: 'absolute',
    backgroundColor: '#fff',
    width: Math.min(wp(50), 320),
    padding: rf(10),
    right: rf(75),
    top: -rf(20),
    borderTopLeftRadius: rf(20),
    borderBottomLeftRadius: rf(20),
    borderTopRightRadius: rf(20),
  },
});
