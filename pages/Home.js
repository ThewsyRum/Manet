import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  Appearance,
  Modal,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Wallet from '../contents/wallets';
import WalletMini from '../contents/walletMini';
import {CYPTO_ICON} from '../contents/iconuri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Entypo';
import {
  contractTransaction,
  createWallet,
  exportKeystore,
  exportMnemonicFromKeystore,
  exportPrivateKeyFromKeystore,
  exportMnemonic,
  exportKeystoreFromMnemonic,
  exportPrivateKeyFromMnemonic,
  importKeystore,
  importMnemonic,
  importPrivateKey,
  getBalance,
  getContractBalance,
  getContractGasLimit,
  getContractNfts,
  getGasLimit,
  getGasPrice,
  getNonce,
  sendTransaction,
  signTransaction,
  signMessage,
  signTypedData,
  waitForContractTransaction,
  waitForTransaction,
  getContract,
  getSignerContract,
  getWalletSigner,
  getWalletSignerWithMnemonic,
  getWalletSignerWithPrivateKey,
  getSignerContractWithWalletProvider,
  bigNumberFormatUnits,
  bigNumberParseUnits,
} from 'react-native-web3-wallet';
let usdterc20Abi = require('./ERC20.json');
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColor: 'rgba(25,29,72,1)',
      activeMain: true,
      tokens: [],
      balances: [],
      tokenBalances: [],
      totalBalances: 0.0,
      deposit: false,
      settings: false,
      btcPrice: 0.0,
      ethPrice: 0.0,
      bsccPrice: 0.0,
      usdtPrice: 0.0,
      usdcPrice: 0.0,
      wait: true,
      refreshing: false,
      walletName: '',
      scheme: Appearance.getColorScheme(),
    };
  }
  async componentDidMount() {
    //console.log("=x==",this.props.route.params.Addresses)
    this.StartWallet();
    this.setState({walletName: this.props.route.params.walletNum});
  }
  onRefresh = () => {
    this.setState({refreshing: true, wait: true});
    this.StartWallet();
  };
  StartWallet = async () => {
    console.log('=x==x', this.props.route.params);

    let Addrs = this.props.route.params.Addresses;
    this.getTokens(Addrs[1]);
    let balances = await this.UpdateBal(Addrs[0], Addrs[1], Addrs[2]).catch(
      e => {
        console.log('BALANCEE_RRROR:', e);
      },
    );
    console.log('balances===xx=====', balances);
    let btcprcie = balances[0] != undefined ? balances[0] : 0; //await this.BtcPrice(balances[0])
    console.log('=x==x=x=x');
    let ltn = await this.BtcPrice(
      balances[1][0] == undefined ? 0 : balances[1][0],
    ).catch(e => {
      alert(e);
    });
    ltn = ltn == undefined ? 0 : ltn;
    let bscTw = await this.BSCPrice(
      balances[2][0] == undefined ? 0 : balances[2][0],
    ).catch(e => {
      alert(e);
    });
    bscTw = bscTw == undefined ? 0 : bscTw;
    let ethTw = await this.EthPrice(
      balances[3][0] == undefined ? 0 : balances[3][0],
    ).catch(e => {
      alert(e);
    });
    ethTw = ethTw == undefined ? 0 : ethTw;
    let bsc = balances[4]; //await this.BSCPrice(balances[4]).catch(e=>{alert(e)})
    let eth = balances[5]; //await this.EthPrice(balances[5]).catch(e=>{alert(e)})
    let usdtbsc = balances[6];
    let usdteth = balances[7];
    let usdcbsc = balances[8];
    let usdceth = balances[9];
    let total =
      btcprcie +
      ltn +
      bscTw +
      ethTw +
      bsc +
      eth +
      usdtbsc +
      usdteth +
      usdcbsc +
      usdceth;
    console.log(
      'VAlueess',
      btcprcie,
      ltn,
      bscTw,
      ethTw,
      bsc,
      eth,
      usdtbsc,
      usdteth,
      usdcbsc,
      usdceth,
    );
    console.log('===== xxx Ammounts  xxxx=====', balances, total);
    this.setState({
      totalBalances: total,
      btcPrice: btcprcie + ltn,
      ethPrice: ethTw + eth,
      bsccPrice: bscTw + bsc,
      usdtPrice: usdtbsc + usdteth,
      usdcPrice: usdcbsc + usdceth,
      wait: false,
      refreshing: false,
    });
  };
  getTokens = async address => {
    const value = await AsyncStorage.getItem('@TokensAdded:key');

    if (value !== null) {
      vl = JSON.parse(value);
      let AddWallets = vl.Tokens;
      this.setState({tokens: AddWallets});
      let bals = [];
      for (let i = 0; i < AddWallets.length; i++) {
        let bll = await this.EVMTokens(
          address,
          AddWallets[i][0],
          AddWallets[i][2],
        ).catch(e => {
          console.log(e);
        });

        bals.push(bll);
      }

      this.setState({tokenBalances: bals});
    } else {
    }
  };
  //Get Assets Prices
  BtcPrice = async value => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(
        'https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT',
      ).catch(e => {
        console.log('NetError: ', e);
        reject(e);
      });
      //console.log("==========",response)
      if (response != undefined) {
        const json = await response.json();
        let currP = 0;
        currP = isNaN(parseInt(json.price)) ? 0 : parseInt(json.price);
        console.log('ss', parseFloat(value) * currP);

        resolve(parseFloat(value) * currP);
      } else {
        try {
          const responseUS = await fetch(
            'https://api.binance.us/api/v3/avgPrice?symbol=BTCUSDT',
          ).catch(e => {
            console.log('NetError: ', e);
            reject(e);
          });
          if (responseUS != undefined) {
            try {
              const jsonUs = await responseUS.json();
              let currP = isNaN(parseInt(jsonUs.price))
                ? 0
                : parseInt(jsonUs.price);
              resolve(parseFloat(value) * currP);
            } catch (err) {
              console.log('JSON BTC ERROR', err);
              resolve(0);
            }
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  };
  EthPrice = async value => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(
        'https://api.binance.com/api/v3/avgPrice?symbol=ETHUSDT',
      ).catch(e => {
        console.log('NetError: ', e);
        reject(e);
      });
      if (response != undefined) {
        const json = await response.json();
        let currP = 0;
        currP = isNaN(parseInt(json.price)) ? 0 : parseInt(json.price);
        resolve(parseFloat(value) * currP);
      } else {
        try {
          const responseUS = await fetch(
            'https://api.binance.us/api/v3/avgPrice?symbol=ETHUSDT',
          ).catch(e => {
            console.log('NetError: ', e);
            reject(e);
          });
          if (responseUS != undefined) {
            try {
              const jsonUs = await responseUS.json();
              let currP = isNaN(parseInt(jsonUs.price))
                ? 0
                : parseInt(jsonUs.price);
              resolve(parseFloat(value) * currP);
            } catch (err) {
              console.log('JSON ETH ERROR', err);
              resolve(0);
            }
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  };
  BSCPrice = async value => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(
        'https://api.binance.com/api/v3/avgPrice?symbol=BNBUSDT',
      ).catch(e => {
        console.log('NetErrorBSC: ', e);
        reject(e);
      });
      if (response != undefined) {
        const json = await response.json();
        let currP = 0;
        currP = isNaN(parseInt(json.price)) ? 0 : parseInt(json.price);
        resolve(parseFloat(value) * currP);
      } else {
        try {
          console.log('TryUndeffindeefhfhh');
          const responseUS = await fetch(
            'https://api.binance.us/api/v3/avgPrice?symbol=BNBUSDT',
          ).catch(e => {
            console.log('NetErrorBSCUS: ', e);
            reject(e);
          });
          console.log('Undeffindeefhfhh', responseUS);
          if (responseUS != undefined) {
            try {
              const jsonUs = await responseUS.json();

              let currP = isNaN(parseInt(jsonUs.price))
                ? 0
                : parseInt(jsonUs.price);

              resolve(parseFloat(value) * currP);
            } catch (err) {
              console.log('JSON ERROR', err);
              resolve(0);
            }
          } else {
            resolve(0);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  };
  LightningNode = async address => {
    return new Promise(async (resolve, reject) => {
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      var Data = {
        Mode: 'acctDetLight',
        privateKay: address,
      };
      fetch('https://stonkbullz.com/MnetWallet.php', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data), //convert data to JSON
      })
        .then(response => response.json())
        .then(response => {
          resolve(response.Balance);
        })
        .catch(error => {
          alert('Error Occured:-' + error);
          resolve(['0', '0', '0']);
        });
    });
  };
  LayerTwosBSC = async address => {
    return new Promise(async (resolve, reject) => {
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      var Data = {
        Mode: 'acctDetBSC',
        privateKay: address,
      };
      fetch('https://stonkbullz.com/MnetWallet.php', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data), //convert data to JSON
      })
        .then(response => response.json())
        .then(response => {
          resolve(response.Balance);
        })
        .catch(error => {
          alert('Error BSC Occured:-' + error);
          resolve(['0', '0', '0']);
          //===//console.log(error)
        });
    });
  };
  LayerTwosETH = async address => {
    return new Promise(async (resolve, reject) => {
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      var Data = {
        Mode: 'acctDetEth',
        privateKay: address,
      };
      fetch('https://stonkbullz.com/MnetWallet.php', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data), //convert data to JSON
      })
        .then(response => response.json())
        .then(response => {
          resolve(response.Balance);
        })
        .catch(error => {
          alert('Error ETH Occured:-' + error);
          resolve(['0', '0', '0']);
          //===//console.log(error)
        });
    });
  };
  BtcAddress = async address => {
    return new Promise(async (re, rj) => {
      try {
        const response = await fetch(
          'https://api.blockcypher.com/v1/btc/main/addrs/' + address,
        ).catch(e => {
          rj(e);
        });
        const json = await response.json();

        letToBtc = isNaN(parseFloat(json.balance))
          ? 0
          : parseFloat(json.balance) / 100000000;

        let btcPrxi = await this.BtcPrice(letToBtc).catch(e => alert(e));
        console.log('letToBtc', json, '==', btcPrxi);
        if (btcPrxi == undefined) {
          btcPrxi = 0;
        }
        console.log('BTCPRIC', btcPrxi);
        re(btcPrxi);
      } catch (e) {
        console.log(e);
        rj(e);
      }
    });
  };
  EVMUSDT = async (address, network) => {
    let bl = '';
    let blx = '';
    let trx = '';
    return new Promise(async (resolve, reject) => {
      if (network == 'BSC') {
        let contract = getContract(
          'https://bsc-dataseed1.binance.org/',
          '0x55d398326f99059fF775485246999027B3197955',
          usdterc20Abi.abi,
        );
        bl = await contract.balanceOf(address).catch(err => {});
        if (bl == undefined) {
          resolve(0);
        } else {
          resolve(parseFloat(bigNumberFormatUnits(bl)));
        }
      } else if (network == 'ETH') {
        //https://rpc.ankr.com/eth
        let contract = getContract(
          'https://eth.merkle.io',
          '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          usdterc20Abi.abi,
        );
        blx = await contract.balanceOf(address).catch(err => {});
        if (blx == undefined) {
          resolve(0);
        } else {
          resolve(parseFloat(bigNumberFormatUnits(blx, 6)));
        }
      }
    });
  };
  EVMUSDC = async (address, network) => {
    let bl = '';
    let blx = '';
    let trx = '';
    return new Promise(async (resolve, reject) => {
      if (network == 'BSC') {
        let contract = getContract(
          'https://bsc-dataseed1.binance.org/',
          '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
          usdterc20Abi.abi,
        );
        bl = await contract.balanceOf(address).catch(err => {});
        if (bl == undefined) {
          resolve(0);
        } else {
          resolve(parseFloat(bigNumberFormatUnits(bl)));
        }
      } else if (network == 'ETH') {
        let contract = getContract(
          'https://eth.merkle.io',
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          usdterc20Abi.abi,
        );
        blx = await contract.balanceOf(address).catch(err => {});
        if (blx == undefined) {
          resolve(0);
        } else {
          resolve(parseFloat(bigNumberFormatUnits(blx, 6)));
        }
      }
    });
  };
  EVMTokens = async (address, network, tokeAdd) => {
    let bl = '';
    let blx = '';
    let trx = '';
    return new Promise(async (resolve, reject) => {
      if (network == 'BSC') {
        let contract = getContract(
          'https://bsc-dataseed1.binance.org/',
          tokeAdd,
          usdterc20Abi.abi,
        );
        bl = await contract.balanceOf(address).catch(err => {});
        if (bl == undefined) {
          resolve(0);
        } else {
          resolve(parseFloat(bigNumberFormatUnits(bl)));
        }
      } else if (network == 'ETH') {
        let contract = getContract(
          'https://eth.merkle.io',
          tokeAdd,
          usdterc20Abi.abi,
        );
        blx = await contract.balanceOf(address).catch(err => {});
        if (blx == undefined) {
          resolve(0);
        } else {
          resolve(parseFloat(bigNumberFormatUnits(blx, 6)));
        }
      }
    });
  };
  EVmAddress = async (address, network) => {
    return new Promise(async (resolve, reject) => {
      let bl = '';
      let trx = '';
      if (network == 'BSC') {
        bl = await getBalance(
          'https://bsc-dataseed1.binance.org/',
          address,
        ).catch(async err => {
          console.log('BNB+++======', err);
          //resolve (await this.BSCPrice(0).catch(e=>{reject(e)}))
        });
        // console.log("======xxxxxxx======")
        if (bl == undefined) {
          let un_bl = await this.BSCPrice(0).catch(e => {
            console.log('FEXTTTS', e);
          });
          resolve(un_bl);
        } else {
          resolve(
            await this.BSCPrice(bigNumberFormatUnits(bl)).catch(e => {
              reject(e);
            }),
          );
        }
      } else if (network == 'ETH') {
        bl = await getBalance(
          'https://eth.merkle.io', //'https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe',
          address,
        ).catch(err => {
          console.log(err);
        });
        if (bl == undefined) {
          bl = '0';
          resolve(
            await this.EthPrice(0).catch(e => {
              reject(e);
            }),
          );
        } else {
          resolve(
            await this.EthPrice(bigNumberFormatUnits(bl)).catch(e => {
              reject(e);
            }),
          );
        }
      }
    });
  };
  UpdateBal = async (btcAddr, evmAddr, lightAddr) => {
    return new Promise(async (resolve, reject) => {
      // console.log("DJJDJDJDdJ",await this.EVmAddress(evmAddr,"BSC").catch(e=>{reject(e)}))
      //let bal = await this.BtcAddress(btcAddr)
      console.log(
        '______________________________START__________________________________',
      );
      let BTCAMT = await this.BtcAddress(btcAddr).catch(e => {
        console.log(e);
      });
      let BSCAMT = await this.EVmAddress(evmAddr, 'BSC').catch(e => {
        console.log(e);
      });
      BSCAMT = BSCAMT == undefined ? 0 : BSCAMT;
      let ETHAMT = await this.EVmAddress(evmAddr, 'ETH').catch(e => {
        console.log(e);
      });
      ETHAMT = ETHAMT == undefined ? 0 : ETHAMT;

      let EVMUSDTETH = await this.EVMUSDT(evmAddr, 'ETH').catch(e => {
        reject(e);
      });
      EVMUSDTETH = EVMUSDTETH == undefined ? 0 : EVMUSDTETH;
      let EVMUSDTBSC = await this.EVMUSDT(evmAddr, 'BSC').catch(e => {
        reject(e);
      });
      EVMUSDTBSC = EVMUSDTBSC == undefined ? 0 : EVMUSDTBSC;

      let EVMUSDCETH = await this.EVMUSDC(evmAddr, 'ETH').catch(e => {
        reject(e);
      });
      EVMUSDCETH = EVMUSDCETH == undefined ? 0 : EVMUSDCETH;
      let EVMUSDCBSC = await this.EVMUSDC(evmAddr, 'BSC').catch(e => {
        reject(e);
      });
      EVMUSDCBSC = EVMUSDCBSC == undefined ? 0 : EVMUSDCBSC;

      console.log(
        '------======-----BNDBDDN----',
        BTCAMT,
        BSCAMT,
        ETHAMT,
        EVMUSDTETH,
        EVMUSDTBSC,
        EVMUSDCETH,
        EVMUSDCBSC,
      );

      resolve([
        BTCAMT,
        await this.LightningNode(lightAddr).catch(e => {
          console.log(e);
        }),
        await this.LayerTwosBSC(evmAddr).catch(e => {
          console.log(e);
        }),
        await this.LayerTwosETH(evmAddr).catch(e => {
          console.log(e);
        }),
        BSCAMT,
        ETHAMT,
        EVMUSDTETH,
        EVMUSDTBSC,
        EVMUSDCETH,
        EVMUSDCBSC,
      ]);

      //await this.EVmAddress(evmAddr,"ETH").catch(e=>{reject(e)}),await this.EVMUSDT(evmAddr,"ETH").catch(e=>{reject(e)}),await this.EVMUSDT(evmAddr,"BSC").catch(e=>{reject(e)}),await this.EVMUSDC(evmAddr,"ETH").catch(e=>{reject(e)}),await this.EVMUSDC(evmAddr,"BSC").catch(e=>{reject(e)})])
    });
  };
  render() {
    const {
      activeColor,
      activeMain,
      tokens,
      balances,
      tokenBalances,
      totalBalances,
      deposit,
      settings,
      btcPrice,
      ethPrice,
      bsccPrice,
      usdtPrice,
      usdcPrice,
      wait,
      refreshing,
      walletName,
      scheme,
    } = this.state;
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={wait}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View
              style={{
                width: 80,
                height: 80,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <ActivityIndicator
                color="#009688"
                size="large"
                style={styles.ActivityIndicatorStyle}
              />
            </View>
          </View>
        </Modal>
        <Modal visible={deposit} animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                onPress={() => {
                  this.setState({deposit: false});
                }}
                style={{marginTop: 10, left: 20, position: 'absolute'}}>
                <Icon name="chevron-left" style={{fontSize: 20}}></Icon>
              </Pressable>
              <View style={{width: '100%'}}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: '10%',
                    }}>
                    Deposit
                  </Text>
                </View>
                <TouchableOpacity
                  gradientImage="Gradient_F97GTRQ.png"
                  style={[styles.button6, {height: '12%', borderWidth: 0}]}
                  onPress={() => {
                    this.props.navigation.navigate('TrnxScreen', {
                      screen: 'TransPageMain',
                      params: {
                        netName: 'Bitcoin',
                        imageUi: CYPTO_ICON.bitcoin.uri,
                      },
                    });
                    this.setState({deposit: false});
                  }}>
                  <WalletMini
                    text={'Bitcoin'}
                    balance={btcPrice == undefined ? '10.00' : btcPrice}
                    icon={CYPTO_ICON.bitcoin.uri}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  gradientImage="Gradient_F97GTRQ.png"
                  style={[styles.button7, {height: '12%', borderWidth: 0}]}
                  onPress={() => {
                    this.props.navigation.navigate('TrnxScreen', {
                      screen: 'TransPageMain',
                      params: {
                        netName: 'Ethereum',
                        imageUi: CYPTO_ICON.ethereum.uri,
                      },
                    });
                    this.setState({deposit: false});
                  }}>
                  <WalletMini
                    text={'Ethereum'}
                    balance={balances[3] == undefined ? '0.00' : balances[3]}
                    icon={CYPTO_ICON.ethereum.uri}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  gradientImage="Gradient_F97GTRQ.png"
                  style={[styles.button8, {height: '12%', borderWidth: 0}]}
                  onPress={() => {
                    this.props.navigation.navigate('TrnxScreen', {
                      screen: 'TransPageMain',
                      params: {netName: 'Binance', imageUi: CYPTO_ICON.bsc.uri},
                    });
                    this.setState({deposit: false});
                  }}>
                  <WalletMini
                    text={'Binance Smart Chain'}
                    balance={balances[2] == undefined ? '0.00' : balances[2]}
                    icon={CYPTO_ICON.bsc.uri}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  gradientImage="Gradient_F97GTRQ.png"
                  style={[styles.button9, {height: '12%', borderWidth: 0}]}
                  onPress={() => {
                    this.props.navigation.navigate('TrnxScreen', {
                      screen: 'TransPageMain',
                      params: {netName: 'USDT', imageUi: CYPTO_ICON.usdt.uri},
                    });
                    this.setState({deposit: false});
                  }}>
                  <WalletMini
                    text={'USDT'}
                    balance={balances[4] == undefined ? '0.00' : balances[4]}
                    icon={CYPTO_ICON.usdt.uri}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  gradientImage="Gradient_F97GTRQ.png"
                  style={[styles.button9, {height: '12%', borderWidth: 0}]}
                  onPress={() => {
                    this.props.navigation.navigate('TrnxScreen', {
                      screen: 'TransPageMain',
                      params: {netName: 'USDC', imageUi: CYPTO_ICON.usdc.uri},
                    });
                    this.setState({deposit: false});
                  }}>
                  <WalletMini
                    text={'USDC'}
                    balance={balances[5] == undefined ? '0.00' : balances[5]}
                    icon={CYPTO_ICON.usdc.uri}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={settings} animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                onPress={() => {
                  this.setState({settings: false});
                }}
                style={{marginTop: 10, left: 20, position: 'absolute'}}>
                <Icon name="chevron-left" style={{fontSize: 20}}></Icon>
              </Pressable>
              <View style={{width: '100%'}}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: '10%',
                    }}>
                    Settings
                  </Text>
                </View>
                <TouchableOpacity
                  gradientImage="Gradient_F97GTRQ.png"
                  style={styles.button2x}>
                  <View style={styles.icon2Rowx}>
                    <EntypoIcon
                      name="wallet"
                      style={styles.icon2x}></EntypoIcon>
                    <Text style={styles.walletsx}>Wallets</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  gradientImage="Gradient_F97GTRQ.png"
                  style={styles.button3x}>
                  <View style={styles.icon3Rowx}>
                    <EntypoIcon
                      name="circle-with-plus"
                      style={styles.icon3x}></EntypoIcon>
                    <Text style={styles.addTokens2x}>Add Tokens</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ImageBackground
          style={styles.rect1}
          imageStyle={styles.rect1_imageStyle}
          source={require('../assets/images/Gradient_H3TONXWN.png')}>
          <View style={styles.scrollArea}>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                />
              }>
              <View style={styles.rect3Row}>
                <View style={styles.rect3}>
                  <View style={styles.iconRow}>
                    <IoniconsIcon
                      name="wallet"
                      style={styles.icon}></IoniconsIcon>
                    <Text style={styles.mainWallet}>{walletName}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.loremIpsum}>
                ${parseFloat(totalBalances).toFixed(2)}
              </Text>
              <View style={styles.rect5}>
                <View style={styles.buttonRow}>
                  <View
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      margin: '3%',
                    }}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        Linking.openURL('https://onramp.money/').catch(err =>
                          console.error('An error occured', err),
                        );
                      }}>
                      <MaterialCommunityIconsIcon
                        name="plus"
                        style={styles.icon10}></MaterialCommunityIconsIcon>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      margin: '3%',
                    }}>
                    <TouchableOpacity
                      style={styles.button2}
                      onPress={() => {
                        Linking.openURL('https://onramp.money/').catch(err =>
                          console.error('An error occured', err),
                        );
                      }}>
                      <MaterialCommunityIconsIcon
                        name="format-vertical-align-bottom"
                        style={styles.icon11}></MaterialCommunityIconsIcon>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      margin: '3%',
                    }}>
                    <TouchableOpacity
                      style={styles.button3}
                      onPress={() => {
                        this.setState({deposit: true});
                      }}>
                      <MaterialCommunityIconsIcon
                        name="format-vertical-align-top"
                        style={styles.icon12}></MaterialCommunityIconsIcon>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.rect4}>
                <View style={styles.buyRow}>
                  <Text style={styles.buy}>Buy</Text>
                  <Text style={styles.sell}>Sell</Text>
                  <Text style={styles.deposit}>Deposit</Text>
                </View>
              </View>
              <View style={styles.rect6Stack}>
                <TouchableOpacity
                  style={[
                    styles.button4,
                    {
                      backgroundColor:
                        activeMain === true ? activeColor : 'white',
                    },
                  ]}
                  onPress={() => {
                    this.setState({activeMain: true});
                  }}>
                  <Text
                    style={[
                      styles.mainCrypto,
                      {color: activeMain === true ? 'white' : '#191d48'},
                    ]}>
                    Main Crypto
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button5,
                    {
                      backgroundColor:
                        activeMain === false ? activeColor : 'white',
                    },
                  ]}
                  onPress={() => {
                    this.setState({activeMain: false});
                  }}>
                  <Text
                    style={[
                      styles.tokens,
                      {color: activeMain === false ? 'white' : '#191d48'},
                    ]}>
                    Tokens
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.rect9Stack,
                  {display: activeMain ? 'none' : ''},
                ]}>
                <View style={styles.rect9}>
                  {tokens.map((prop, key) => {
                    console.log('Token Adding', prop, key);
                    let netName_ = prop[0] == 'BSC' ? 'Token_BSC' : 'Token_ETH';
                    return (
                      <TouchableOpacity
                        style={styles.button6}
                        key={key}
                        onPress={() =>
                          this.props.navigation.navigate('TrnxScreen', {
                            screen: 'TransPageMain',
                            params: {
                              netName: netName_,
                              imageUi: CYPTO_ICON.token.uri,
                              tokenAddress: prop[2],
                              tokenName: prop[1],
                              tokenSYM: prop[4],
                              tokenDec: prop[3],
                            },
                          })
                        }>
                        <Wallet
                          text={prop[1]}
                          balance={
                            tokenBalances[key] == undefined
                              ? '0.00'
                              : tokenBalances[key]
                          }
                          sign={'no'}
                          icon={CYPTO_ICON.token.uri}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View
                style={[
                  styles.rect9Stack,
                  {display: activeMain === true ? '' : 'none'},
                ]}>
                <View style={styles.rect9}>
                  <TouchableOpacity
                    gradientImage="Gradient_F97GTRQ.png"
                    style={styles.button6}
                    onPress={() => {
                      this.props.navigation.navigate('TrnxScreen', {
                        screen: 'TransPageMain',
                        params: {
                          netName: 'Bitcoin',
                          imageUi: CYPTO_ICON.bitcoin.uri,
                        },
                      });
                    }}>
                    <Wallet
                      text={'Bitcoin'}
                      balance={btcPrice == undefined ? '0.00' : btcPrice}
                      icon={CYPTO_ICON.bitcoin.uri}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    gradientImage="Gradient_F97GTRQ.png"
                    style={styles.button7}
                    onPress={() => {
                      this.props.navigation.navigate('TrnxScreen', {
                        screen: 'TransPageMain',
                        params: {
                          netName: 'Ethereum',
                          imageUi: CYPTO_ICON.ethereum.uri,
                        },
                      });
                    }}>
                    <Wallet
                      text={'Ethereum'}
                      balance={ethPrice == undefined ? '0.00' : ethPrice}
                      icon={CYPTO_ICON.ethereum.uri}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    gradientImage="Gradient_F97GTRQ.png"
                    style={styles.button8}
                    onPress={() => {
                      this.props.navigation.navigate('TrnxScreen', {
                        screen: 'TransPageMain',
                        params: {
                          netName: 'Binance',
                          imageUi: CYPTO_ICON.bsc.uri,
                        },
                      });
                    }}>
                    <Wallet
                      text={'Binance Smart Chain'}
                      balance={bsccPrice == undefined ? '0.00' : bsccPrice}
                      icon={CYPTO_ICON.bsc.uri}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    gradientImage="Gradient_F97GTRQ.png"
                    style={styles.button9}
                    onPress={() => {
                      this.props.navigation.navigate('TrnxScreen', {
                        screen: 'TransPageMain',
                        params: {netName: 'USDT', imageUi: CYPTO_ICON.usdt.uri},
                      });
                    }}>
                    <Wallet
                      text={'USDT'}
                      balance={usdtPrice == undefined ? '0.00' : usdtPrice}
                      icon={CYPTO_ICON.usdt.uri}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    gradientImage="Gradient_F97GTRQ.png"
                    style={styles.button9}
                    onPress={() => {
                      this.props.navigation.navigate('TrnxScreen', {
                        screen: 'TransPageMain',
                        params: {netName: 'USDC', imageUi: CYPTO_ICON.usdc.uri},
                      });
                    }}>
                    <Wallet
                      text={'USDC'}
                      balance={usdcPrice == undefined ? '0.00' : usdcPrice}
                      icon={CYPTO_ICON.usdc.uri}
                    />
                  </TouchableOpacity>
                </View>
              </View>
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
  button1Rowx: {
    height: 36,
    flexDirection: 'row',
    marginTop: 28,
    marginLeft: 42,
    marginRight: 151,
  },
  button2x: {
    width: '100%',
    height: '20%',
    backgroundColor: '#fff',
    borderColor: '#000000',
    borderRadius: 11,
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 2,
  },
  icon2x: {
    color: 'rgba(42,41,41,1)',
    fontSize: 30,
    height: 46,
    width: 40,
  },
  walletsx: {
    fontFamily: 'roboto-700',
    color: '#121212',
    fontSize: 18,
    marginLeft: 48,
    marginTop: 11,
  },
  icon2Rowx: {
    height: 46,
    flexDirection: 'row',
    flex: 1,
    marginRight: 133,
    marginLeft: 5,
    marginTop: 9,
  },
  button3x: {
    width: '100%',
    height: '20%',
    backgroundColor: '#fff',
    borderColor: '#000000',
    borderRadius: 11,
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 2,
  },
  icon3x: {
    color: 'rgba(42,41,41,1)',
    fontSize: 30,
    height: 46,
    width: 40,
  },
  addTokens2x: {
    fontFamily: 'roboto-700',
    color: '#121212',
    fontSize: 18,
    marginLeft: 48,
    marginTop: 11,
  },
  icon3Rowx: {
    height: 46,
    flexDirection: 'row',
    flex: 1,
    marginRight: 94,
    marginLeft: 5,
    marginTop: 8,
  },
  rect1_imageStyle: {},
  scrollArea: {
    height: '100%',
    backgroundColor: '#E6E6E6',
    borderTopLeftRadius: 58,
    borderTopRightRadius: 58,
    marginTop: 58,
  },
  scrollArea_contentContainerStyle: {
    height: '100%',
  },
  rect3: {
    width: 134,
    height: 29,
    backgroundColor: '#E6E6E6',
    flexDirection: 'row',
  },
  icon: {
    color: 'rgba(7,7,7,1)',
    fontSize: 20,
    height: 23,
    width: 16,
  },
  mainWallet: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    marginLeft: 7,
    marginTop: 3,
  },
  iconRow: {
    height: 23,
    flexDirection: 'row',
    flex: 1,
    marginLeft: 14,
    marginTop: 3,
  },
  button10: {
    width: 20,
    height: 20,
    backgroundColor: '#E6E6E6',
    marginLeft: 133,
    marginTop: 3,
  },
  icon13: {
    color: 'rgba(7,7,7,1)',
    fontSize: 20,
    height: 20,
    width: 17,
    marginLeft: 1,
  },
  rect3Row: {
    height: '5%',
    flexDirection: 'row',
    marginTop: '5%',
    marginLeft: '10%',
  },
  loremIpsum: {
    fontFamily: 'roboto-700',
    color: '#121212',
    fontSize: 50,
    marginTop: '0%',
    textAlign: 'center',
  },
  rect5: {
    width: '80%',
    height: '8%',
    backgroundColor: '#E6E6E6',
    borderRadius: 41,
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 0,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 35,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    height: '60%',
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon10: {
    color: 'rgba(3,3,3,1)',
    fontSize: 30,
    height: '100%',
    width: '100%',
    marginTop: 4,
    marginLeft: 4,
  },
  button2: {
    width: 40,
    height: 40,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 35,
    marginLeft: 18,
  },
  icon11: {
    color: 'rgba(3,3,3,1)',
    fontSize: 30,
    height: '100%',
    width: '100%',
    marginTop: 4,
    marginLeft: 5,
  },
  button3: {
    width: 40,
    height: 40,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 35,
    marginLeft: 24,
  },
  icon12: {
    color: 'rgba(3,3,3,1)',
    fontSize: 30,
    height: '100%',
    width: '100%',
    marginTop: 4,
    marginLeft: 4,
  },
  buttonRow: {
    height: '0%',
    flexDirection: 'row',
    flex: 1,
    marginTop: '0%',
    marginLeft: 0,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  rect4: {
    width: '70%',
    height: '5%',
    backgroundColor: '#E6E6E6',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    borderRadius: 47,
    flexDirection: 'row',
    marginTop: '2%',
    marginLeft: 0,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buy: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 16,
  },
  sell: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 16,
    marginLeft: '25%',
  },
  deposit: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 16,
    marginLeft: '25%',
  },
  buyRow: {
    height: '100%',
    flexDirection: 'row',
    flex: 1,
    marginRight: 18,
    marginLeft: 28,
    marginTop: 7,
  },
  rect6: {
    top: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  button4: {
    width: '50%',
    height: '100%',
    backgroundColor: 'rgba(25,29,72,1)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  mainCrypto: {
    fontFamily: 'roboto-700',
    color: 'rgba(255,255,255,1)',
    marginTop: 14,
    marginLeft: 34,
  },
  button5: {
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(251,251,251,1)',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  tokens: {
    fontFamily: 'roboto-700',
    color: '#191d48',
    marginTop: 14,
    marginLeft: 51,
  },
  rect6Stack: {
    width: 292,
    height: 43,
    marginTop: 35,
    marginLeft: 55,
  },
  rect9: {
    width: '100%',
    height: '90%',
    backgroundColor: '#E6E6E6',
    borderRadius: 12,
  },
  button6: {
    width: '100%',
    height: '15%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 11,
    marginTop: '5%',
    marginBottom: '5%',
  },
  icon6: {
    color: 'rgba(211,156,18,1)',
    fontSize: 40,
    height: 44,
    width: 40,
    marginTop: 9,
    marginLeft: 24,
  },
  button8: {
    width: '100%',
    height: '15%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 11,
    marginBottom: '5%',
  },
  icon8: {
    color: 'rgba(25,38,129,1)',
    fontSize: 40,
    height: 44,
    width: 40,
    marginTop: 9,
    marginLeft: 24,
  },
  button7: {
    width: '100%',
    height: '15%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 11,
    marginBottom: '5%',
  },
  icon7: {
    color: 'rgba(25,38,129,1)',
    fontSize: 40,
    height: 44,
    width: 40,
    marginTop: 9,
    marginLeft: 25,
  },
  button9: {
    width: '100%',
    height: '15%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 11,
    marginBottom: '5%',
  },
  icon9: {
    color: 'rgba(25,38,129,1)',
    fontSize: 40,
    height: 44,
    width: 40,
    marginTop: 9,
    marginLeft: 25,
  },
  rect9Stack: {
    width: 293,
    height: 426,
    marginTop: 12,
    marginLeft: 54,
  },
});

export default Home;
//0xd5e01e29fDaA9E66859204E836B5B3Bf6Bf4c863
