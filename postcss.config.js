const postcssNormalize = require('postcss-normalize');

module.exports = {
  map: true,
  plugins: [
    require('postcss-flexbugs-fixes'),
    // #https://github.com/csstools/postcss-preset-env
    require('postcss-preset-env')({
      // #https://github.com/postcss/autoprefixer#options
      autoprefixer: {
        flex: true, // (boolean|string): should Autoprefixer add prefixes for flexbox properties. With "no-2009" value Autoprefixer will add prefixes only for final and IE 10 versions of specification. Default is true.
      },
      stage: 3,
    }),
    // Adds PostCSS Normalize as the reset css with default options,
    // so that it honors browserslist config in package.json
    // which in turn let's users customize the target behavior as per their needs.
    // #https://github.com/csstools/postcss-normalize
    postcssNormalize(),
  ],
};
