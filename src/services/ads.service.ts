import mobileAds, {
  AdsConsent,
  AgeRestrictedTreatment,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';
import appConfig from '../../app.json';

const adsConfig = appConfig['react-native-google-mobile-ads'];

let started = false;

export const initAds = async () => {
  if (started) return;
  started = true;

  try {
    const childDirected = adsConfig.childDirectedOnly === true;

    // Consent aur request config — initialize() se PEHLE
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: childDirected
        ? MaxAdContentRating.G
        : MaxAdContentRating.PG,
      ageRestrictedTreatment: childDirected
        ? AgeRestrictedTreatment.CHILD
        : AgeRestrictedTreatment.UNSPECIFIED,
    });

    let canRequestAds = true;

    try {
      await AdsConsent.gatherConsent();
      canRequestAds = (await AdsConsent.getConsentInfo()).canRequestAds;
    } catch (error) {
      console.warn('[ads] consent check skipped:', error);
    }

    if (canRequestAds) {
      await mobileAds().initialize();
    }
  } catch (error) {
    console.warn('[ads] init failed:', error);
  }
};
