/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ["@delail/design-tokens", "@delail/content", "@delail/i18n", "@delail/core"],
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default config;
