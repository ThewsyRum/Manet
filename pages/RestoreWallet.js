import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Appearance,
  TextInput,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
class RestoreWallet extends Component {
    constructor(props){
      super(props);
      this.state = {
          scheme : Appearance.getColorScheme(),
          mnembox0:"",
          mnembox1:"",
          mnembox2:"",
          mnembox3:"",
          mnembox4:"",
          mnembox5:"",
          mnembox6:"",
          mnembox7:"",
          mnembox8:"",
          mnembox9:"",
          mnembox10:"",
          mnembox11:"",
          mnemonics:"",
          info:"",
      }
  }
render() {
 const {mnembox0,mnembox1,mnembox2,mnembox3,mnembox4,mnembox5,mnembox6,mnembox7,mnembox8,mnembox9,mnembox10,mnembox11,mnemonics,info} =this.state
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.rect1}
        imageStyle={styles.rect1_imageStyle}
        source={require("../assets/images/Gradient_H3TONXW.png")}
      >
        <ScrollView>
        <View style={styles.icon1Row}>
          <Icon name="ccw" style={styles.icon1}></Icon>
          <Text style={styles.newWallet1}>RESTORE WALLET</Text>
          
        </View>
        <View>
        <Text style={[styles.newWallet1,{color:"red",fontSize:12}]}>{info}</Text>
        </View>
        <View style={styles.rect2}>
          <View style={styles.rect3Row}>
            <KeyboardAvoidingView style={styles.rect3}><TextInput style={styles.rect3}  onChangeText={(text)=>{this.setState({mnembox0:text})}}></TextInput></KeyboardAvoidingView>
            
           <KeyboardAvoidingView style={styles.rect4}><TextInput style={styles.rect4} onChangeText={(text)=>{this.setState({mnembox1:text})}}></TextInput></KeyboardAvoidingView> 
           <KeyboardAvoidingView  style={styles.rect5} ><TextInput style={styles.rect5} onChangeText={(text)=>{this.setState({mnembox2:text})}}></TextInput></KeyboardAvoidingView> 
          </View>
          <View style={styles.rect8Row}>
            <TextInput style={styles.rect8} onChangeText={(text)=>{this.setState({mnembox3:text})}}></TextInput>
            <TextInput style={styles.rect7} onChangeText={(text)=>{this.setState({mnembox4:text})}}></TextInput>
            <TextInput style={styles.rect6} onChangeText={(text)=>{this.setState({mnembox5:text})}}></TextInput>
          </View>
          <View style={styles.rect9Row}>
            <TextInput style={styles.rect9} onChangeText={(text)=>{this.setState({mnembox6:text})}}></TextInput>
            <TextInput style={styles.rect10} onChangeText={(text)=>{this.setState({mnembox7:text})}}></TextInput>
            <TextInput style={styles.rect11} onChangeText={(text)=>{this.setState({mnembox8:text})}}></TextInput>
          </View>
          <View style={styles.rect14Row}>
            <TextInput style={styles.rect14} onChangeText={(text)=>{this.setState({mnembox9:text})}}></TextInput>
            <TextInput style={styles.rect13} onChangeText={(text)=>{this.setState({mnembox10:text})}}></TextInput>
            <TextInput style={styles.rect12} onChangeText={(text)=>{this.setState({mnembox11:text})}}></TextInput>
          </View>
        </View>
        <Text style={styles.enterYourMnemonics}>Enter your mnemonics</Text>
        <TouchableOpacity style={styles.button} onPress={()=>{
          
          mnm = mnembox0+" "+mnembox1+" "+mnembox2+" "+mnembox3+" "+mnembox4+" "+mnembox5+" "+mnembox6+" "+mnembox7+" "+mnembox8+" "+mnembox9+" "+mnembox10+" "+mnembox11;
          
          if (mnembox0==""||mnembox1==""||mnembox2==""|| mnembox3==""|| mnembox4==""|| mnembox5==""|| mnembox6==""||mnembox7==""||mnembox8==""||mnembox9==""||mnembox10==""||mnembox11==""){
            this.setState({info:"Inccorrect Mnemomics"});console.log(mnm.toLocaleLowerCase())
          }else{
            this.props.route.params.isCreateD(mnm.toLocaleLowerCase());
          }}}>
          <Text style={styles.restoreWallet1}>Restore Wallet</Text>
        </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rect1: {
    flex: 1
  },
  rect1_imageStyle: {},
  icon1: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    fontWeight:"900",
    height: "80%",
    width: "20%"
  },
  newWallet1: {
    fontFamily: "roboto-700",
    color: "#808080",
    fontSize: 20,
    fontWeight:"900",
    marginLeft: "13%",
    marginTop: "4%"
  },
  icon1Row: {
    height: "8%",
    flexDirection: "row",
    marginTop: "25%",
    marginLeft: "8%",
    marginRight: "40%"
  },
  rect2: {
    width: "90%",
    height: "50%",
    backgroundColor: "rgba(227,232,241,1)",
    borderRadius: 13,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 150,
    shadowOpacity: 1,
    shadowRadius: 50,
    marginTop: "1%",
    alignSelf:"center"
  },
  rect3: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    padding:"2%"
  },
  rect4: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: "5%",
    padding:"2%"
  },
  rect5: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: "5%",
    padding:"2%"
  },
  rect3Row: {
    height: "10%",
    flexDirection: "row",
    marginTop: "10%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  rect8: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    padding:"2%"
  },
  rect7: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: "5%",
    padding:"2%"
  },
  rect6: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: "5%",
    padding:"2%"
  },
  rect8Row: {
    height: "10%",
    flexDirection: "row",
    marginTop: "10%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  rect9: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    padding:"2%"
  },
  rect10: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: "5%",
    padding:"2%"
  },
  rect11: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: "5%",
    padding:"2%"
  },
  rect9Row: {
    height: "10%",
    flexDirection: "row",
    marginTop: "10%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  rect14: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    padding:"2%"
  },
  rect13: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: "5%",
    padding:"2%"
  },
  rect12: {
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: "5%",
    padding:"2%"
  },
  rect14Row: {
    height: "10%",
    flexDirection: "row",
    marginTop: "10%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  enterYourMnemonics: {
    fontFamily: "roboto-regular",
    color: "white",
    fontSize: 12,
    marginTop: "2%",
    textAlign:"center",
  },
  button: {
    width: 200,
    height: 56,
    backgroundColor: "#092b61",
    borderRadius: 11,
    marginTop: "5%",
   alignSelf:"center"
  },
  restoreWallet1: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    marginTop: 20,
    textAlign:"center"
  }
});

export default RestoreWallet;
