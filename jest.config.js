const { defaults: tsjPreset } = require("ts-jest/presets") // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  ...tsjPreset,
  cacheDirectory: ".jest/cache",
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  preset: "react-native",
  testPathIgnorePatterns: ['dist', 'node_modules'],
  transform: {
    ...tsjPreset.transform,
    "\\.ts$": "<rootDir>/node_modules/react-native/jest/preprocessor.js"
  },
};