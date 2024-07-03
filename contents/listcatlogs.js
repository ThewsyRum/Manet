import {StyleSheet, Text, View, Image} from 'react-native';
import {useColorScheme} from 'react-native';
import colors from '../config/colors';
import colordark from '../config/colordark';
import dimensions from '../config/dimensions';
import {CYPTO_ICON} from './iconuri';

const CataLogs = props => {
  let textProp = props.text;
  //alert(textProp)
  const scheme = useColorScheme();
  let icon = '../icons/' + props.icon;
  // console.log(CYPTO_ICON.bitcoin.uri)
  const walletSty = StyleSheet.create({
    wallet: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      alignItems: 'center',
      borderColor: scheme === 'dark' ? colordark.borderStk : colors.borderStk, //colors.borderStk,
      borderWidth: 1,
      borderRadius: 20,
      marginBottom: 10,
    },
  });
  return (
    <View style={walletSty.wallet}>
      <Image
        source={props.icon}
        style={{width: '20%', height: '100%', padding: '10%'}}
      />

      <Text
        style={{
          flex: 4,
          paddingLeft: '10%',
          color: scheme === 'dark' ? colordark.textColor : colors.textColor,
        }}>
        {textProp}
      </Text>
      <Text
        style={{
          flex: 2,
          paddingLeft: '10%',
          color: scheme === 'dark' ? colordark.textColor : colors.textColor,
        }}>
        {props.balance}
      </Text>
      <Text style={{flex: 1, color: 'black'}}>{'>'}</Text>
    </View>
  );
};

export default CataLogs;
