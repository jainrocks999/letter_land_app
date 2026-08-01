import { StyleSheet } from 'react-native';
import { wp } from '../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    gap: 12,
  },
  traceSection: {
    flex: 1,
    minHeight: 250,
  },
  startBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#ffffffee',
    borderRadius: 40,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ff8a2b',
  },
  startBadgeText: {
    fontFamily: 'Fredoka-Bold',
    color: '#d84e16',
    fontSize: 12,
  },
  tracingProgressSection: {
    minHeight: 50,
    backgroundColor: '#fffdf8',
  },
  infoSection: {
    minHeight: 110,
    borderWidth: 1,
    borderBottomWidth: 6,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  feedbackCopy: {
    flex: 1,
    gap: 6,
  },
  letterPill: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#ffffffd9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterPillText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
  },
  statusText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 17,
    color: '#1a105f',
  },
  hintText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 12,
    color: '#999696',
    lineHeight: 15,
    letterSpacing: 0.5,
  },
  activeHintText: {
    color: '#d84d16ce',
    fontSize: 17,
  },
  characterImage: {
    width: 92,
    height: 92,
    resizeMode: 'contain',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    fontFamily: 'Fredoka-Bold',
    color: '#fff',
    fontSize: 21,
  },
  buttonIcon: {
    backgroundColor: '#ffffff66',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tracingProgress: {
    // position:"absolute",
    // top:10,
    // right:10,
    backgroundColor: '#f4e2dd',
    borderRadius: 20,
  },
  traceProgessText: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  characterMsg: {
    borderWidth: 0,
    position: 'absolute',
    backgroundColor: '#fff',
    width: wp(50),
    padding: 10,
    right: 75,
    top: -20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
