import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    gap: 10,
  },
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // paddingVertical: 10,
    alignItems: 'center',
    gap: 15,
  },
  indicatorText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 50,
    borderWidth: 2,
  },
  matchingPairContainer: {
    borderWidth: 1.5,
    borderRadius: 10,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    position: 'relative',
    overflow: 'visible',
  },
  emojiColumnSection: {
    alignItems: 'center',
    zIndex: 2,
    justifyContent: 'space-around',
  },
  actInfoSection: {
    borderWidth: 1,
    borderBottomWidth: 7,
    borderRadius: 10,
    padding: 12,
    paddingBottom: 18,
  },
  questionTextContainer: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#ffffffd9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
  },
  instructionTextContainer: {
    flex: 1,
    gap: 6,
    alignItems: 'center',
  },
  instructionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 17,
    color: '#1a105f',
    textAlign: 'center',
  },
  cocoImage: {
    width: 92,
    height: 92,
    resizeMode: 'contain',
  },
});
