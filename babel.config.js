module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    'react-native-paper/babel',
    '@babel/plugin-transform-export-namespace-from'
  ],
};
