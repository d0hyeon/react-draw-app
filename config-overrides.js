const {
  override,
  addBabelPreset,
  addBabelPlugins,
  disableEsLint,
} = require('customize-cra');

module.exports = override(
  disableEsLint(),
  addBabelPreset('@emotion/babel-preset-css-prop'),
  addBabelPlugins('@emotion'),
);
