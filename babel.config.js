// new

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Your existing plugin
    'react-native-paper/babel', // Add React Native Paper plugin
  ],
};

// old
// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: ['react-native-reanimated/plugin'],
// };


