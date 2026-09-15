import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  subText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 13,
    letterSpacing: 0.5,
    color: '#9e9e9e',
  },
  letterText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 140,
    // color: '#d84e16',
    color: '#e85216',
    // lineHeight: 150,
  },
  lettersCard: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingBottom: 15,
    marginVertical: 15,
    // marginHorizontal: 10,
  },

  rowSpacebetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnIcon: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnText: {
    fontSize: 22,
    fontFamily: 'Fredoka-Bold',
  },
  emojiContainer: {
    fontSize: 120,
    lineHeight: 170,
  },
  wordText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#9e9e9e',
  },
  letterSliderSection: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
  },
  letterSliderTitleText: {
    paddingTop: 15,
    textAlign: 'center',
  },
  lettersList: {
    gap: 10,
    paddingVertical: 15,
  },
  lettersListItem: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
  },

  playBtn: {
    width: 50,
    height: 56,
    borderRadius: 40,
    overflow: 'hidden',
  },
  btnWrapper: {
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 6,
  },
  charecterSection: {
    borderWidth: 1,
    borderBottomWidth: 6,
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  actionStatusSection: {
    flex: 1,
    top: -5,
    right: 6,
    width: '75%',
    borderWidth: 1,
    borderRadius: 40,
    borderColor: '#e85216',
    opacity: 0.8,
    backgroundColor: '#ffffffb9',
  },
  wordContainer: {
    flex: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffcb',
  },
  imgContainer: {
    height: 150,
    width: 150,
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  imgTitle: {
    fontFamily: 'Fredoka-Bold',
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 5,
    textAlign: 'center',
    borderRadius: 50,
    color: '#d84d16ce',
    fontSize: 12,
  },
});
