import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  scrollContainer:{
    paddingHorizontal: 15,
    paddingVertical: 14,
    gap: 14,
  },
  banner: {
    borderWidth: 1,
    borderBottomWidth: 6,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 15,
  },
  tagText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 13,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  bannerTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: '#1a105f',
    // marginTop:-10
  },
  secondryText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#faf4f2',
  },
  storiesCounter: {
    backgroundColor: '#9e9e9e',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignSelf: 'flex-end',
  },
  storyCard: {
    width: '48%',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderBottomWidth: 6,
    overflow:"hidden",
  },
  cardTagText:{
    position:'absolute',
    backgroundColor: '#9e9e9e',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignSelf: 'flex-start',
    margin :10
  }
});
