module.exports = {
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'assets.coingecko.com',
      },
    ],
  },
};
