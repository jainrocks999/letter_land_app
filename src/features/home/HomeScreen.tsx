import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import CloudsContainer from '../../components/cloudsContainer/CloudsContainer';
import CastleCarousel from '../../components/castleCarousel/CastleCarousel';
import { activityData } from './data/home.data';
import AnimatedGradient from '../../components/animatedGradient/AnimatedGradient';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  return (
    <View style={{ flex: 1 }}>
      {activityData.map((castle, index) => (
        <AnimatedGradient
          key={castle.id ?? index}
          index={index}
          scrollX={scrollX}
          colors={[castle.topSkyCol, castle.bottomSkyCol]}
        />
      ))}
      <TouchableOpacity style={styles.settingsBtn}>
        <FontAwesome6 name="gear" iconStyle="solid" size={23} color="#fff" />
      </TouchableOpacity>
      <CloudsContainer scrollX={scrollX} />

      <CastleCarousel
        data={activityData}
        // currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        scrollX={scrollX}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  settingsBtn: {
    top: 15,
    right: 15,
    backgroundColor: '#54c507',
    padding: 13,
    position: 'absolute',
    borderRadius: '100%',
    borderWidth: 2,
    borderBottomWidth: 7,
    borderColor: '#429509',
    zIndex: 1,
  },
});
