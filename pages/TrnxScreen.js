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
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import QRCodeStyled from 'react-native-qrcode-styled';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import SendTranx from './SendTrans';
import Transactions from '../contents/transactions';
import {sendBitcoin, sendLayerTwocash, sendEVM, sendUSDT} from './SendCrypto';
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
class TrnxScreen extends Component {
  constructor(props) {
    super(props);
    // this.unsubscribe
    this.state = {
      deposit: false,
      send: false,
      network: 'Bitcoin',
      netSymbol: 'BTC',
      imageX: '',
      activeColor: 'rgba(25,29,72,1)',
      activeFont: 'white',
      activeFontTw: 'rgba(25,29,72,1)',
      activeColorTw: 'white',
      activeFontTh: 'rgba(25,29,72,1)',
      activeColorTh: 'white',
      mainnet: true,
      subnet: false,
      ominiNet: false,
      netOneName: 'Main Net',
      netTwoName: 'Lightning Node',
      netThreeName: '',
      widthSpread: '50%',
      LayerOneAddr: '',
      LayerTwoAddr: '',
      LayerThreeAddr: '',
      trnx: null,
      isLoaded: false,
      isLoadedx: false,
      layerOne: true,
      layerTwo: false,
      trnxLtn: null,
      trnxEVM: null,
      trnxUSDT: null,
      trnxUSDC: null,
      mainPrice: 0.0,
      subPrice: 0.0,
      keyStore: '',
      tradeState: false,
      layerOneBal: 0,
      lowPriority: false,
      wait: true,
      refreshing: false,

      gastopup: 0,
      nearestRound: 2,
      scheme: Appearance.getColorScheme(),
    };
  }

  componentDidMount() {
    this.UpdateTrnxPage();
  }
  onRefresh = () => {
    this.setState({
      isLoaded: false,
      isLoadedx: false,
      subPrice: 0.0,
      mainPrice: 0.0,
      trnxLtn: null,
      trnx: null,
      wait: true,
      refreshing: true,
    });
    this.UpdateTrnxPage();
  };
  async UpdateTrnxPage() {
    console.log('===d ddd=');
    let networks = this.props.route.params.params.netName;
    let imagesUri = this.props.route.params.params.imageUi;
    let tokenAddr = this.props.route.params.params.tokenAddress;
    let address = this.props.route.params.Addresses;
    let tokenName = this.props.route.params.params.tokenName;
    let tokenSYM = this.props.route.params.params.tokenSYM;
    console.log('===', networks, this.props.route.params);
    this.setState({imageX: imagesUri, wait: true});
    let pricx = null;
    const {subPrice} = this.state;

    switch (networks) {
      case 'Bitcoin':
        this.setState({
          network: 'Bitcoin',
          netSymbol: 'BTC',
          netOneName: 'Main Net',
          netTwoName: 'Lightning Node',
          LayerOneAddr: address[0],
          LayerTwoAddr: address[2],
          trnx: null,
        });
        pricx = await this.UpdateBal(
          address[0],
          address[1],
          address[2],
          'Bitcoin',
          '',
        ).catch(e => console.log(e));

        l2Prx = await this.BtcPrice(pricx[0][0]);
        let real_btc = isNaN(pricx[1][0]) ? 0 : pricx[1][0];
        let real_btc_sub = isNaN(pricx[1][1]) ? 0 : pricx[1][1];
        console.log('===Ammounts===', pricx, parseInt(l2Prx) + real_btc);
        this.setState({
          subPrice: real_btc_sub + pricx[0][0],
          mainPrice: parseInt(l2Prx) + real_btc,
          wait: false,
          refreshing: false,
        });

        break;
      case 'Ethereum':
        // await this.KeyStores()
        this.setState({
          network: 'Ethereum',
          netSymbol: 'ETH',
          netOneName: 'Beacon chain',
          netTwoName: 'ETH Classic',
          LayerOneAddr: address[1],
          LayerTwoAddr: address[1],
          trnx: null,
        });

        pricx = await this.UpdateBal(
          address[0],
          address[1],
          address[2],
          'Ethereum',
          '',
        ).catch(e => console.log(e));
        l2Prx = await this.EthPrice(pricx[0][0]);
        console.log('===Ammounts===', pricx, parseInt(l2Prx) + pricx[1]);
        this.setState({
          subPrice: pricx[1][1] + pricx[0][0],
          mainPrice: parseInt(l2Prx) + pricx[1][0],
          wait: false,
          refreshing: false,
        });

        break;
      case 'Binance':
        //await this.KeyStores()
        this.setState({
          network: 'Binance',
          netSymbol: 'BSC',
          netOneName: 'Layer 1',
          netTwoName: 'Layer 2',
          LayerOneAddr: address[1],
          LayerTwoAddr: address[1],
          trnx: null,
        });
        pricx = await this.UpdateBal(
          address[0],
          address[1],
          address[2],
          'Binance',
          '',
        ).catch(e => console.log(e));

        l2Prx = await this.BSCPrice(pricx[0][0]);
        console.log('===Ammounts===', pricx, parseInt(l2Prx) + pricx[1]);
        this.setState({
          subPrice: pricx[1][1] + pricx[0][0],
          mainPrice: parseInt(l2Prx) + pricx[1][0],
          wait: false,
          refreshing: false,
        });
        break;
      case 'USDT':
        //this.KeyStores()
        this.setState({
          network: 'Tether',
          netSymbol: 'USDT',
          netOneName: 'Ethereum',
          netTwoName: 'Binance',
          netThreeName: 'Omini Token',
          widthSpread: '33.333%',
          LayerOneAddr: address[1],
          LayerTwoAddr: address[1],
          LayerThreeAddr: address[0],
          trnx: null,
        });

        pricx = await this.UpdateBal(
          address[0],
          address[1],
          address[2],
          'USDT',
          '',
        ).catch(e => console.log(e));
        console.log('===Ammounts===', pricx);
        this.setState({
          subPrice: parseInt(pricx[0]) + parseInt(pricx[1]),
          mainPrice: parseInt(pricx[0]) + parseInt(pricx[1]),
          wait: false,
          refreshing: false,
        });
        break;
      case 'USDC':
        //this.KeyStores()
        this.setState({
          network: 'USDC',
          netSymbol: 'USDC',
          netOneName: 'Ethereum',
          netTwoName: 'Binance',
          netThreeName: 'Omini Token',
          widthSpread: '33.333%',
          LayerOneAddr: address[1],
          LayerTwoAddr: address[1],
          LayerThreeAddr: address[0],
          trnx: null,
        });
        pricx = await this.UpdateBal(
          address[0],
          address[1],
          address[2],
          'USDC',
          '',
        ).catch(e => console.log(e));
        console.log('===Ammounts===', pricx);
        this.setState({
          subPrice: parseInt(pricx[0]) + parseInt(pricx[1]),
          mainPrice: parseInt(pricx[0]) + parseInt(pricx[1]),
          wait: false,
          refreshing: false,
        });
        break;
      case 'Token_ETH':
        //this.KeyStores()
        this.setState({
          network: tokenName + '_ETH',
          netSymbol: tokenSYM,
          netOneName: 'Ethereum',
          netTwoName: 'Binance',
          LayerOneAddr: address[1],
          LayerTwoAddr: address[1],
          LayerThreeAddr: address[0],
          trnx: null,
        });
        pricx = await this.UpdateBal(
          address[0],
          address[1],
          address[2],
          'Token_ETH',
          tokenAddr,
        ).catch(e => console.log(e));
        console.log('===Ammounts===', pricx);
        this.setState({
          subPrice: parseInt(pricx[0]),
          mainPrice: parseInt(pricx[0]),
          wait: false,
          refreshing: false,
        });
        break;
      case 'Token_BSC':
        //this.KeyStores()
        this.setState({
          network: tokenName + '_BSC',
          netSymbol: tokenSYM,
          netOneName: 'Ethereum',
          netTwoName: 'Binance',
          LayerOneAddr: address[1],
          LayerTwoAddr: address[1],
          LayerThreeAddr: address[0],
          trnx: null,
        });
        pricx = await this.UpdateBal(
          address[0],
          address[1],
          address[2],
          'Token_BSC',
          tokenAddr,
        ).catch(e => console.log(e));
        console.log('===Ammounts===', pricx);
        this.setState({
          subPrice: parseInt(pricx[0]),
          mainPrice: parseInt(pricx[0]),
          wait: false,
          refreshing: false,
        });
        break;
    }
  }
  KeyStores = async () => {
    return new Promise(async (resolve, reject) => {
      let keystore = await exportKeystore(
        JSON.stringify(this.props.route.params.keyST),
        'password',
      ) //exportKeystoreFromMnemonic('password',this.props.route.params.mnemon,this.Address,"m/44'/60'/0'/0/"+this.props.route.params.path)
        .catch(err => {
          reject(err);
        });
      let kez = this.props.route.params.keySt;
      //console.log("___",kez)
      this.setState({keyStore: keystore}); //tradeState:false})
      //console.log("___",kez);
      resolve(true);
    });
  };
  //Get Assets Prices
  BtcPrice = async value => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(
        'https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT',
      );
      const json = await response.json();
      let currP = 0;
      try {
        const responseUS = await fetch(
          'https://api.binance.us/api/v3/avgPrice?symbol=BTCUSDT',
        );
        const jsonUs = await responseUS.json();
        currP = isNaN(parseInt(json.price))
          ? parseInt(jsonUs.price)
          : parseInt(json.price);
      } catch (error) {
        currP = isNaN(parseInt(json.price)) ? 0 : parseInt(json.price);
      }

