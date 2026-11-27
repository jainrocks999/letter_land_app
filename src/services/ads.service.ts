import MobileAds, {
  AdsConsent,
  AgeRestrictedTreatment,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';

let started = false;

export const initAds = async () => {
  if (started) return;
  started = true;

  try {
    await MobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      ageRestrictedTreatment: AgeRestrictedTreatment.CHILD,
    });

    let canRequestAds = true;
    try {
    } catch {
      canRequestAds = (await AdsConsent.getConsentInfo()).canRequestAds;
    }

    if (canRequestAds) {
      await MobileAds().initialize();
    }
  } catch (error) {
    console.warn('[ads] init failed:', error);
  }
};
