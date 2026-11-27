export enum AppUpdateType {
  FORCE = 'FORCE',
  OPTIONAL = 'OPTIONAL',
}

export const APP_UPDATE_CONFIG = {
  // Per release change karo: FORCE ya OPTIONAL
  UPDATE_TYPE: AppUpdateType.OPTIONAL,

  // iOS App Store lookup
  IOS_BUNDLE_ID: 'com.eflashapps.eletter',
  IOS_APP_STORE_URL: 'https://apps.apple.com/app/idYOUR_APP_ID', // App Store Connect app ID se replace karo
  LOOKUP_COUNTRY: 'in',

  // OPTIONAL update ko baar-baar na dikhao
  OPTIONAL_PROMPT_INTERVAL_MS: 24 * 60 * 60 * 1000,
};
