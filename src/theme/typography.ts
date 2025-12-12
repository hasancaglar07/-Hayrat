export const fontFamilies = {
  ui: "InterVariable",
  uiBold: "InterVariable",
  arabic: "ScheherazadeNew-Regular",
  arabicBold: "ScheherazadeNew-Bold",
};

// Centralized typography scales for consistent sizing/line-height
export const textStyles = {
  body: {
    fontFamily: fontFamilies.ui,
    fontSize: 17,
    lineHeight: 26,
  },
  bodyMedium: {
    fontFamily: fontFamilies.ui,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "600",
  },
  subtitle: {
    fontFamily: fontFamilies.ui,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
  },
  title: {
    fontFamily: fontFamilies.ui,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },
  arabic: {
    fontFamily: fontFamilies.arabic,
    fontSize: 19,
    lineHeight: 30,
  },
  arabicBold: {
    fontFamily: fontFamilies.arabicBold,
    fontSize: 19,
    lineHeight: 30,
  },
  link: {
    fontFamily: fontFamilies.ui,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
};
