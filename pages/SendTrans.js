import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Text,
  Appearance,
  SafeAreaView,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import '../shim';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
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
const {BIP32Factory} = require('bip32');
let bip39 = require('bip39');
let bip32 = BIP32Factory(ecc); //require('bip32')
let bitcoin = require('bitcoinjs-lib');

let usdterc20Abi = require('./ERC20.json');

class SendTranx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheme: Appearance.getColorScheme(),
      trxSum: false,
      rawInput: null,
      toAddr: '',
      modalVisible: false,
      scanWall: false,
      isShowPin: true,
      selection: {start: 0},
      trnsFee: 0,
      trnx: '',
      layerOne: true,
      layerTwo: false,
      EthereumNet: true,
      BSCNet: false,
      m2layer2: false,
    };
    console.log(this.props);
  }

  sendLayerTwocash = async (net, val, from, to) => {
    console.log('Senff==', net, val, to);
    console.log(
      this.props.layerTwoPrvKay[0].substring(10, 30),
      this.props.layerTwoPrvKay[1].substring(10, 30),
    );
    //var InsertAPIURL = "https://stonkbullz.com/updateblock.php";
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let theNet = '';
    let tokn = '';
    let trnxat = 'transact';
    const {EthereumNet, BSCNet} = this.state;
    if (net == 'Bitcoin') {
      theNet = 'Lightning';
    } else if (net == 'Binance') {
      theNet = 'BSCLayerTwo';
    } else if (net == 'ETH' || net == 'Ethereum') {
      theNet = 'EthLayerTwo';
    } else if (net == 'Tether' || net == 'USD') {
      trnxat = 'transactToken';
      if (net == 'Tether') {
        tokn = 'USDT';
      } else {
        tokn = 'USDC';
      }
      if (EthereumNet) {
        theNet = 'EthLayerTwo';
      } else {
        theNet = 'BSCLayerTwo';
      }
    }
    var Data = {
      Mode: trnxat,
      method: 'TRNF',
      value: val,
      from: from,
      to: to,
      token: tokn,
      network: theNet,
      privateKay:
        net == 'Bitcoin'
          ? this.props.layerTwoPrvKay[0].substring(10, 30)
          : this.props.layerTwoPrvKay[1].substring(10, 30),
    };
    fetch('https://stonkbullz.com/MnetWallet.php', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data), //convert data to JSON
    })
      .then(response => response.json()) //check response type of API (CHECK OUTPUT OF DATA IS IN JSON)
      .then(response => {
        console.log(response);
        //prop.UpdateDetails(response.Status)
        alert(response.Status);
        this.setState({m2layer2: false});
      })
      .catch(error => {
        alert('Error Occured' + error);
        console.log(error);
      });
  };
  sendBitcoin = async (net, prop, from, to, value) => {
    //,setmodalVisible,settrxSum,settrnsFee,settrnx)=> {
    //console.log(this.props.hdN)
    let seed = this.props.hdN; //prop.propz.route.params.hdN

    let hdNode = bip32.fromSeed(seed);
    const masterFingerprint = hdNode.fingerprint;
    const path = this.props.path; //prop.propz.route.params.dPath//"m/84'/0'/0'/0/0";
    let childNode = hdNode.derivePath(path);
    const pubkey = childNode.publicKey;
    const prvKey = childNode.privateKey;

    let redeemScript = bitcoin.payments.p2wpkh({
      pubkey: pubkey,
      network: bitcoin.networks.bitcoin,
    });

    console.log(
      '++++++',
      redeemScript.address,
      'From',
      from,
      'public',
      pubkey.toString('hex'),
    );

    const psbt = new bitcoin.Psbt({network: bitcoin.networks.bitcoin});

    const updateData = {
      bip32Derivation: [
        {
          masterFingerprint,
          path,
          pubkey,
        },
      ],
    };

    //===//console.log(updateData.bip32Derivation[0].pubkey.toString('hex'))
    //console.log(updateData.bip32Derivation[0].pubkey.toString('hex'))
    fetch(
      'https://api.blockcypher.com/v1/btc/main/addrs/' +
        redeemScript.address +
        '/full?unspentOnly=true&includeHex=true',
    )
      .then(response => response.json())
      .then(async response => {
        //===//console.log(response)
        let vout = 0;
        let totalout = 0;
        let PendingTrx = false;
        response.txs.forEach(tx => {
          let v_out = 0;
          let isSpent = '';
          const isSegwit = tx.hex.substring(8, 12) === '0001';
          //===//console.log("_____FFFF___",isSegwit)
          let utxo = tx;
          //===//console.log(utxo.hex)
          if (parseInt(utxo.confirmations) > 0) {
            psbt.setVersion(2);
            if (isSegwit) {
              //let vout = 0;
              utxo.outputs.forEach(x => {
                //console.log(x.value)

                if (x.addresses[0] == redeemScript.address) {
                  totalout += parseInt(x.value);
                  isSpent = x.spent_by == undefined ? '' : x.spent_by;
                  if (
                    totalout <= parseInt(response.final_balance) &&
                    isSpent == ''
                  ) {
                    psbt.addInput({
                      hash: utxo.hash,
                      index: v_out, //utxo.vout_sz,
                      witnessUtxo: {
                        script: Buffer.from(x.script, 'hex'), //Buffer.from(utxo.inputs[1].script,'hex'),
                        value: Number(x.value), //Number(parseInt(response.final_balance))
                      },
                      sequence: utxo.inputs[0].sequence,
                    });
                    psbt.updateInput(vout, updateData);
                    vout += 1;
                  }
                }
                v_out += 1;
              });
            } else {
              //let vout = 0;
              utxo.outputs.forEach(x => {
                if (x.addresses[0] == redeemScript.address) {
                  totalout += parseInt(x.value);
                  isSpent = x.spent_by == undefined ? '' : x.spent_by;
                  if (
                    totalout <= parseInt(response.final_balance) &&
                    isSpent == ''
                  ) {
                    psbt.addInput({
                      hash: utxo.hash,
                      index: v_out, //utxo.vout_sz,

                      nonWitnessUtxo: Buffer.from(utxo.hex, 'hex'),
                      sequence: utxo.inputs[0].sequence,
                    });
                    psbt.updateInput(vout, updateData);
                    vout += 1;
                    //v_out+=1
                  }
                }
                v_out += 1;
              });
            }
            console.log(
              'Total Value',
              totalout,
              'Final out',
              parseInt(response.final_balance),
              'Vout',
              vout,
            );
          }
        });
        //psbt.updateInput(0,updateData)

        if (vout > 0) {
          console.log('Lengtht', psbt.toBuffer().length + 31);
          let trxSize = psbt.toBuffer().length;
          let fees = 10 * (trxSize + 31);

          let index = 0;
          let vl = parseInt(parseFloat(value) * 100000000);

          let vnn = parseInt(vl - fees) - parseInt(vl * 0.01);

          //console.log(vnn)

          psbt.addOutput({address: to, value: vnn});

          let vl2 = parseInt(parseInt(response.final_balance) - vl);

          //console.log(vl,parseInt(response.final_balance),(vl*0.05))
          //console.log(vl2,"Total",vl+vl2,"Main", parseInt(response.final_balance))

          if (vl2 > 800) {
            index += 1;
            psbt.addOutput({address: from, value: vl2});
          }

          let vl3 = parseInt(vl * 0.01);

          if (vl3 > 800) {
            index += 1;
            psbt.addOutput({
              address: 'bc1qutngz6jkusguqgnjnkc68hwdls34xll5fre8qj',
              value: vl3,
            });
          }
          console.log(
            'v1',
            vnn,
            'v2',
            vl2,
            'v3',
            vl3,
            'fees',
            fees,
            'Total',
            vnn + vl2 + vl3 + fees,
          );
          let ii = 0;

          //psbt.updateOutput(0,{value:parseInt(vl)-fees})
          for (let i = 0; i < vout; i++) {
            psbt.signInputHD(i, hdNode);
          }

          psbt.finalizeAllInputs();

          const signedTx = psbt.extractTransaction();
          //===//console.log("\n========.",signedTx.toHex())

          this.setState({
            modalVisible: false,
            trxSum: true,
            trnsFee: fees / 100000000 + ' BTC',
            trnx: signedTx.toHex(),
          });
          //pushTrx(signedTx.toHex())

          //   settrnx(signedTx.toHex());
        } else {
          //alert("Wallet Currently Empty")
          this.setState({modalVisible: false});
          this.setState({m2layer2: true});
          this.sendLayerTwocash(net, value, from, '0xMeMePool');
        }
      })
      .catch(error => {
        alert('Error Occured:' + error);
        //===//console.log(error)
      });
    //===//console.log(from,to,value)
  };

  pushTrx = async trx => {
    //https://api.blockcypher.com/v1/bcy/test/txs/push?token=77608741d9074726bfca10d512936a89
    let tranx = {tx: trx};
    var headers = {
      // json: true,
      //headers: {"content-type": "application/json"},
      Accept: 'application/json',
      'Content-Type': 'application/json',
      //body: tranx
    };
    //===//console.log("======= TXT======",trx)
    fetch('https://api.blockcypher.com/v1/btc/main/txs/push', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(tranx),
    })
      .then(response => response.json())
      .then(async response => {
        //===//console.log(response);
        if (response.tx == undefined) {
          alert('Failed \n' + response.error);
        } else {
          alert('Successful \n' + response.tx.hash);
        }
      })
      .catch(err => {
        alert('Failed \n', JSON.stringify(err));
        console.log('---', err);
      });
  };
  sendUSDT = async (
    rpcURL,
    fromAddress,
    contractAddress,
    gasLimit,
    erc20ABI,
    toAddress,
    contractDecmis,
    amount,
    keyST,
    pretrnx,
  ) => {
    let keystore = keyST;
    console.log(
      'xxxxxxxkeystorexxxxxxxxx',
      keystore,
      '====keystore======',
      keyST,
    );
    getGasPrice(rpcURL)
      .then(gasPrice => {
        let gasPrxtoGwei = (parseInt(gasPrice.gasPrice) / 1000000000).toFixed(
          2,
        );

        console.log(pretrnx);
        // settrnsFee((parseInt(gasPrice.toString()))/1000000000 +" Gwei")
        if (pretrnx == false) {
          this.setState({modalVisible: true});
          getNonce(rpcURL, fromAddress)
            .then(nonce => {
              //===//console.log('nonce', nonce);
              contractTransaction(
                rpcURL,
                contractAddress,
                erc20ABI,
                keystore,
                'password',
                nonce,
                gasLimit,
                gasPrice.gasPrice,
                toAddress,
                amount,
                contractDecmis,
              )
                .then(tx => {
                  this.setState({modalVisible: false});
                  //prop.UpdateDetails('Transaction Sent\n\n'+tx.hash);
                  alert('Transaction Sent\n\n' + tx.hash);
                  //===//console.log(tx);
                  waitForContractTransaction(tx)
                    .then(res => {
                      //===//console.log(res);
                    })
                    .catch(err => {
                      alert('1:-' + err);
                      //===//console.log(err);
                      this.setState({modalVisible: false});
                    });
                })
                .catch(err => {
                  alert('2:-' + err);
                  console.log(err);
                  this.setState({modalVisible: false});
                });
            })
            .catch(err => {
              alert('3:-' + err);
              //===//console.log(err);
              this.setState({modalVisible: false});
            });
        } else {
          //settrxSum(true)
          console.log('gasPrice', gasPrxtoGwei);
          this.setState({
            modalVisible: false,
            trxSum: true,
            trnsFee: gasPrxtoGwei + ' Gwei',
          });
        }
      })
      .catch(err => {
        alert('4:-' + err);
        //===//console.log(err);
        this.setState({modalVisible: false});
      });
  };

  sendEVM = async (
    rpcURL,
    chainId,
    amount,
    fromAddress,
    toAddress,
    keyST,
    pretrnx,
    mainBal,
    net,
  ) => {
    let data = '0x';
    let keystore =
      keyST; /*await exportKeystoreFromMnemonic('password',prop.mnemoniz,prop.address,"m/44'/60'/0'/0/"+prop.path)
      .catch(err => {
          console.log(err);
      });*/
    //===//console.log("===<><",JSON.stringify(keystore))
    console.log(
      'xxxxxxxkeystorexxxxxxxxx',
      keystore,
      '====keystore======',
      keyST,
    );
    getGasPrice(rpcURL)
      .then(gasPrice => {
        let gasPrxtoGwei = (parseInt(gasPrice.gasPrice) / 1000000000).toFixed(
          2,
        );
        //===//console.log('gasPrice', gasPrice.toString());
        //===//console.log(pretrnx)
        //settrnsFee((parseInt(gasPrice.toString()))/1000000000 +" Gwei")
        if (pretrnx == false) {
          //setmodalVisible(true)
          if (parseFloat(mainBal) > 0) {
            this.setState({modalVisible: true});
            getGasLimit(rpcURL, fromAddress, toAddress, amount, data)
              .then(gasLimit => {
                //===//console.log('gasLimit', gasLimit.toString());
                //===//console.log('gas', bigNumberFormatUnits(gasPrice.mul(gasLimit)));

                getNonce(rpcURL, fromAddress)
                  .then(nonce => {
                    /* console.log(
                      'nonce',
                      nonce,
                      gasLimit,
                      gasPrice.gasPrice,
                      toAddress,
                      chainId,
                      bigNumberFormatUnits(bigNumberParseUnits(amount)),
                      data,
                    );*/
                    signTransaction(
                      keystore,
                      'password',
                      nonce,
                      gasLimit,
                      gasPrice.gasPrice,
                      toAddress,
                      chainId,
                      amount,
                      data,
                    )
                      .then(signedTx => {
                        //===//console.log('signedTx', signedTx);
                        sendTransaction(rpcURL, signedTx)
                          .then(resTx => {
                            this.setState({modalVisible: false});
                            alert(
                              'Transaction Sent\n\n' +
                                'Wait For Confirmation \n\n' +
                                resTx.hash,
                            );
                            //===//console.log(resTx);
                            waitForTransaction(rpcURL, resTx.hash)
                              .then(res => {
                                //prop.UpdateDetails('Transaction Successful\n\n'+res.transactionHash);
                                alert('Transaction Successful\n\n' + res.hash);
                                //console.log(res);
                              })
                              .catch(err => {
                                alert('Error EVM-1:' + err);
                                //===//console.log(err);
                                sthis.setState({modalVisible: false});
                              });
                          })
                          .catch(err => {
                            alert('Error EVM-2:' + err);
                            //===//console.log(err);
                            this.setState({modalVisible: false});
                          });
                      })
                      .catch(err => {
                        alert('Error EVM-3:' + err);
                        //===//console.log(err);
                        this.setState({modalVisible: false});
                      });
                  })
                  .catch(err => {
                    alert('Error EVM-4:' + err);
                    //===//console.log(err);
                    this.setState({modalVisible: false});
                  });
              })
              .catch(err => {
                alert('Error EVM-5:' + err);
                //===//console.log(err);
                this.setState({modalVisible: false});
              });
          } else {
            console.log('===Sending to layer one====');
            this.setState({m2layer2: true});
            this.sendLayerTwocash(net, amount, fromAddress, '0xMeMePool');
            //this.setState({m2layer2:false})
          }
        } else {
          //settrxSum(true)
          this.setState({
            trxSum: true,
            modalVisible: false,
            trnsFee: gasPrxtoGwei + ' Gwei',
          });
          //setmodalVisible(false)
        }
      })
      .catch(err => {
        alert(err);
        //===//console.log(err);
        setmodalVisible(false);
      });
  };
  sendFactory = async (
    net,
    layertwo,
    value,
    from,
    to,
    prop,
    keyST,
    pretrnx,
    trnx,
  ) => {
    console.log('=== Props =====', keyST, net);
    let mainBal = this.props.mainBal;
    let tokenAddr = this.props.tokenAddr;
    let tokenDec = this.props.tokenDec;
    const {EthereumNet, BSCNet} = this.state;
    if (layertwo) {
      if (pretrnx) {
        this.setState({
          modalVisible: false,
          trxSum: true,
          trnsFee: 0.5 + ' USD',
        });
      } else {
        this.sendLayerTwocash(net, value, from, to);
      }
    } else if (net == 'Binance') {
      //(value,from,to,prop)
      console.log('===Main Balance====', mainBal);
      this.sendEVM(
        'https://bsc-dataseed1.binance.org/',
        56,
        value,
        from,
        to,
        keyST,
        pretrnx,
        mainBal[1],
        net,
      );
    } else if (net == 'Ethereum') {
      //(value,from,to,prop)
      console.log('===Main Balance====', mainBal);
      this.sendEVM(
        'https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe',
        1,
        value,
        from,
        to,
        keyST,
        pretrnx,
        mainBal[1],
        net,
      );
    } else if (net == 'Bitcoin') {
      //(value,from,to,prop)
      //===//console.log("State",pretrnx)
      if (pretrnx) {
        this.sendBitcoin(net, prop, from, to, value); //,setmodalVisible,settrxSum,settrnsFee,settrnx)
      } else {
        console.log('Trxn', trnx);
        this.pushTrx(trnx);
      }
    } else if (net == 'Tether') {
      //(value,from,to,prop)
      if (EthereumNet) {
        console.log('====ETHEREUN===');
        this.sendUSDT(
          'https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe',
          from,
          '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          600000,
          usdterc20Abi.abi,
          to,
          18,
          value,
          keyST,
          pretrnx,
        );
      } else {
        this.sendUSDT(
          'https://bsc-dataseed1.binance.org/',
          from,
          '0x55d398326f99059fF775485246999027B3197955',
          600000,
          usdterc20Abi.abi,
          to,
          18,
          value,
          keyST,
          pretrnx,
        );
      }
    } else if (net == 'USDC') {
      //(value,from,to,prop)
      if (EthereumNet) {
        this.sendUSDT(
          'https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe',
          from,
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          600000,
          usdterc20Abi.abi,
          to,
          18,
          value,
          keyST,
          pretrnx,
        );
      } else {
        this.sendUSDT(
          'https://bsc-dataseed1.binance.org/',
          from,
          '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
          600000,
          usdterc20Abi.abi,
          to,
          18,
          value,
          keyST,
          pretrnx,
        );
      }
    } else if (net.includes('_')) {
      //(value,from,to,prop)
      if (net.includes('_BSC')) {
        console.log('Send BCS');
        this.sendUSDT(
          'https://bsc-dataseed1.binance.org/',
          from,
          tokenAddr,
          600000,
          usdterc20Abi.abi,
          to,
          parseInt(tokenDec),
          value,
          keyST,
          pretrnx,
        );
      } else {
        this.sendUSDT(
          'https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe',
          from,
          tokenAddr,
          600000,
          usdterc20Abi.abi,
          to,
          parseInt(tokenDec),
          value,
          keyST,
          pretrnx,
        );
      }
    }
  };
  render() {
    const {
      scheme,
      trxSum,
      rawInput,
      toAddr,
      modalVisible,
      scanWall,
      isShowPin,
      selection,
      trnsFee,
      trnx,
      layerOne,
      layerTwo,
      EthereumNet,
      BSCNet,
      m2layer2,
    } = this.state;

    const stylesz = StyleSheet.create({
      main: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
      },
      centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
      },
      textBold: {
        fontWeight: '500',
        color: '#000',
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
      },
      buttonTouchable: {
        padding: 16,
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white', //scheme === 'dark'?"black":"white",
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
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
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
    return (
      <SafeAreaView style={stylesz.main}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={trxSum}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.setState({checkingBtc: !checkingBtc});
          }}>
          <View style={stylesz.centeredView}>
            <View style={stylesz.modalView}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
                Transaction Summary
              </Text>
              <View style={{padding: '10%'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  From:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    margin: 2,
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  {layerOne ? this.props.addressone : this.props.addresstwo}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  To:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    margin: 2,
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  {toAddr}{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  Amount:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    margin: 2,
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  {parseFloat(rawInput)}{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  Transaction Fee:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    margin: 2,
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  {trnsFee}
                </Text>
              </View>
              <Pressable
                style={[stylesz.button, stylesz.buttonClose]}
                onPress={() => {
                  //his.setState({checkingBtc: !checkingBtc})
                  //this.setState({IMFPrx: true})

                  this.sendFactory(
                    this.props.networks,
                    layerTwo,
                    rawInput,
                    layerOne ? this.props.addressone : this.props.addresstwo,
                    toAddr,
                    this.props,
                    this.props.keyST,
                    false,
                    trnx,
                  );
                  //settrxSum(false)
                  //settoAddr("")
                  this.setState({rawInput: null, toAddr: '', trxSum: false});
                }}>
                <Text style={stylesz.textStyle}>Send Transaction</Text>
              </Pressable>
              <Pressable
                style={[
                  stylesz.button,
                  stylesz.buttonClose,
                  {margin: 10, backgroundColor: 'red'},
                ]}
                onPress={() => this.setState({trxSum: false})}>
                <Text style={stylesz.textStyle}>Cancel Transaction</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={stylesz.centeredView}>
            <View style={stylesz.modalView}>
              <Text style={[stylesz.modalText, {color: 'black'}]}>
                INITIATING TRANSACTION
              </Text>
              <Pressable
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
                style={[stylesz.button, stylesz.buttonClose]}>
                <Text style={stylesz.textStyle}>Please Wait....</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={m2layer2}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={stylesz.centeredView}>
            <View style={stylesz.modalView}>
              <Text
                style={[
                  stylesz.modalText,
                  {color: 'black', fontWeight: '800'},
                ]}>
                INITIATING TRANSACTION
              </Text>
              <Text style={[stylesz.modalText, {color: 'black', margin: '2%'}]}>
                Migrating Transaction to Layer One
              </Text>
              <Pressable
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
                style={[stylesz.button, stylesz.buttonClose]}>
                <Text style={stylesz.textStyle}>Please Wait....</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={scanWall}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={stylesz.centeredView}>
            <View style={stylesz.modalView}>
              <QRCodeScanner
                onRead={e => {
                  //===//console.log(e.data)
                  this.setState({scanWall: false});
                  let add = e.data.replace('ethereum', '');
                  add = add.replace('bitcoin', '');
                  add = add.replace(':', '');
                  settoAddr(add);
                }}
                showMarker={true}
                /*flashMode={RNCamera.Constants.FlashMode.torch}**/
                topContent={<Text>Scan Wallet</Text>}
                bottomContent={
                  <TouchableOpacity>
                    <Text>OK. Got it!</Text>
                  </TouchableOpacity>
                }
              />
              <Pressable
                onPress={() => {
                  this.setState({scanWall: false});
                }}
                style={[stylesz.button, stylesz.buttonClose]}>
                <Text style={stylesz.textStyle}>x</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{padding: 20, marginBottom: 10}}>
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
                Enter Amount
              </Text>
              <Text style={{color: scheme === 'dark' ? 'black' : 'black'}}>
                In{' '}
                {this.props.networks != 'Others'
                  ? this.props.networks
                  : this.props.tokensym}
              </Text>
            </View>
            <View>
              <KeyboardAvoidingView>
                <TextInput
                  placeholder={'Enter Amount'}
                  keyboardType="numeric"
                  style={{
                    padding: 10,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 5,
                    color: scheme === 'dark' ? 'black' : 'black',
                  }}
                  value={rawInput != null ? rawInput.toString() : ''}
                  onChangeText={text => {
                    if (isNaN(parseFloat(text)) && text.length > 0) {
                      alert('Numbers Only');
                      this.setState({rawInput: ''});
                    } else {
                      this.setState({rawInput: text});
                    }
                    //
                  }}
                />
              </KeyboardAvoidingView>
            </View>
          </View>
          <View style={{padding: 20, marginBottom: 10}}>
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
                Address/Account
              </Text>
            </View>

            <KeyboardAvoidingView
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: scheme === 'dark' ? 'gray' : 'gray',
              }}>
              <TextInput
                placeholder={'Press and Hold to Paste'}
                editable={true}
                style={{
                  padding: 10,
                  borderColor: 'gray',
                  borderRadius: 2,
                  width: '85%',
                  color: scheme === 'dark' ? 'black' : 'black',
                }}
                onChangeText={text => {
                  //  settoAddr(text);
                  this.setState({toAddr: text});
                }}
                value={toAddr}
                selection={selection}
                onBlur={() => {
                  this.setState({setSelection: {start: 0}});
                }}
                onFocus={() => {
                  this.setState({setSelection: {start: null}});
                }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  padding: '3%',
                  width: '15%',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
                onPress={() => {
                  /*rfbsheet.current.open() setscanWall(true);*/ this.setState({
                    scanWall: true,
                  });
                }}>
                <View>
                  <Text>
                    <Icon name="camera" size={20} color={'black'} />
                  </Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
          <View style={{padding: 20, marginBottom: 10}}>
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
                Network
              </Text>
            </View>
            <View>
              <TextInput
                value={
                  this.props.networks != 'Others'
                    ? this.props.networks
                    : this.props.tokenNet
                }
                editable={false}
                style={{
                  padding: 10,
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  color: scheme === 'dark' ? 'black' : 'black',
                }}
              />
            </View>
          </View>
          {this.props.networks == 'Tether' || this.props.networks == 'USDC' ? (
            <View style={{padding: 20, marginBottom: 10}}>
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
                  Chain
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderRadius: 10,
                  borderBlockColor: 'black',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: EthereumNet ? 'black' : 'white',
                    width: '50%',
                    padding: '5%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    this.setState({EthereumNet: true, BSCNet: false});
                  }}>
                  <Text style={{color: EthereumNet ? 'white' : 'black'}}>
                    Ethereum
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: BSCNet ? 'black' : 'white',
                    width: '50%',
                    padding: '5%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    this.setState({EthereumNet: false, BSCNet: true});
                  }}>
                  <Text style={{color: BSCNet ? 'white' : 'black'}}>
                    Binance Chain
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            ''
          )}
          <View style={{padding: 20, marginBottom: 10}}>
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
                Layers
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderRadius: 10,
                borderBlockColor: 'black',
                display: this.props.networks.includes('_') ? 'none' : '',
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
          <View style={{padding: 20, marginBottom: 10}}>
            <TouchableOpacity
              onPress={() => {
                this.setState({modalVisible: true});
                this.sendFactory(
                  this.props.networks,
                  layerTwo,
                  rawInput,
                  layerOne ? this.props.addressone : this.props.addresstwo,
                  toAddr,
                  this.props,
                  this.props.keyST,
                  true,
                  trnx,
                );
              }}
              style={{
                backgroundColor: 'white',
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: 'black',
                }}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{padding: 20, marginBottom: 10}}>
            <View
              style={{padding: 20, borderRadius: 20, justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 10}}>
                Note: Please Verifiy the network before clicking on the send
                button. In cases like USDT, sending to through the wrong network
                can result in parment loss of funds. Please be guided !!!
              </Text>
            </View>
          </View>
        </ScrollView>
        {/*<RBSheet
            ref={rfbsheet}
            height={600}
            closeOnDragDown={true}
            closeOnPressMask={false}
            customStyles={{
              wrapper: {
                backgroundColor: "transparent"
              },
              draggableIcon: {
                backgroundColor: "#000"
              }
            }}
          >
            <ScanScreen/>
          </RBSheet>*/}
      </SafeAreaView>
    );
  }
}

export default SendTranx;
