import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Appearance,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import CataLogs from '../contents/listcatlogs';
import {TextInput} from 'react-native-gesture-handler';
import {Text} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../config/colors';
import colordark from '../config/colordark';
import {CYPTO_ICON} from '../contents/iconuri';

class Walletxs extends Component {
  constructor(props) {
    super(props);
    this.AddWallets = [];
    this.state = {
      wallets: this.AddWallets,
      walletName: 'New Account',
      added: false,
      scheme: Appearance.getColorScheme(),
    };
    console.log(',-===', this.props.route.params);
  }
  componentDidMount() {
    this.getAccounts();
  }
  getAccounts = async () => {
    const value = await AsyncStorage.getItem('@WalletAccount:key');

    if (value !== null) {
      vl = JSON.parse(value);
      console.log(vl.wallets);
      this.AddWallets = vl.wallets;
      this.setState({wallets: this.AddWallets, added: true});
    } else {
      console.log('Empty');
    }
  };
  render() {
    const {wallets, walletName, added, scheme} = this.state;
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.rect1}
          imageStyle={styles.rect1_imageStyle}
          source={require('../assets/images/Gradient_H3TONXWL.png')}>
          <View style={styles.scrollArea1}>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea1_contentContainerStyle}>
              <Pressable
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{
                  marginTop: 10,
                  left: 30,
                  position: 'absolute',
                  borderWidth: 1,
                  borderRadius: 30,
                }}>
                <Icon
                  name="chevron-left"
                  style={{fontSize: 25, color: 'black'}}></Icon>
              </Pressable>

              <View gradientImage="Gradient_F97GTRQ.png" style={styles.button1}>
                <TouchableOpacity
                  style={{width: '20%'}}
                  onPress={async () => {
                    this.AddWallets.push(walletName);
                    this.setState({wallets: this.AddWallets, added: true});
                    //===//console.log(wallets)
                    try {
                      let acctRa = {
                        wallets: this.AddWallets,
                      };
                      await AsyncStorage.setItem(
                        '@WalletAccount:key',
                        JSON.stringify(acctRa),
                      );
                    } catch (error) {
                      // Error saving data
                    }
                  }}>
                  <Icon name="circle-with-plus" style={styles.icon1}></Icon>
                </TouchableOpacity>
                <View style={{width: '80%'}}>
                  <KeyboardAvoidingView style={[styles.rect2]}>
                    <TextInput
                      value={walletName}
                      editable={true}
                      style={{
                        textAlignVertical: 'center',
                        fontSize: 15,
                        color: 'black',
                        paddingLeft: 20,

                        height: '100%',
                      }}
                      onChangeText={txt => {
                        this.setState({walletName: txt});
                      }}></TextInput>
                  </KeyboardAvoidingView>
                </View>
              </View>

              <ScrollView
                style={{height: '100%', overflow: 'scroll', marginTop: '10%'}}>
                <TouchableOpacity
                  style={{
                    width: '80%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    this.props.route.params.CallWall(0, 'Main Wallet')
                  }>
                  <CataLogs
                    text={'Default Wallet'}
                    icon={CYPTO_ICON.wallet.uri}
                    balance={0}
                  />
                </TouchableOpacity>
                {added ? (
                  wallets.map((prop, key) => {
                    console.log(prop);
                    return (
                      <TouchableOpacity
                        key={key + 1}
                        style={{
                          width: '80%',
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() =>
                          this.props.route.params.CallWall(
                            key + 1,
                            prop + ' ' + (key + 1),
                          )
                        }>
                        <CataLogs
                          text={prop}
                          icon={CYPTO_ICON.wallet.uri}
                          balance={key + 1}
                          key={key}
                        />
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text></Text>
                )}
              </ScrollView>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rect1: {
    flex: 1,
  },
  rect1_imageStyle: {},
  scrollArea1: {
    height: '100%',
    backgroundColor: '#E6E6E6',
    borderTopLeftRadius: 58,
    borderTopRightRadius: 58,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      height: -3,
      width: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    marginTop: 44,
  },
  scrollArea1_contentContainerStyle: {
    height: '100%',
  },
  button1: {
    width: '80%',
    height: '8%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 64,
    marginLeft: '10%',
  },
  icon1: {
    color: 'rgba(42,41,41,1)',
    fontSize: 40,
    height: '80%',
    width: '100%',
    marginTop: 9,
  },
  rect2: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  icon1Row: {
    height: '20%',
    width: '20%',
    flexDirection: 'row',
    flex: 1,
    marginRight: 1,
    marginLeft: 5,
  },
});

export default Walletxs;
