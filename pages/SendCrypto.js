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

export const sendLayerTwocash = async (net, val, from, to) => {
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
    })
    .catch(error => {
      alert('Error Occured' + error);
      console.log(error);
    });
};
export const sendBitcoin = async (from, to, value, seeds, pathz) => {
  //,setmodalVisible,settrxSum,settrnsFee,settrnx)=> {
  //console.log(this.props.hdN)
  let seed = seeds; //this.props.hdN//prop.propz.route.params.hdN

  let hdNode = bip32.fromSeed(seed);
  const masterFingerprint = hdNode.fingerprint;
  const path = pathz; //prop.propz.route.params.dPath//"m/84'/0'/0'/0/0";
  console.log('===== Seeds=== ', seed, pathz);
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
        //===//console.log("Lengtht",psbt.toBuffer().length+31)
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
        console.log('v1', vnn, 'v2', vl2, 'v3', vl3, 'Total', vnn + vl2 + vl3);
        let ii = 0;

        //psbt.updateOutput(0,{value:parseInt(vl)-fees})
        for (let i = 0; i < vout; i++) {
          psbt.signInputHD(i, hdNode);
        }

        psbt.finalizeAllInputs();

        const signedTx = psbt.extractTransaction();
        //===//console.log("\n========.",signedTx.toHex())

        pushTrx(signedTx.toHex());
        // settrnx(signedTx.toHex());
      } else {
        alert('Wallet Currently Empty');
      }
    })
    .catch(error => {
      alert('Error Occured:' + error);
      //===//console.log(error)
    });
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
export const sendUSDT = async (
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
      let gasPrxtoGwei = (parseInt(gasPrice.gasPrice) / 1000000000).toFixed(2);

      console.log(pretrnx);
      // settrnsFee((parseInt(gasPrice.toString()))/1000000000 +" Gwei")
      if (pretrnx == false) {
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
                  });
              })
              .catch(err => {
                alert('2:-' + err);
                console.log(err);
              });
          })
          .catch(err => {
            alert('3:-' + err);
            //===//console.log(err);
          });
      } else {
        //settrxSum(true)
        console.log('gasPrice', gasPrxtoGwei);
      }
    })
    .catch(err => {
      alert('4:-' + err);
      //===//console.log(err);
    });
};

export const sendEVM = async (
  rpcURL,
  chainId,
  amounts,
  fromAddress,
  toAddress,
  keyST,
  pretrnx,
  mainBal,
  net,
) => {
  let data = '0x';
  let amount = amounts.toString();
  let keystore =
    keyST; /*await exportKeystoreFromMnemonic('password',prop.mnemoniz,prop.address,"m/44'/60'/0'/0/"+prop.path)
      .catch(err => {
          console.log(err);
      });*/
  console.log('===<><', amount);
  console.log(
    'xxxxxxxkeystorexxxxxxxxx',
    keystore,
    '====keystore======',
    keyST,
  );
  getGasPrice(rpcURL)
    .then(gasPrice => {
      let gasPrxtoGwei = (parseInt(gasPrice.gasPrice) / 1000000000).toFixed(2);
      //===//console.log('gasPrice', gasPrice.toString());
      //===//console.log(pretrnx)
      //settrnsFee((parseInt(gasPrice.toString()))/1000000000 +" Gwei")
      if (pretrnx == false) {
        //setmodalVisible(true)
        if (mainBal > 0) {
          //this.setState({modalVisible:true})
          getGasLimit(rpcURL, fromAddress, toAddress, amount, data)
            .then(gasLimit => {
              //===//console.log('gasLimit', gasLimit.toString());
              //===//console.log('gas', bigNumberFormatUnits(gasPrice.mul(gasLimit)));

              getNonce(rpcURL, fromAddress)
                .then(nonce => {
                  //===//console.log('nonce', nonce);
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
                          //this.setState({modalVisible:false})
                          prop.UpdateDetails(
                            'Transaction Sent\n\n' + resTx.hash,
                          );
                          //===//console.log(resTx);
                          waitForTransaction(rpcURL, resTx.hash)
                            .then(res => {
                              //prop.UpdateDetails('Transaction Successful\n\n'+res.transactionHash);
                              alert(
                                'Transaction Successful\n\n' +
                                  res.transactionHash,
                              );
                              //===//console.log(res);
                            })
                            .catch(err => {
                              alert(err);
                              //===//console.log(err);
                              //this.setState({modalVisible:false})
                            });
                        })
                        .catch(err => {
                          alert(err);
                          //===//console.log(err);
                          //this.setState({modalVisible:false})
                        });
                    })
                    .catch(err => {
                      alert(err);
                      //===//console.log(err);
                      //this.setState({modalVisible:false})
                    });
                })
                .catch(err => {
                  alert(err);
                  //===//console.log(err);
                  //this.setState({modalVisible:false})
                });
            })
            .catch(err => {
              alert(err);
              //===//console.log(err);
              // this.setState({modalVisible:false})
            });
        } else {
          console.log('===Sending to layer one====');
          // this.setState({m2layer2:true})
          // this.sendLayerTwocash(net,amount,fromAddress,"0xMeMePool")
          //this.setState({m2layer2:false})
        }
      } else {
        //settrxSum(true)
        //this.setState({trxSum:true,modalVisible:false,trnsFee:gasPrxtoGwei +" Gwei"})
        //setmodalVisible(false)
      }
    })
    .catch(err => {
      alert(err);
      //===//console.log(err);
      setmodalVisible(false);
    });
};
