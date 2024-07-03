import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Text,
  Appearance,
  Pressable,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { CYPTO_ICON } from "../contents/iconuri";
import colors from "../config/colors";
import colordark from "../config/colordark";
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
let usdterc20Abi = require('./ERC20.json')
class Tokens extends Component {
    constructor(props){
      super(props);
      this.AddWallets =[]
      this.state = {
        wallets:this.AddWallets,
        walletName:"New Account",
        added:false,
        network:"Select Network >",
        tokenName:"",
        tokenSymbol:"",
        scanWall:false,
        toAddr:"",
        selection:{start:0},
        decimal:"",
        networkShow:false,
        networkARB:"",
        editablity:true,
        wait:false,
        report:'',
        scheme:Appearance.getColorScheme()
      }
  }
  componentDidMount(){
   // console.log("====sss===")
   // this.UpdateTrnxPage()
   this.getAccounts()
  }
  getAccounts = async()=> {
    
    const value = await AsyncStorage.getItem('@TokensAdded:key')

    if (value !== null) {
      vl = JSON.parse(value)
      this.AddWallets = vl.Tokens
      console.log("TOken Value", this.AddWallets,"Address",this.AddWallets[0][2])
    } else {
      console.log("Empty")
    }
  }
render() {
  const {wallets,walletName,added,network,tokenName,scanWall,toAddr,selection,decimal,networkShow,networkARB,editablity,wait,report,tokenSymbol,scheme} = this.state
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
                    <View style={styles.modalView}>
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
                visible={scanWall}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <QRCodeScanner
                      onRead={ async e => {
                        //===//console.log(e.data)
                        this.setState({scanWall:false})
                        let add = e.data.replace('ethereum','');
                        add = add.replace('bitcoin','')
                        add = add.replace(':','')
                        this.setState({toAddr:add})

                        //==================================
                        this.setState({selection:{start: 0}})
                              const ethAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
                              if (ethAddressRegExp.test(add) && add.length>5) {
                                if (networkARB != "") {
                                  this.setState({wait:true})
                                  let addr = add.match(ethAddressRegExp)[0]// toAddr.match(ethAddressRegExp)[0]
                                  //===//console.log("Valid Address",addr)
                                  this.setState({toAddr:addr})
                                  let rpc = ""
                                  if (networkARB == "ETH") {
                                      rpc = "https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe"
                                  } else if (networkARB == "BSC") {
                                    rpc = "https://bsc-dataseed1.binance.org/"
                                  }
                                  //===//console.log("RPC",rpc)
                                  let contInfo = getContract(rpc,addr,usdterc20Abi.abi)
                                  let dec = await contInfo.decimals().catch(e=> this.setState({editablity:false,wait:false,report:"Token not Found in this Network"}))
                                  let name = await contInfo.name().catch(e=> this.setState({editablity:false,wait:false,report:"Token not Found in this Network"}))
                                  let sym  = await contInfo.symbol().catch(e=> this.setState({editablity:false,wait:false,report:"Token not Found in this Network"}))
                                  this.setState({tokenName:name,decimal:isNaN(parseInt(dec))?'':parseInt(dec).toString(),wait:false,tokenSymbol:sym})
                                } else {
                                  alert("Select A Network");
                                  this.setState({toAddr:""})
                                }
                                
                              } else {
                                alert("Invalid Address")
                              }
                      }}
                      showMarker={true}
                      /*flashMode={RNCamera.Constants.FlashMode.torch}**/
                      topContent={
                        <Text style={styles.centerText}>
                          Scan Contract
                          
                        </Text>
                      }
                      bottomContent={
                        <TouchableOpacity style={styles.buttonTouchable}>
                          <Text style={styles.buttonText}>OK. Got it!</Text>
                        </TouchableOpacity>
                      }
                  
                      />
                        <Pressable onPress={()=>{this.setState({scanWall:false})}}
                            style={[styles.button, styles.buttonClose]}
                            >
                            <Text style={styles.textStyle}>x</Text>
                        </Pressable>
                    </View>
                </View>
                </Modal>
                <Modal
                animationType="slide"
                transparent={true}
                visible={networkShow}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView,{width:'90%',height:'80%'}]}>
                      <Text style={{color:scheme === 'dark'?"black": "black", fontSize:15,fontWeight:700}}>Select Network</Text>
                      <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-evenly',borderRadius:0,borderColor:"black",borderWidth:1, padding:15,marginTop:20,width:'100%',alignItems:'center'}} onPress={()=>{
                        this.setState({networkShow:false,network:'Ethereum',networkARB:'ETH'})
                      }}>
                      <Image 
                        source={CYPTO_ICON.ethereum.uri} 
                        style={{width:10,height:10,padding:20,flex:1,resizeMode:'contain'}} 
                        />
                        <Text style={{color:scheme === 'dark'?"black": "black",fontWeight:700,flex:4,textAlign:"left"}}>Ethereum</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flexDirection:'row',borderWidth:1,justifyContent:'space-evenly',borderRadius:0,borderColor:"black", padding:15,marginTop:20,width:'100%',alignItems:'center'}} onPress={()=>{
                        this.setState({networkShow:false,network:'Binance Smart Chain',networkARB:'BSC'})
                      }}>
                      <Image 
                        source={CYPTO_ICON.bsc.uri} 
                        style={{width:10,height:10,padding:20,flex:1,resizeMode:'contain'}} 
                        />
                        <Text style={{color:scheme === 'dark'?"black": "black",fontWeight:700,flex:4,textAlign:"left"}}>Binance Smart Chain</Text>
                      </TouchableOpacity>
                    </View>
                   
                  </View>
                </Modal>
      <ImageBackground
        style={styles.rect1}
        imageStyle={styles.rect1_imageStyle}
        source={require("../assets/images/Gradient_H3TONXWL.png")}
      >
        <View style={styles.scrollArea1}>
          <ScrollView
            horizontal={false}
            contentContainerStyle={styles.scrollArea1_contentContainerStyle}
          >
            <Pressable onPress={()=>{this.props.navigation.goBack()}}
                                    style={{marginTop:10,left:30,position:"absolute",borderWidth:1,borderRadius:30}}
                                    >
                    <Icon name="chevron-left" style={{fontSize:25,color:"black"}}></Icon>
                </Pressable>
                
            <TouchableOpacity
              gradientImage="Gradient_F97GTRQ.png"
              style={styles.button1} onPress={()=>{this.setState({networkShow:true})}}
            >
              <View style={styles.selectNetworkRow}>
                <Text style={styles.selectNetwork}>{network}</Text>
                <Icon name="chevron-small-down" style={styles.icon}></Icon>
              </View>
            </TouchableOpacity>
            <KeyboardAvoidingView style={[{flexDirection:'row',justifyContent:'space-evenly',borderWidth:0,borderRadius:0,borderColor:scheme === 'dark'?colordark.borderStk: colors.borderStk},styles.rect4]}>
                        <TextInput placeholder={'Enter Contract Address'} placeholderTextColor={"gray"}editable={true} style={{padding:10,borderColor:colors.secondry,borderRadius:0,width:'80%',color:scheme === 'dark'?colordark.textColor: colors.textColor}} onChangeText={(text)=>{
                                this.setState({toAddr:text})
                            }} value={toAddr} selection={selection} onBlur={async()=>{

                              this.setState({selection:{start: 0},report:""})
                              const ethAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
                              if (ethAddressRegExp.test(toAddr) && toAddr.length>5) {
                                if (networkARB != "") {
                                  this.setState({wait:true})
                                  let addr = toAddr.match(ethAddressRegExp)[0]
                                  //===//console.log("Valid Address",addr)
                                  this.setState({toAddr:addr})
                                  let rpc = ""
                                  if (networkARB == "ETH") {
                                      rpc = "https://mainnet.infura.io/v3/56bb53b84c2e439fa277c9e6522044fe"
                                  } else if (networkARB == "BSC") {
                                    rpc = "https://bsc-dataseed1.binance.org/"
                                  }
                                  //===//console.log("RPC",rpc)
                                  let contInfo = getContract(rpc,addr,usdterc20Abi.abi)
                                  let dec = await contInfo.decimals().catch(e=> this.setState({editablity:false,wait:false,report:"Token not Found in this Network"}))
                                  let name = await contInfo.name().catch(e=> this.setState({editablity:false,wait:false,report:"Token not Found in this Network"}))
                                  let sym  = await contInfo.symbol().catch(e=> this.setState({editablity:false,wait:false,report:"Token not Found in this Network"}))
                                  this.setState({tokenName:name,decimal:isNaN(parseInt(dec))?'':parseInt(dec).toString(),wait:false,tokenSymbol:sym})
                                } else {
                                  alert("Select A Network");
                                  this.setState({toAddr:""})
                                }
                                
                              } else {
                                alert("Invalid Address")
                              }
                              }} onFocus={()=>{this.setState({selection:null})}}/>
                        
                        <TouchableOpacity style={{backgroundColor:"white",padding:'3%',width:'20%',alignItems:'center',borderRadius:0,borderLeftWidth:1}} onPress={() => {/*rfbsheet.current.open()*/ this.setState({scanWall:true})}}>
                        <View><Text style={{justifyContent:"center",verticalAlign:"middle",marginTop:"20%"}}><Icon name="camera" size={20} color={"black"} /></Text></View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                    <Text style={{color:'red',marginTop:20}}>{report}</Text>
                    <KeyboardAvoidingView style={[{flexDirection:'row',justifyContent:'space-evenly',borderWidth:1,borderRadius:0,borderColor:scheme === 'dark'?colordark.borderStk: colors.borderStk},styles.rect3]}>
                        <TextInput value={tokenName} placeholder={'Enter Token Name'} placeholderTextColor={"gray"} editable={editablity} style={{padding:10,borderColor:colors.secondry,borderRadius:2,width:'85%',color:scheme === 'dark'?colordark.textColor: colors.textColor}} onChangeText={async(txt)=>{
                          this.setState({tokenName:txt});

                        }}/>
                      </KeyboardAvoidingView>
                      <KeyboardAvoidingView style={[{flexDirection:'row',justifyContent:'space-evenly',borderWidth:1,borderRadius:2,marginTop:20,borderColor:scheme === 'dark'?colordark.borderStk: colors.borderStk},styles.rect2]}>
                        <TextInput value={tokenSymbol} placeholder={'Enter Token Symbol'} editable={editablity} placeholderTextColor={"gray"} style={{padding:10,borderColor:colors.secondry,borderRadius:2,width:'85%',color:scheme === 'dark'?colordark.textColor: colors.textColor}} onChangeText={(txt)=>{
                          this.setState({tokenName:txt})
                        }}/>
                      </KeyboardAvoidingView>
            
                      <KeyboardAvoidingView style={[{flexDirection:'row',justifyContent:'space-evenly',borderWidth:1,borderRadius:2,marginTop:20,borderColor:scheme === 'dark'?colordark.borderStk: colors.borderStk},styles.rect2]}>
                        <TextInput value={decimal} placeholder={'Decimals'} keyboardType='numeric' placeholderTextColor={"gray"} editable={editablity} style={{padding:10,borderColor:colors.secondry,borderRadius:2,width:'85%',color:scheme === 'dark'?colordark.textColor: colors.textColor}} onChangeText={(txt)=>{
                          this.setState({decimal:txt})
                        }}/>
                      </KeyboardAvoidingView>
            <TouchableOpacity
              gradientImage="Gradient_F97GTRQ.png"
              style={styles.button5} onPress={async() => {

                if (decimal != "" && toAddr != "" && tokenName != "" && networkARB != "") {
                    let notadded = true
                    for (let i = 0; i <this.AddWallets.length;i++) {
                      if (this.AddWallets[i][2]==toAddr) {
                        
                        notadded = false
                        break
                      }
                    }

                    if (notadded) {
                      let tokenDetails = [
                        networkARB,
                        tokenName,
                        toAddr,
                        decimal,
                        tokenSymbol
                      ]
                      this.AddWallets.push(tokenDetails)
                      this.setState({wallets:this.AddWallets,added:true})
                      //===//console.log(wallets)
                      try {
                        let acctRa = {
                          "Tokens":this.AddWallets
                        }
                       await AsyncStorage.setItem(
                          '@TokensAdded:key',
                          JSON.stringify(acctRa),
                        );
                        alert("Saved Successfully")
                        this.setState({network:"Select Network>",tokenName:"",toAddr:"",decimal:"",networkARB:"",tokenSymbol:""})
                      } catch (error) {
                        // Error saving data
                      }
                    } else {
                      alert("Token Already Added")
                      this.setState({network:"Select Network>",tokenName:"",toAddr:"",decimal:"",networkARB:"",tokenSymbol:""})
                    }
                  } else {
                    alert("Fill All The required Fields")
                  }
                }
                  //0x8dcaba573792763de2780c10b77d66fe8380e396
                }
            >
              <Text style={styles.addToken}>ADD TOKEN</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}
}
const styles = StyleSheet.create({
  main: {
    flex:1,
    backgroundColor:'transparent'
},
  container: {
    flex: 1
  },
  rect1: {
    flex: 1
  },
  rect1_imageStyle: {},
  scrollArea1: {
    height: "100%",
    backgroundColor: "#E6E6E6",
    borderTopLeftRadius: 58,
    borderTopRightRadius: 58,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: -3,
      width: 3
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    marginTop: 44
  },
  scrollArea1_contentContainerStyle: {
    height: "100%"
  },
  button1: {
    width: 292,
    height: 64,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 0,
    flexDirection: "row",
    marginTop: 97,
    marginLeft: 0,
    alignSelf:"center",
    justifyContent:"center"
  },
  selectNetwork: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    width:"50%"
  },
  icon: {
    color: "rgba(44,43,43,1)",
    fontSize: 20,
    height: 23,
    width: 20,
    marginLeft: 109
  },
  selectNetworkRow: {
    height: 24,
    flexDirection: "row",
    flex: 1,
    marginRight: 17,
    marginLeft: 25,
    marginTop:16,
    
  },
  rect4: {
    width: 292,
    height: 64,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 0,
    marginTop: 25,
    marginLeft: 0,
    alignSelf:"center",
    justifyContent:"center"
  },
  rect3: {
    width: 292,
    height: 64,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 0,
    marginTop: 22,
    marginLeft: 0,
    alignSelf:"center",
    justifyContent:"center"
  },
  rect2: {
    width: 292,
    height: 64,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 0,
    marginTop: 20,
    marginLeft: 0,
    alignSelf:"center",
    justifyContent:"center"
  },
  button5: {
    width: 292,
    height: 64,
    backgroundColor: "rgba(170,174,168,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 0,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    marginTop: 50,
    marginLeft: 0,
    alignSelf:"center",
    justifyContent:"center"
  },
  addToken: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    
   textAlign:"center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor:  "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin:20
  },
  buttonClose: {
    backgroundColor: 'red',
  },
});

export default Tokens;
