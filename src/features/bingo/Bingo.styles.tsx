import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    gap: 14,
  },
  askingCard: {
    width: '100%',
    height: '17%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderBottomWidth: 7,
  },
  characterFeeback: {
    height: '100%',
    width: '32%',
    alignSelf: 'center',
    marginTop: 0,
  },
  cardText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  letterText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 80,
    color: '#e85216',
  },
  smallLetterCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomWidth: 7,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: '#e85216',
  },
  letterCalledText: {
    borderWidth: 2,
    height: 25,
    width: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5,
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
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
});
