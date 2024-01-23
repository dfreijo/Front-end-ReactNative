export default {
  name: "codeflowmiviajep4",
  slug: "codeflowmiviajep4",
  version: "1.0.0",
  orientation: "portrait",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.codeflow.android",
    adaptiveIcon: {
      backgroundColor: "#FFFFFF",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
};
