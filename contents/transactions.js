import {StyleSheet, Text, View} from 'react-native';
import {useColorScheme} from 'react-native';
import colors from '../config/colors';
import colordark from '../config/colordark';
import dimensions from '../config/dimensions';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
const Transactions = props => {
  let textProp = props.text;
  //alert(textProp) props.sb
  //console.log(props.to)
  const scheme = useColorScheme();
  const walletSty = StyleSheet.create({
    wallet: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      alignItems: 'center',
      borderColor: scheme === 'dark' ? colordark.borderCl : colors.borderStk,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: 'white',
    },
  });
  return (
    <View style={walletSty.wallet}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {props.mode == 'Sent' && props.to != '0xMe...ol' ? (
          <Icon name="arrow-up" size={20} color="red" />
        ) : props.mode == 'Recv' && props.to != '0xMe...ol' ? (
          <Icon name="arrow-down" size={20} color="green" />
        ) : (
          <Icon name="money" size={20} color="#0b8ed8" />
        )}
      </View>

      <View style={{flex: 4}}>
        <View style={{padding: 4}}>
          {props.mode == 'Sent' && props.to != '0xMe...ol' ? (
            <Text
              style={{
                flex: 2,
                paddingLeft: '10%',
                fontWeight: 700,
                fontSize: 15,
                color: 'black',
              }}>
              Sent
            </Text>
          ) : props.mode == 'Recv' && props.to != '0xMe...ol' ? (
            <Text
              style={{
                flex: 2,
                paddingLeft: '10%',
                fontWeight: 700,
                fontSize: 15,
                color: 'black',
              }}>
              Receive
            </Text>
          ) : props.to == '0xMe...ol' ? (
            <Text
              style={{
                flex: 2,
                paddingLeft: '10%',
                fontWeight: 700,
                fontSize: 15,
                color: 'black',
              }}>
              Pending
            </Text>
          ) : (
            <Text
              style={{
                flex: 2,
                paddingLeft: '10%',
                fontWeight: 700,
                fontSize: 15,
                color: 'black',
              }}>
              Transactions
            </Text>
          )}
        </View>

        <View style={{flex: 3, flexDirection: 'row'}}>
          <Text
            style={{
              flex: 1,
              paddingLeft: '10%',
              color: scheme === 'dark' ? 'black' : '#505050',
            }}>
            {props.to}
          </Text>
          {props.mode == 'Sent' ? (
            <Text
              style={{
                flex: 1,
                paddingLeft: '10%',
                color: 'red',
                textAlign: 'right',
              }}>
              -
              {isNaN(props.amt)
                ? props.amt
                : parseFloat(props.amt).toLocaleString('en')}
            </Text>
          ) : props.mode == 'Recv' ? (
            <Text
              style={{
                flex: 1,
                paddingLeft: '10%',
                color: 'green',
                textAlign: 'right',
              }}>
              +
              {isNaN(props.amt)
                ? props.amt
                : parseFloat(props.amt).toLocaleString('en')}
            </Text>
          ) : (
            <Text
              style={{
                flex: 1,
                paddingLeft: '10%',
                color: '#0b8ed8',
                textAlign: 'right',
              }}>
              {isNaN(props.amt)
                ? props.amt
                : parseFloat(props.amt).toLocaleString('en')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Transactions;
