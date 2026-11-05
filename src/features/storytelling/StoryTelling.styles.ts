import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
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
  bannerImage: {
    height: 115,
    width: 115,
    borderRadius: 10,
  },
  bannerContent: {
    justifyContent: 'space-between',
    width: '48%',
  },
  levelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readCover: {
    width: '100%',
    height: 215,
    // borderRadius: 20,
  },
  readCoverCard: {
    padding: 0,
    overflow: 'hidden',
    gap: 0,
  },
  readProgressRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  flexOne: {
    flex: 1,
  },
  readInfoCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderBottomWidth: 6,
    borderRadius: 20,
    padding: 15,
    gap: 6,
  },
  storyReadCard: {
    borderTopWidth: 2.5,
    borderStyle: 'dashed',
    borderColor: '#9e9e9e',
    padding: 15,
    gap: 6,
  },
  storyColumnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  storyListContent: {
    marginBottom: 20,
    gap: 12,
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
    overflow: 'hidden',
  },
  cardTagText: {
    position: 'absolute',
    backgroundColor: '#9e9e9e',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignSelf: 'flex-start',
    margin: 10,
  },
  pageCount: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buddyStatusText: {
    backgroundColor: '#ffff',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 50,
  },
  characterImage: {
    height: 90,
    width: 90,
    marginTop: 0,
  },
});
