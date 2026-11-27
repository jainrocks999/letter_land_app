import { useState } from 'react';
import { View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { rf } from '../../utils/responsive';

const UNIT_ID = TestIds.BANNER;
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
        //   size={BannerAdSize.BANNER}
            width={adWidth}
          maxHeight={rf(STRIP_HEIGHT)}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          onAdFailedToLoad={error =>
            console.warn('[[ads] banner failed:', error)
          }
        />
      )}
    </View>
  );
};

export default BannerAdView;
