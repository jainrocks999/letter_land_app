import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { ROUTES } from '../../app/navigation/routeNames';
import { useRoute } from '@react-navigation/native';
import { StackRouteProps } from '../../types/navigation.types';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import { styles } from './StoryTelling.styles';
import ActionButton from '../../components/customButton/ActionButton';
import LevelTopheader from './components/LevelTopheader';
import ProgressBar from '../../components/progressBar/ProgressBar';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { FlatList } from 'react-native-gesture-handler';
import StoryCard from './components/StoryCard';

const StoryTellingListScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.STORYTELLINGLIST>>();
  const { data } = route.params;

  return (
    <ScrollView
      // style={[styles.container, { backgroundColor: `${data.lightColor}33` }]}
      style={[styles.container,{backgroundColor: `${data.lightColor}33`}]}
  contentContainerStyle={styles.scrollContainer}
    >
      <CustomTopbar data={data} />
      <ScreenHeadingSection
        heading="Story Time"
        subText="Read, sound out and spell with Buddy!"
      />
      <View>
        <LevelTopheader data={data} />
      </View>
      <View
        style={[
          styles.banner,
          {
            borderColor: data.darkColor,
            backgroundColor: `${data.darkColor}4d`,
          },
        ]}
      >
        <View
          style={{
            height: 115,
            width: 115,
            borderRadius: 10,
            backgroundColor: 'red',
          }}
        />
        <View style={{ justifyContent: 'space-between', width: '48%' }}>
          <Text
            style={[
              styles.tagText,
              { backgroundColor: data.lightColor, color: data.darkColor },
            ]}
          >
            Keep reading
          </Text>

          <Text style={styles.bannerTitle}>Sam the Cat</Text>
          <Text style={styles.secondryText}>
            Sound: short a · cat, hat, mat
          </Text>
          <ProgressBar progress={10} bgColor="#ffffffcc" />
        </View>

        <ActionButton
          bottomBorderWidth={5}
          radius={50}
          backgroundColor={data.darkColor}
          bottomBorderColor={'#a43726'}
          onPress={() => {}}
        >
          <FontAwesome6
            name="play"
            iconStyle="solid"
            size={16}
            color={'#a43726'}
          />
        </ActionButton>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.bannerTitle, { color: data.darkColor }]}>
          Level 1 · 3-letter words
        </Text>
        <Text style={[styles.secondryText, styles.storiesCounter]}>
          4 stories
        </Text>
      </View>

      <FlatList
        data={[1, 2, 3, 4]}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 12,
        }}
        contentContainerStyle={{ marginBottom: 20, gap: 12 }}
        renderItem={({ item }) => <StoryCard data={data} />}
      />
    </ScrollView>
  );
};

export default StoryTellingListScreen;
