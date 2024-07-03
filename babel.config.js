module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          //'crypto': 'react-native-quick-crypto',
          'cryptoR':'react-native-crypto',
          'stream': 'stream-browserify',
         // 'buffer': '@craftzdog/react-native-buffer',
          'randombytes':'react-native-randombytes',
          //'bn.js': 'react-native-bignumber',
          '@ethersproject/pbkdf2': './patch.js',
          'fs':'react-native-level-fs'
         },
       },
     ],
       
    ],
};
