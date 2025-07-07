import 'dotenv/config';

export default {
  expo: {
    name: "VerseNotes",
    slug: "VerseNotes",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      compileSdkVersion: 34,
      targetSdkVersion: 34,
      minSdkVersion: 33,
      supportsTablet: true,
      screenOrientation: "default",
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // Note: No API key required for bible-api.com (WEB translation)
      bibleApiUrl: 'https://bible-api.com',
    },
  },
}; 