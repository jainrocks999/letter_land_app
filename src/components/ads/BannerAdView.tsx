import { useState } from 'react';
import { View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { rf } from '../../utils/responsive';
import appConfig from '../../../app.json';

const adsConfig = appConfig['react-native-google-mobile-ads'];

// Development me test ID, release me app.json wali real ID
const UNIT_ID = __DEV__ ? TestIds.ADAPTIVE_BANNER : adsConfig.androidBannerUnitId;

const STRIP_HEIGHT = 50;

const BannerAdView = () => {
  const [adWidth, setAdWidth] = useState(0);

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
      }}
      onLayout={event => {
        const width = Math.floor(event.nativeEvent.layout.width);
        if (width > 0) setAdWidth(width);
      }}
    >
      {adWidth > 0 && (
        <BannerAd
          unitId={UNIT_ID}
          size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
          width={adWidth}
          maxHeight={rf(STRIP_HEIGHT)}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          onAdFailedToLoad={error =>
            console.warn('[ads] banner failed:', error)
          }
        />
      )}
    </View>
  );
};

export default BannerAdView;
