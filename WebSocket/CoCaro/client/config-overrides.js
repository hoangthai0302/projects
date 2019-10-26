const {addDecoratorsLegacy, useBabelrc, injectBabelPlugin, useEslintRc, override} = require('customize-cra');

module.exports = override(
    addDecoratorsLegacy()
);