      console.log(parseFloat(value) * currP);

      resolve(parseFloat(value) * currP);
    });
  };
  EthPrice = async value => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(
        'https://api.binance.com/api/v3/avgPrice?symbol=ETHUSDT',
      );
      const json = await response.json();
      let currP = 0;
      try {
        const responseUS = await fetch(
          'https://api.binance.us/api/v3/avgPrice?symbol=ETHUSDT',
        );
        const jsonUs = await responseUS.json();
        currP = isNaN(parseInt(json.price))
          ? parseInt(jsonUs.price)
          : parseInt(json.price);
      } catch (error) {
        currP = isNaN(parseInt(json.price)) ? 0 : parseInt(json.price);
      }

      resolve(parseFloat(value) * currP);
    });
  };
  BSCPrice = async value => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(
        'https://api.binance.com/api/v3/avgPrice?symbol=BNBUSDT',
      );
      const json = await response.json();
      let currP = 0;
      try {
        const responseUS = await fetch(
          'https://api.binance.us/api/v3/avgPrice?symbol=BTCUSDT',
        );
        const jsonUs = await responseUS.json();
        currP = isNaN(parseInt(json.price))
          ? parseInt(jsonUs.price)
          : parseInt(json.price);
      } catch (error) {
        currP = isNaN(parseInt(json.price)) ? 0 : parseInt(json.price);
      }

      resolve(parseFloat(value) * currP);
    });
  };
  LightningNode = async address => {
    console.log('==Lightni====');
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
          console.log('===BUB TRUX==', response.Transactions);
          this.setState({trnxLtn: response.Transactions, isLoadedx: true});
          resolve(response.Balance);
        })
        .catch(error => {
          alert('Error Occured:-' + error);
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
          this.setState({trnxEVM: response.Transactions, isLoadedx: true});
          resolve(response.Balance);
        })
        .catch(error => {
          alert('Error Occured:-' + error);
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
          this.setState({trnxEVM: response.Transactions, isLoadedx: true});
          resolve(response.Balance);
        })
        .catch(error => {
          alert('Error Occured:-' + error);
          //===//console.log(error)
        });
    });
  };
  BtcAddress = async address => {
    return new Promise(async (re, rj) => {
      const response = await fetch(
        'https://api.blockcypher.com/v1/btc/main/addrs/' + address + '/full',
      ).catch(e => console.log('BlockCyperError', e)); //+address+'/full')
      const json = await response.json();
      letToBtc = parseFloat(json.balance) / 100000000;

      console.log('BtcPrx', await this.BtcPrice(letToBtc), json.txs);
      this.setState({
        trnx: json.txs == undefined ? [] : json.txs,
        subPrice: letToBtc,
        isLoaded: true,
      });
      console.log('BTTOODD', letToBtc);
      re([await this.BtcPrice(letToBtc), letToBtc]);
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

        const ftTrxn = await fetch(
          'https://api.bscscan.com/api?module=account&action=txlist&address=' +
            address +
            '&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=S93WAM9DQ93V4VKZF5UIGX5N5DVC7R1CMH',
        );

        trx = await ftTrxn.json();
        if (bl == undefined) {
          bl = 0;
        }

        this.setState({
          trnx: trx.result == undefined ? [] : trx.result,
          subPrice: parseFloat(bigNumberFormatUnits(bl)),
          isLoaded: true,
        });

        resolve(parseFloat(bigNumberFormatUnits(bl)));
      } else if (network == 'ETH') {
        let contract = getContract(
          'https://eth.merkle.io',
          '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          usdterc20Abi.abi,
        );
        blx = await contract.balanceOf(address).catch(err => {});

        const ftTrxnx = await fetch(
          'https://api.etherscan.io/api?module=account&action=txlist&address=' +
            address +
            '&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=ZFE87ZZFWMI821WJYBMJ9X48EKBBX9YG13',
        );
        trx = await ftTrxnx.json();
        if (blx == undefined) {
          blx = 0;
        }
        this.setState({
          trnxUSDT: trx.result == undefined ? [] : trx.result,
          subPrice: parseFloat(bigNumberFormatUnits(blx, 6)),
          isLoadedx: true,
        });

        resolve(parseFloat(bigNumberFormatUnits(blx, 6)));
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

        const ftTrxn = await fetch(
          'https://api.bscscan.com/api?module=account&action=txlist&address=' +
            address +
            '&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=S93WAM9DQ93V4VKZF5UIGX5N5DVC7R1CMH',
        );

        trx = await ftTrxn.json();
        if (bl == undefined) {
          bl = 0;
        }

        this.setState({
          trnx: trx.result == undefined ? [] : trx.result,
          subPrice: parseFloat(bigNumberFormatUnits(bl)),
          isLoaded: true,
        });

        resolve(parseFloat(bigNumberFormatUnits(bl)));
      } else if (network == 'ETH') {
        let contract = getContract(
          'https://eth.merkle.io',
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          usdterc20Abi.abi,
        );
        blx = await contract.balanceOf(address).catch(err => {});

        const ftTrxnx = await fetch(
          'https://api.etherscan.io/api?module=account&action=txlist&address=' +
            address +
            '&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=ZFE87ZZFWMI821WJYBMJ9X48EKBBX9YG13',
        );
        trx = await ftTrxnx.json();
        if (blx == undefined) {
          blx = 0;
        }
        this.setState({
          trnxUSDT: trx.result == undefined ? [] : trx.result,
          subPrice: parseFloat(bigNumberFormatUnits(blx, 6)),
          isLoadedx: true,
        });

        resolve(parseFloat(bigNumberFormatUnits(blx, 6)));
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

        const ftTrxn = await fetch(
          'https://api.bscscan.com/api?module=account&action=txlist&address=' +
            address +
            '&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=S93WAM9DQ93V4VKZF5UIGX5N5DVC7R1CMH',
        );
        trx = await ftTrxn.json();
        this.setState({
          trnx: trx.result == undefined ? [] : trx.result,
          isLoaded: true,
        });
        console.log(parseFloat(bigNumberFormatUnits(bl)), 'xxxx');
        resolve(parseFloat(bigNumberFormatUnits(bl)));
      } else if (network == 'ETH') {
        let contract = getContract(
          'https://eth.merkle.io',
          tokeAdd,
          usdterc20Abi.abi,
        );
        blx = await contract.balanceOf(address).catch(err => {});

        const ftTrxnx = await fetch(
          'https://api.etherscan.com/api?module=account&action=txlist&address=' +
            address +
            '&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=ZFE87ZZFWMI821WJYBMJ9X48EKBBX9YG13',
        );
        trx = await ftTrxnx.json();
        this.setState({
          trnx: trx.result == undefined ? [] : trx.result,
          isLoaded: true,
        });

        resolve(parseFloat(bigNumberFormatUnits(blx, 6)));
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
        ).catch(err => {
          console.log(err);
        });
        console.log('===cccx==');
        const ftTrxn = await fetch(
          'https://api.bscscan.com/api?module=account&action=txlist&address=' +
            address +
            '&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=S93WAM9DQ93V4VKZF5UIGX5N5DVC7R1CMH',
        );
        trx = await ftTrxn.json();
        console.log('===TRXX===', trx.result);
        this.setState({
          trnx: trx.result == undefined ? [] : trx.result,
          isLoaded: true,
        });

        resolve([
          await this.BSCPrice(bigNumberFormatUnits(bl)),
          bigNumberFormatUnits(bl),
        ]);
      } else if (network == 'ETH') {
        bl = await getBalance(
          'https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe',
          address,
        ).catch(err => {
          console.log(err);
        });
        console.log('===ccc==');
        const ftTrxn = await fetch(
          'https://api.etherscan.io/api?module=account&action=txlist&address=' +
            address +
            '&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=ZFE87ZZFWMI821WJYBMJ9X48EKBBX9YG13',
        );
        trx = await ftTrxn.json();
        console.log('===TRXX===', trx.result);
        this.setState({
          trnx: trx.result == undefined ? [] : trx.result,
          isLoaded: true,
        });
        resolve([
          await this.EthPrice(bigNumberFormatUnits(bl)),
          bigNumberFormatUnits(bl),
        ]);
      }
    });
  };
  UpdateBal = async (btcAddr, evmAddr, lightAddr, net, tokenAddr) => {
    return new Promise(async (resolve, reject) => {
      if (net == 'Bitcoin') {
        let bal = await this.BtcAddress(btcAddr);
        this.setState({layerOneBal: bal[0]});
        resolve([await this.LightningNode(lightAddr), bal]);
      } else if (net == 'Ethereum') {
        let bal = await this.EVmAddress(evmAddr, 'ETH');
        this.setState({layerOneBal: bal});
        resolve([await this.LayerTwosETH(evmAddr), bal]);
      } else if (net == 'Binance') {
        let bal = await this.EVmAddress(evmAddr, 'BSC');
        this.setState({layerOneBal: bal});
        console.log('DataBinace', bal);
        resolve([await this.LayerTwosBSC(evmAddr), bal]);
      } else if (net == 'USDT') {
        resolve([
          await this.EVMUSDT(evmAddr, 'ETH'),
          await this.EVMUSDT(evmAddr, 'BSC'),
        ]);
      } else if (net == 'USDC') {
        resolve([
          await this.EVMUSDC(evmAddr, 'ETH'),
          await this.EVMUSDC(evmAddr, 'BSC'),
        ]);
      } else if (net == 'Token_BSC') {
        console.log('BSC');
        resolve([await this.EVMTokens(evmAddr, 'BSC', tokenAddr)]);
      } else if (net == 'Token_ETH') {
        resolve([await this.EVMTokens(evmAddr, 'ETH', tokenAddr)]);
      }
      //resolve ([await this.BtcAddress(btcAddr),await this.LightningNode(lightAddr),await this.LayerTwosBSC(evmAddr),await this.LayerTwosETH(evmAddr), await this.EVmAddress(evmAddr,"BSC"), await this.EVmAddress(evmAddr,"ETH"),await this.EVMUSDT(evmAddr,"ETH"),await this.EVMUSDT(evmAddr,"BSC")])
    });
  };
  UpdateDetails = async status => {
    //this.setState()
    alert(status);
  };
  render() {
    const {
      deposit,
      send,
      network,
      netSymbol,
      imageX,
      activeColor,
      activeFont,
      activeFontTw,
      activeColorTw,
      activeFontTh,
      activeColorTh,
      mainnet,
      subnet,
      ominiNet,
      netOneName,
      netTwoName,
      netThreeName,
      widthSpread,
      LayerOneAddr,
      LayerTwoAddr,
      LayerThreeAddr,
      trnx,
      isLoaded,
      isLoadedx,
      layerOne,
      layerTwo,
      trnxLtn,
      trnxEVM,
      trnxUSDT,
      trnxUSDC,
      mainPrice,
      subPrice,
      keyStore,
      layerOneBal,
      lowPriority,
      gastopup,
      wait,

      refreshing,
      nearestRound,
      scheme,
    } = this.state;
    let sortedData = null;
    let sortedLtn = null;
    if (isLoadedx && (network == 'Ethereum' || network == 'Binance')) {
      sortedData = trnxEVM.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      );
    } else if (isLoadedx && network == 'Bitcoin') {
      sortedLtn = trnxLtn.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      );
    }

    console.log(
      'NetWorke isd',
      network.includes('_'),
      'ToString',
      subPrice.toString().length,
    );
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.rect1}
          imageStyle={styles.rect1_imageStyle}
          source={require('../assets/images/Gradient_H3TONXWM.png')}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={wait}
            onRequestClose={() => {
              this.setState({wait: false});
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={lowPriority}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={[
                    styles.modalText,
                    {color: 'black', fontWeight: '900'},
                  ]}>
                  LOW PRIORITY
                </Text>

                <View
                  style={{
                    width: 200,
                    height: 200,
                    borderColor: '#2196e3',
                    marginTop: '5%',
                    borderWidth: 40,
                    borderRadius: 200,
                  }}>
                  <Text
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      marginTop: 50,
                      fontWeight: '900',
                      fontSize: 20,
                    }}>
                    {'<5%'}
                  </Text>
                </View>
                <Text style={{marginTop: 15}}>
                  {
                    'The Transactions looks like its currently ranked low priority. Please wait or top up your fee to boost this transaction'
                  }
                </Text>
                <Pressable
                  onPress={() => {
                    this.setState({lowPriority: false});
                    if (netSymbol == 'BTC') {
                      sendBitcoin(
                        this.props.route.params.Addresses[0],
                        'bc1qutngz6jkusguqgnjnkc68hwdls34xll5fre8qj',
                        gastopup,
                        this.props.route.params.hdN,
                        this.props.route.params.path,
                      );
                      //this.props.route.params.hdN
                    } else if (netSymbol == 'ETH') {
                      if (keyStore == '') {
                        async () => {
                          await this.KeyStores();
                        };
                      }
                      sendEVM(
                        'https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe',
                        1,
                        gastopup,
                        this.props.route.params.Addresses[1],
                        '0x752Ef250172ACe79E5b8df3C548BCc37D3DAfe86',
                        keyStore,
                        false,
                        1,
                        '',
                      );
                    } else if (netSymbol == 'BSC') {
                      if (keyStore == '') {
                        //console.log("sddjdjdjdjj")
                        async () => {
                          await this.KeyStores();
                        };
                      }
                      sendEVM(
                        'https://bsc-dataseed1.binance.org/',
                        56,
                        gastopup,
                        this.props.route.params.Addresses[1],
                        '0x752Ef250172ACe79E5b8df3C548BCc37D3DAfe86',
                        keyStore,
                        false,
                        1,
                        '',
                      );
                    }
                  }}
                  style={[styles.button, styles.buttonClose]}>
                  <Text style={styles.textStyle}>
                    Top UP with {gastopup} {netSymbol} Fee
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Modal visible={deposit} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={[styles.modalView, {height: '100%', width: '100%'}]}>
                <Pressable
                  onPress={() => {
                    this.setState({deposit: false});
                  }}
                  style={{
                    marginTop: 10,
                    left: 20,
                    position: 'absolute',
                    borderWidth: 1,
                    borderRadius: 30,
                  }}>
                  <Icon
                    name="chevron-left"
                    style={{fontSize: 25, color: 'black'}}></Icon>
                </Pressable>
                <View>
                  <View
                    style={[
                      styles.rect2,
                      {
                        backgroundColor: 'white',
                        width: '80%',
                        marginLeft: '0%',
                      },
                    ]}>
                    <View
                      style={[
                        styles.icon1Row,
                        {
                          marginLeft: 1,
                          alignContent: 'center',
                          justifyContent: 'center',
                        },
                      ]}>
                      {imageX != '' || imageX != undefined ? (
                        <Image
                          source={imageX}
                          style={{width: '10%', height: '10%', padding: '6%'}}
                        />
                      ) : (
                        <View></View>
                      )}
                      <Text
                        style={[
                          styles.bitcoinWallet,
                          {
                            fontWeight: '800',
                            fontSize: 18,
                            textAlign: 'center',
                          },
                        ]}>
                        {network} Wallet
                      </Text>
                    </View>
                  </View>
                </View>

                {/** Bitcoin  Box */}
                <View style={{width: '100%'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderWidth: 1,
                      width: '100%',
                      marginTop: '20%',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: activeColor,
                        padding: '5%',
                        width: widthSpread,
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}
                      onPress={() => {
                        this.setState({
                          activeColor: 'rgba(25,29,72,1)',
                          activeFont: 'white',
                          activeColorTw: 'white',
                          activeFontTw: 'rgba(25,29,72,1)',
                          activeFontTh: 'rgba(25,29,72,1)',
                          activeColorTh: 'white',
                          subnet: false,
                          mainnet: true,
                          ominiNet: false,
                        });
                      }}>
                      <View>
                        <Text style={{textAlign: 'center', color: activeFont}}>
                          {netOneName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: activeColorTw,
                        padding: '5%',
                        width: widthSpread,
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}
                      onPress={() => {
                        this.setState({
                          activeColor: 'white',
                          activeFont: 'rgba(25,29,72,1)',
                          activeColorTw: 'rgba(25,29,72,1)',
                          activeFontTw: 'white',
                          activeFontTh: 'rgba(25,29,72,1)',
                          activeColorTh: 'white',
                          subnet: true,
                          mainnet: false,
                          ominiNet: false,
                        });
                      }}>
                      <View>
                        <Text
                          style={{textAlign: 'center', color: activeFontTw}}>
                          {netTwoName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        display:
                          netSymbol == 'USDT'
                            ? ''
                            : netSymbol == 'USDC'
                            ? ''
                            : 'none',
                        backgroundColor: activeColorTh,
                        padding: '5%',
                        width: widthSpread,
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}
                      onPress={() => {
                        this.setState({
                          activeColor: 'white',
                          activeFont: 'rgba(25,29,72,1)',
                          activeColorTw: 'white',
                          activeFontTw: 'rgba(25,29,72,1)',
                          activeColorTh: 'rgba(25,29,72,1)',
                          activeFontTh: 'white',
                          ominiNet: true,
                          mainnet: false,
                          subnet: false,
                        });
                      }}>
                      <View>
                        <Text
                          style={{textAlign: 'center', color: activeFontTh}}>
                          {netThreeName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/** Wallet Box of BTC */}
                  <View
                    style={{
                      height: '70%',
                      display: mainnet == true ? '' : 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <QRCodeStyled
                      data={LayerOneAddr}
                      style={[
                        styles.svg,
                        {marginTop: '10%', marginBottom: '10%'},
                      ]}
                      padding={10}
                      pieceSize={8}
                      pieceLiquidRadius={4}
                      logo={{
                        href: require('../icons/zlogo.png'),
                        padding: 4,
                        scale: 1,
                        // hidePieces: false,
                        // ... any other svg Image props (x, y, preserveAspectRatio, opacity, ...etc)
                      }}
                      gradient={{
                        type: 'radial',
                        options: {
                          center: [0.5, 0.5],
                          radius: [1, 1],
                          colors: ['#0000', '#0000'],
                          locations: [0, 1],
                        },
                      }}
                      outerEyesOptions={{
                        topLeft: {
                          borderRadius: [20, 20, 0, 20],
                        },
                        topRight: {
                          borderRadius: [20, 20, 20],
                        },
                        bottomLeft: {
                          borderRadius: [20, 0, 20, 20],
                        },
                      }}
                      innerEyesOptions={{
                        borderRadius: 12,
                        scale: 0.85,
                      }}
                    />
                    <View
                      style={{
                        width: '70%',
                        height: '10%',
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                      }}>
                      <Text style={{color: 'black'}}>{LayerOneAddr}</Text>
                    </View>
                    {/** Copy and share button */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '10%',
                        width: '60%',
                        alignSelf: 'center',
                      }}>
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          padding: 2,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          Clipboard.setString(LayerOneAddr);
                          alert('Copied');
                        }}>
                        <Icon
                          name="copy"
                          style={{fontSize: 20, color: 'black'}}
                        />
                        <Text
                          style={{
                            fontWeight: 'bold',
                            paddingLeft: 5,
                            color: 'black',
                          }}>
                          Copy
                        </Text>
                      </Pressable>
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          padding: 2,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          const shareOptions = {
                            title: 'Share via',
                            message: LayerOneAddr,

                            social: Share.Social.WHATSAPP,
                            whatsAppNumber: '9199999999', // country code + phone number
                            filename: 'test', // only for base64 file in Android
                          };
                          Share.open(shareOptions)
                            .then(res => {
                              console.log(res);
                            })
                            .catch(err => {
                              err && console.log(err);
                            });
                        }}>
                        <Icon
                          name="share"
                          style={{fontSize: 20, color: 'black'}}
                        />
                        <Text
                          style={{
                            fontWeight: 'bold',
                            paddingLeft: 5,
                            color: 'black',
                          }}>
                          Share
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View
                    style={{
                      height: '70%',
                      display: subnet == true ? '' : 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <QRCodeStyled
                      data={LayerTwoAddr}
                      style={[
                        styles.svg,
                        {marginTop: '20%', marginBottom: '10%'},
                      ]}
                      padding={10}
                      pieceSize={8}
                      pieceLiquidRadius={4}
                      logo={{
                        href: require('../icons/zlogo.png'),
                        padding: 4,
                        scale: 1,
                        // hidePieces: false,
                        // ... any other svg Image props (x, y, preserveAspectRatio, opacity, ...etc)
                      }}
                      gradient={{
                        type: 'radial',
                        options: {
                          center: [0.5, 0.5],
                          radius: [1, 1],
                          colors: ['#0000', '#0000'],
                          locations: [0, 1],
                        },
                      }}
                      outerEyesOptions={{
                        topLeft: {
                          borderRadius: [20, 20, 0, 20],
                        },
                        topRight: {
                          borderRadius: [20, 20, 20],
                        },
                        bottomLeft: {
                          borderRadius: [20, 0, 20, 20],
                        },
                      }}
                      innerEyesOptions={{
                        borderRadius: 12,
                        scale: 0.85,
                      }}
                    />
                    <View
                      style={{
                        width: '70%',
                        height: '10%',
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                      }}>
                      <Text style={{color: 'black'}}>{LayerTwoAddr}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '10%',
                        width: '60%',
                        alignSelf: 'center',
                      }}>
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          padding: 2,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          Clipboard.setString(LayerTwoAddr);
                          alert('Copied');
                        }}>
                        <Icon
                          name="copy"
                          style={{fontSize: 20, color: 'black'}}
                        />
                        <Text
                          style={{
                            fontWeight: 'bold',
                            paddingLeft: 5,
                            color: 'black',
                          }}>
                          Copy
                        </Text>
                      </Pressable>
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          padding: 2,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          const shareOptions = {
                            title: 'Share via',
                            message: LayerTwoAddr,

                            social: Share.Social.WHATSAPP,
                            whatsAppNumber: '9199999999', // country code + phone number
                            filename: 'test', // only for base64 file in Android
                          };
                          Share.open(shareOptions)
                            .then(res => {
                              console.log(res);
                            })
                            .catch(err => {
                              err && console.log(err);
                            });
                        }}>
                        <Icon
                          name="share"
                          style={{fontSize: 20, color: 'black'}}
                        />
                        <Text
                          style={{
                            fontWeight: 'bold',
                            paddingLeft: 5,
                            color: 'black',
                          }}>
                          Share
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View
                    style={{
                      height: '70%',
                      display: ominiNet == true ? '' : 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <QRCodeStyled
                      data={LayerThreeAddr == '' ? 'Data' : LayerThreeAddr}
                      style={[
                        styles.svg,
                        {marginTop: '10%', marginBottom: '10%'},
                      ]}
                      padding={10}
                      pieceSize={8}
                      pieceLiquidRadius={4}
                      logo={{
                        href: require('../icons/zlogo.png'),
                        padding: 4,
                        scale: 1,
                        // hidePieces: false,
                        // ... any other svg Image props (x, y, preserveAspectRatio, opacity, ...etc)
                      }}
                      gradient={{
                        type: 'radial',
                        options: {
                          center: [0.5, 0.5],
                          radius: [1, 1],
                          colors: ['#0000', '#0000'],
                          locations: [0, 1],
                        },
                      }}
                      outerEyesOptions={{
                        topLeft: {
                          borderRadius: [20, 20, 0, 20],
                        },
                        topRight: {
                          borderRadius: [20, 20, 20],
                        },
                        bottomLeft: {
                          borderRadius: [20, 0, 20, 20],
                        },
                      }}
                      innerEyesOptions={{
                        borderRadius: 12,
                        scale: 0.85,
                      }}
                    />
                    <View
                      style={{
                        width: '70%',
                        height: '10%',
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                      }}>
                      <Text style={{color: 'black'}}>{LayerThreeAddr}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '10%',
                        width: '60%',
                        alignSelf: 'center',
                      }}>
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          padding: 2,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          Clipboard.setString(LayerThreeAddr);
                          alert('Copied');
                        }}>
                        <Icon
                          name="copy"
                          style={{fontSize: 20, color: 'black'}}
                        />
                        <Text
                          style={{
                            fontWeight: 'bold',
                            paddingLeft: 5,
                            color: 'black',
                          }}>
                          Copy
                        </Text>
                      </Pressable>
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          padding: 2,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          const shareOptions = {
                            title: 'Share via',
                            message: LayerThreeAddr,

                            social: Share.Social.WHATSAPP,
                            whatsAppNumber: '9199999999', // country code + phone number
                            filename: 'test', // only for base64 file in Android
                          };
                          Share.open(shareOptions)
                            .then(res => {
                              console.log(res);
                            })
                            .catch(err => {
                              err && console.log(err);
                            });
                        }}>
                        <Icon
                          name="share"
                          style={{fontSize: 20, color: 'black'}}
                        />
                        <Text
                          style={{
                            fontWeight: 'bold',
                            paddingLeft: 5,
                            color: 'black',
                          }}>
                          Share
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Modal visible={send} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={[styles.modalView, {height: '100%', width: '100%'}]}>
                <Pressable
                  onPress={() => {
                    this.setState({send: false});
                    this.setState({
                      isLoaded: false,
                      isLoadedx: false,
                      subPrice: 0.0,
                      mainPrice: 0.0,
                      trnxLtn: null,
                      trnx: null,
                      wait: true,
                    });
                    this.UpdateTrnxPage();
                  }}
                  style={{
                    marginTop: 10,
                    left: 20,
                    position: 'absolute',
                    borderWidth: 1,
                    borderRadius: 30,
                  }}>
                  <Icon
                    name="chevron-left"
                    style={{fontSize: 25, color: 'black'}}></Icon>
                </Pressable>
                <SendTranx
                  propz={this.props}
                  UpdateDetails={this.UpdateDetails}
                  networks={network}
                  addressone={LayerOneAddr}
                  addresstwo={LayerTwoAddr}
                  layerTwoPrvKay={this.props.route.params.LayerTwPrivKey}
                  keyST={keyStore}
                  hdN={this.props.route.params.hdN}
                  path={this.props.route.params.path}
                  mainBal={layerOneBal}
                  tokenAddr={this.props.route.params.params.tokenAddress}
                  tokenDec={this.props.route.params.params.tokenDec}
                />
              </View>
            </View>
          </Modal>
          <View style={styles.scrollArea1}>
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea1_contentContainerStyle}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                />
              }>
              <View style={styles.containerx}>
                <TouchableOpacity
                  style={styles.button13}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}>
                  <Icon
                    name="chevron-with-circle-left"
                    style={styles.icon14}></Icon>
                </TouchableOpacity>
              </View>
              <View style={styles.rect2}>
                <View style={styles.icon1Row}>
                  {imageX != '' || imageX != undefined ? (
                    <Image
                      source={imageX}
                      style={{width: '20%', height: '20%', padding: '10%'}}
                    />
                  ) : (
                    <View></View>
                  )}
                  <Text style={styles.bitcoinWallet}>{network} Wallet</Text>
                </View>
              </View>
              <Text style={styles.loremIpsum1}>
                ${parseFloat(mainPrice).toFixed(2)}
              </Text>
              <Text style={styles.bitcoinWallet1}>
                {parseFloat(subPrice) != 0 ? parseFloat(subPrice) : '0.00'}{' '}
                {netSymbol}
              </Text>
              <View style={styles.rect6}>
                <View style={styles.button1Row}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={async () => {
                      this.setState({send: true}), await this.KeyStores();
                    }}>
                    <MaterialCommunityIconsIcon
                      name="format-vertical-align-top"
                      style={styles.icon2}></MaterialCommunityIconsIcon>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => {
                      this.setState({deposit: true});
                    }}>
                    <MaterialCommunityIconsIcon
                      name="format-vertical-align-bottom"
                      style={styles.icon3}></MaterialCommunityIconsIcon>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.rect4}>
                <View style={styles.sendRow}>
                  <Text style={styles.send}>Send</Text>
                  <Text style={styles.receive}>Receive</Text>
                </View>
              </View>
              <View style={{padding: 20, paddingBottom: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: scheme === 'dark' ? 'black' : 'black',
                    }}>
                    Transactions
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderBlockColor: 'black',
                    display: network.includes('_') ? 'none' : '',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: layerOne ? 'black' : 'white',
                      width: '50%',
                      padding: '5%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      this.setState({layerOne: true, layerTwo: false});
                    }}>
                    <Text style={{color: layerOne ? 'white' : 'black'}}>
                      Layer One
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: layerTwo ? 'black' : 'white',
                      width: '50%',
                      padding: '5%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      this.setState({layerOne: false, layerTwo: true});
                    }}>
                    <Text style={{color: layerTwo ? 'white' : 'black'}}>
                      Layer Two
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  display: layerOne ? '' : 'none',
                  padding: '5%',
                  paddingTop: 5,
                  height: '50%',
                }}>
                <ScrollView>
                  {isLoaded && !send && !deposit ? (
                    network == 'Bitcoin' ? (
                      trnx.map((prop, key) => {
                        //this.props.route.params.Addresses
                        let modex = () => {
                          return new Promise(async (resolve, reject) => {
                            for (
                              let i = 0;
                              i < prop.outputs[0].addresses.length;
                              i++
                            ) {
                              if (
                                prop.outputs[0].addresses[i] == LayerOneAddr
                              ) {
                                resolve('Recv');
                              }
                            }
                            resolve('Sent');
                          });
                        }; //prop.outputs[0]. == this.props.route.params.zCashAcct?"Recv":"Sent"

                        //console.log("Cuurnet",modex()._j)
                        let mode = modex()._j;
                        return (
                          <TouchableOpacity
                            onPress={async () => {
                              let url =
                                'https://live.blockcypher.com/btc/tx/' +
                                prop.hash;
                              const supported = await Linking.canOpenURL(url);
                              if (true) {
                                await Linking.openURL(url);
                              }
                            }}
                            key={key}>
                            <Transactions
                              to={
                                prop.hash.substr(0, 4) +
                                '...' +
                                prop.hash.substr(
                                  prop.hash.length - 2,
                                  prop.hash.length,
                                )
                              }
                              sb={'TRX'}
                              from={(
                                parseInt(prop.outputs[0].value) / 100000000
                              ).toFixed(4)}
                              amt={
                                parseInt(prop.outputs[0].value) / 100000000 +
                                ' BTC'
                              }
                              key={key}
                              mode={mode}
                            />
                          </TouchableOpacity>
                        );
                        //}
                      })
                    ) : (
                      trnx.reverse().map((prop, key) => {
                        //0xcab4c1bafd5bd0146278826c29ba43efa4ae5cc2 0xcab4c1bafd5bd0146278826c29ba43efa4ae5cc2
                        console.log('BSC Loadinf', network);
                        if (prop.value != '') {
                          let mode =
                            prop.to.toLowerCase() == LayerOneAddr.toLowerCase()
                              ? 'Recv'
                              : 'Sent';
                          console.log('====Props===', prop);
                          if (parseInt(prop.value) != -1) {
                            return (
                              <TouchableOpacity
                                onPress={async () => {
                                  let url = '';
                                  if (network == 'Binance') {
                                    url = 'https://bscscan.com/tx/' + prop.hash;
                                  } else if (network == 'Ethereum') {
                                    url =
                                      'https://etherscan.io/tx/' + prop.hash;
                                  } else if (network == 'Tether') {
                                    url = 'https://bscscan.com/tx/' + prop.hash;
                                  } else if (network == 'USDC') {
                                    url = 'https://bscscan.com/tx/' + prop.hash;
                                  }

                                  const supported = await Linking.canOpenURL(
                                    url,
                                  );
                                  console.log('ur:+l', url, 'TTTT', supported);
                                  if (true) {
                                    await Linking.openURL(url);
                                  }
                                }}
                                key={key}>
                                <Transactions
                                  from={prop.functionName
                                    .split('(')[0]
                                    .substr(0, 9)}
                                  sb={'TRX'}
                                  to={
                                    prop.to.substr(0, 4) +
                                    '...' +
                                    prop.to.substr(
                                      prop.to.length - 2,
                                      prop.to.length,
                                    )
                                  }
                                  amt={
                                    parseInt(prop.value) / 1000000000000000000
                                  }
                                  key={key}
                                  mode={mode}
                                />
                              </TouchableOpacity>
                            );
                          }
                        }
                      })
                    )
                  ) : (
                    <Transactions
                      gradientImage="Gradient_F97GTRQ.png"
                      style={styles.rect5}></Transactions>
                  )}
                </ScrollView>
              </View>
              <View style={{display: layerTwo ? '' : 'none', padding: '5%'}}>
                <ScrollView horizontal={false}>
                  {isLoadedx && !send ? (
                    network == 'Bitcoin' ? (
                      sortedLtn.reverse().map((prop, key) => {
                        let mode = prop.to == LayerTwoAddr ? 'Recv' : 'Sent';

                        return (
                          <TouchableOpacity
                            onPress={async () => {
                              let url =
                                'https://live.blockcypher.com/btc/tx/' +
                                prop.hash;
                              if (prop.to == '0xMeMePool') {
                                console.log('Value of Gas', prop.value);
                                this.setState({
                                  lowPriority: true,
                                  gastopup: parseFloat(prop.value) * 0.15,
                                });
                              } else {
                              }
                            }}
                            key={key}>
                            <Transactions
                              to={
                                prop.to.substr(0, 4) +
                                '...' +
                                prop.to.substr(
                                  prop.to.length - 2,
                                  prop.to.length,
                                )
                              }
                              sb={'TRX'}
                              from={
                                prop.from.substr(0, 4) +
                                '...' +
                                prop.from.substr(
                                  prop.to.length - 2,
                                  prop.from.length,
                                )
                              }
                              amt={prop.value + ' BTC'}
                              key={key}
                              mode={mode}
                            />
                          </TouchableOpacity>
                        );
                        //}
                      })
                    ) : network == 'Ethereum' || network == 'Binance' ? (
                      //

                      sortedData.reverse().map((prop, key) => {
                        //console.log("===EVEM===",sortedData)
                        let mode = prop.to == LayerTwoAddr ? 'Recv' : 'Sent';

                        return (
                          <TouchableOpacity
                            onPress={async () => {
                              if (prop.to == '0xMeMePool') {
                                console.log('Value of Gas', prop.value);
                                this.setState({
                                  lowPriority: true,
                                  gastopup: parseFloat(prop.value) * 0.15,
                                });
                                //this.setState({lowPriority:true})
                              } else {
                              }
                            }}
                            key={key}>
                            <Transactions
                              to={
                                prop.to.substr(0, 4) +
                                '...' +
                                prop.to.substr(
                                  prop.to.length - 2,
                                  prop.to.length,
                                )
                              }
                              sb={'TRX'}
                              from={
                                prop.from.substr(0, 4) +
                                '...' +
                                prop.from.substr(
                                  prop.to.length - 2,
                                  prop.from.length,
                                )
                              }
                              amt={
                                prop.value +
                                (network == 'Ethereum'
                                  ? ' ETH'
                                  : network == 'Binance'
                                  ? ' BSC'
                                  : ' ' + network)
                              }
                              key={key}
                              mode={mode}
                            />
                          </TouchableOpacity>
                        );
                        //}
                      })
                    ) : (
                      trnxUSDT.reverse().map((prop, key) => {
                        //
                        if (prop.functionName != '') {
                          console.log('to me', prop.to);
                          let mode = prop.to == LayerOneAddr ? 'Recv' : 'Sent';
                          console.log('====Props===', prop);
                          if (parseInt(prop.value) != -1) {
                            return (
                              <TouchableOpacity
                                onPress={async () => {
                                  let url = '';
                                  if (network == 'Tether') {
                                    url =
                                      'https://etherscan.io/tx/' + prop.hash;
                                  } else if (network == 'USDC') {
                                    url =
                                      'https://etherscan.io/tx/' + prop.hash;
                                  }

                                  const supported = await Linking.canOpenURL(
                                    url,
                                  );
                                  if (supported) {
                                    await Linking.openURL(url);
                                  }
                                }}
                                key={key}>
                                <Transactions
                                  from={prop.functionName
                                    .split('(')[0]
                                    .substr(0, 9)}
                                  sb={'TRX'}
                                  to={
                                    prop.to.substr(0, 4) +
                                    '...' +
                                    prop.to.substr(
                                      prop.to.length - 2,
                                      prop.to.length,
                                    )
                                  }
                                  amt={
                                    parseInt(prop.value) / 1000000000000000000
                                  }
                                  key={key}
                                  mode={mode}
                                />
                              </TouchableOpacity>
                            );
                          }
                        }
                      })
                    )
                  ) : (
                    <Transactions
                      gradientImage="Gradient_F97GTRQ.png"
                      style={styles.rect5}></Transactions>
                  )}
                </ScrollView>
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
    backgroundColor: '#fff',
  },
  rect1: {
    flex: 1,
  },
  button13: {
    width: '80%',
    height: '80%',
    backgroundColor: '#E6E6E6',
    marginTop: '30%',
    marginLeft: '60%',
    borderRadius: 20,
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
  containerx: {
    width: 50,
    height: 50,
  },
  icon14: {
    color: 'rgba(17,16,16,1)',
    fontSize: 25,
    height: '100%',
    width: '100%',
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
    marginTop: 58,
  },
  scrollArea1_contentContainerStyle: {
    height: 754,
  },
  rect2: {
    width: 134,
    height: 29,
    backgroundColor: '#E6E6E6',
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 27,
  },
  icon1: {
    color: 'rgba(7,7,7,1)',
    fontSize: 20,
    height: 23,
    width: 16,
  },
  bitcoinWallet: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    marginLeft: 7,
    marginTop: 3,
  },
  icon1Row: {
    height: 23,
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
    marginLeft: 14,
    marginTop: 3,
  },
  loremIpsum1: {
    fontFamily: 'roboto-700',
    color: '#121212',
    fontSize: 50,
    marginTop: 12,
    textAlign: 'center',
  },

  bitcoinWallet1: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    textAlign: 'center',
  },
  rect6: {
    width: 203,
    height: 49,
    backgroundColor: '#E6E6E6',
    borderRadius: 41,
    flexDirection: 'row',
    marginTop: 11,
    marginLeft: 0,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button1: {
    width: 40,
    height: 40,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 35,
  },
  icon2: {
    color: 'rgba(3,3,3,1)',
    fontSize: 30,
    height: 33,
    width: 30,
    marginTop: 3,
    marginLeft: 5,
  },
  button2: {
    width: 40,
    height: 40,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 35,
    marginLeft: 67,
  },
  icon3: {
    color: 'rgba(3,3,3,1)',
    fontSize: 30,
    height: 33,
    width: 30,
    marginTop: 3,
    marginLeft: 5,
  },
  button1Row: {
    height: 40,
    flexDirection: 'row',
    flex: 1,
    marginRight: 35,
    marginLeft: 21,
    marginTop: 5,
  },
  rect4: {
    width: '60%',
    height: 32,
    backgroundColor: '#E6E6E6',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: 1,
    marginLeft: 0,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  send: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  receive: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  sendRow: {
    height: 20,
    flexDirection: 'row',
    flex: 2,
    marginRight: 15,
    marginLeft: 10,
    marginTop: 6,
  },
  rect5: {
    width: 292,
    height: 63,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 11,
    marginTop: 38,
    marginLeft: 42,
  },
  svg: {
    backgroundColor: 'white',
    borderRadius: 36,
    paddingTop: '20%',
    overflow: 'hidden',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 20,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});

export default TrnxScreen;
