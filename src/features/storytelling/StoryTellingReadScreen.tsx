import { Image, Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { ROUTES } from '../../app/navigation/routeNames';
import { StackRouteProps } from '../../types/navigation.types';
import { getStoryById } from './data/storytelling.data';
import { styles } from './StoryTelling.styles';
import TopBarRead from './components/TopBarRead';
import ProgressBar from '../../components/progressBar/ProgressBar';
import CharacterFeedback from '../../components/characterAnimation/CharacterFeedback';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ActionButton from '../../components/customButton/ActionButton';

const StoryTellingReadScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.STORYTELLINGREAD>>();
  const { data, storyId } = route.params;
  const story = getStoryById(storyId);
  //    console.log(story?.pages?.[0]?.image)
  return (
    <View
      style={[
        styles.container,
        styles.scrollContainer,
        { backgroundColor: `${data.lightColor}33` },
      ]}
    >
      <TopBarRead
        data={data}
        storyTitle={{
          title: story?.title,
          subText: story ? `Level ${story.level} · ${story.sound}` : undefined,
        }}
      />
      <View style={{ gap: 14 }}>
        <View style={styles.readProgressRow}>
          <View style={styles.flexOne}>
            <ProgressBar progress={10} bgColor="#ffffffcc" />
          </View>
          <Text
            style={[
              { backgroundColor: data.darkColor },
              styles.secondryText,
              styles.pageCount,
            ]}
          >
            {`page 1 to ${story?.pages.length ?? 0}`}
          </Text>
        </View>

        {story ? (
          <>
            <View
              style={[
                styles.readInfoCard,
                styles.readCoverCard,
                { borderColor: data.darkColor },
              ]}
            >
              <Image
                // source={story.banner}
                source={story?.pages?.[0]?.image}
                resizeMode="cover"
                style={[styles.readCover]}
              />

              <View style={[styles.storyReadCard, { gap: 0 }]}>
                <View style={[styles.flexRow, { marginTop: -65 }]}>
                  <CharacterFeedback
                    colors={data}
                    selectedOption={'w'}
                    isCorrect={true}
                    isSpeaking={false}
                    imgTop={8}
                    styles={styles.characterImage}
                  />
                  <View style={[styles.flexRow, styles.buddyStatusText]}>
                    <FontAwesome6
                      name="circle"
                      iconStyle="solid"
                      size={12}
                      color={data.midColor}
                    />
                    <Text
                      style={[styles.secondryText, { color: data.midColor }]}
                    >
                      Tap play and listen
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.bannerTitle,
                    { fontSize: 45, color: data.darkColor },
                  ]}
                >
                  {story?.pages?.[0]?.text}
                </Text>
                <Text style={[styles.secondryText, { color: '#9e9e9e' }]}>
                  Tap a word to sound it out.
                </Text>
              </View>
            </View>
            
            <View style={[styles.flexRow,{justifyContent:"space-between",alignItems:"flex-end"}]}>
              <ActionButton
                bottomBorderWidth={8}
                radius={50}
                backgroundColor={data.darkColor}
                bottomBorderColor={'#a43726'}
                onPress={() => {}}
              >
                <FontAwesome6
                  name="chevron-left"
                  iconStyle="solid"
                  size={20}
                  color={'#ffff'}
                />
              </ActionButton>

              <ActionButton
                bottomBorderWidth={8}
                radius={50}
                backgroundColor={'#ff6a26'}
                bottomBorderColor={'#c9460d'}
                onPress={() => {}}
                styles={{ height: 70, width: 70 }}
              >
                <FontAwesome6
                  name="play"
                  iconStyle="solid"
                  size={20}
                  color={'#ffff'}
                />
              </ActionButton>
              <ActionButton
                bottomBorderWidth={8}
                radius={50}
                backgroundColor={data.darkColor}
                bottomBorderColor={'#a43726'}
                onPress={() => {}}
              >
                <FontAwesome6
                  name="chevron-right"
                  iconStyle="solid"
                  size={20}
                  color={'#ffff'}
                />
              </ActionButton>
            </View>
          </>
        ) : (
          <Text style={[styles.bannerTitle, { color: data.darkColor }]}>
            Story not found
          </Text>
        )}
      </View>
    </View>
  );
};

export default StoryTellingReadScreen;
