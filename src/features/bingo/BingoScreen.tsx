import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { styles } from './Bingo.styles';
import { ROUTES } from '../../app/navigation/routeNames';
import { useRoute } from '@react-navigation/native';
import { StackRouteProps } from '../../types/navigation.types';
import CustomTopbar from '../../components/customTopbar/CustomTopbar';
import ScreenHeadingSection from '../../components/screenHeadingSection/ScreenHeadingSection';
import CharacterFeedback from '../../components/characterAnimation/CharacterFeedback';
import CustomButton from '../../components/customButton/CustomButton';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ActionButton from '../../components/customButton/ActionButton';

const LETTERS = [
  { id: '1', letter: 'B', active: true },
  { id: '2', letter: 'M', active: true },
  { id: '3', letter: 'S', active: false },
  { id: '4', letter: 'K', active: false },
  { id: '5', letter: 'D', active: false },
  { id: '6', letter: 'A', active: true },
  { id: '7', letter: 'R', active: false },
  { id: '8', letter: 'F', active: false },
  { id: '9', letter: 'T', active: false },
  { id: '10', letter: 'H', active: true },
  { id: '11', letter: 'E', active: false },
  { id: '12', letter: 'N', active: false },
  { id: '13', letter: 'G', active: false },
  { id: '14', letter: 'P', active: false },
  { id: '15', letter: 'L', active: false },
  { id: '16', letter: 'C', active: false },
];

const BingoScreen = () => {
  const route = useRoute<StackRouteProps<typeof ROUTES.BINGO>>();
  const { data } = route.params;
  return (
    <View
      style={[styles.container, { backgroundColor: `${data.lightColor}33` }]}
    >
      <CustomTopbar data={data} progress={10} />
      <ScreenHeadingSection
        heading={data.cardTitle}
        subText="Listen to Buddy and find the letter!"
      />
      <View
        style={[
          styles.askingCard,
          {
            borderColor: data.darkColor,
            alignItems: 'center',
            backgroundColor: `${data.darkColor}1A`,
          },
        ]}
      >
        <CharacterFeedback
          colors={data}
          selectedOption={null}
          isCorrect={false}
          styles={styles.characterFeeback}
          isSpeaking={false}
          imgTop={25}
        />
        <View>
          <Text style={[styles.cardText, { color: data.darkColor }]}>
            Buddy says, find…
          </Text>
          <Text style={[styles.cardText, { fontSize: 22, color: '#1a105f' }]}>
            the letter
          </Text>
        </View>
        <Text style={[styles.letterText, styles.smallLetterCard]}>H</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          marginVertical: 10,
        }}
      >
        <Text style={[styles.cardText, { color: '#9e9e9e' }]}>Called:</Text>
        <View style={{ flexDirection: 'row', flex: 1, gap: 5 }}>
          <Text
            style={[
              styles.letterCalledText,
              { color: data.midColor, borderColor: `${data.midColor}A1` },
            ]}
          >
            S
          </Text>
          <Text
            style={[
              styles.letterCalledText,
              { color: data.midColor, borderColor: `${data.midColor}A1` },
            ]}
          >
            A
          </Text>
          <Text
            style={[
              styles.letterCalledText,
              { color: data.midColor, borderColor: `${data.midColor}A1` },
            ]}
          >
            J
          </Text>
          <Text
            style={[
              styles.letterCalledText,
              { color: data.midColor, borderColor: `${data.midColor}A1` },
            ]}
          >
            W
          </Text>
          <Text
            style={[
              styles.letterCalledText,
              { color: data.midColor, borderColor: `${data.midColor}A1` },
            ]}
          >
            B
          </Text>
          <Text
            style={[
              styles.letterCalledText,
              { color: data.midColor, borderColor: `${data.midColor}A1` },
            ]}
          >
            T
          </Text>
        </View>
        <Text style={[styles.cardText, { fontSize: 15, color: '#277630' }]}>
          Great!
        </Text>
      </View>
      <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10 }}>
        <FlatList
          data={LETTERS}
          keyExtractor={item => item.id}
          numColumns={4}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <ActionButton
              bottomBorderWidth={5}
              radius={10}
              backgroundColor={item.active ? '#FCE2D1' : '#DCCDE6'}
              bottomBorderColor={item.active ? '#F58C62' : '#A986BC'}
              onPress={() => {}}
              styles={{ flex: 1, height: 70 }}
            >
              <Text
                style={[
                  styles.cardText,
                  { fontSize: 29 },
                  item.active ? { color: '#C8460E' } : { color: '#604080' },
                ]}
              >
                {item.letter}
              </Text>
              {item.active && (
                <Text
                  style={{
                    position: 'absolute',
                    top: 1,
                    right: 3,
                    fontSize: 17,
                    color: '#F7B51B',
                    textShadowColor: '#8B4B12',
                    textShadowOffset: { width: 0.5, height: 1 },
                    textShadowRadius: 1,
                  }}
                >
                  ★
                </Text>
              )}
            </ActionButton>
          )}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
        }}
      >
        <CustomButton
          width={'48%'}
          paddingBottom={9}
          btnRadius={15}
          padding={12}
          bottomBorderColor={true ? '#0d8f3e' : '#b3b3b3'}
          colors={true ? ['#35c46b', '#1ca952'] : ['#d9d9d9', '#c4c4c4']}
          onPress={() => {}}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Hear again</Text>
            <FontAwesome6
              name={'volume-high'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={{ paddingVertical: 8 }}
            />
          </View>
        </CustomButton>
        <CustomButton
          width={'48%'}
          paddingBottom={9}
          btnRadius={15}
          padding={12}
          bottomBorderColor={'#d84e16'}
          colors={['#ff7b38', '#ff6425']}
          onPress={() => {}}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Next</Text>
            <FontAwesome6
              name={'chevron-right'}
              iconStyle="solid"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
          </View>
        </CustomButton>
      </View>
    </View>
  );
};

export default BingoScreen;
