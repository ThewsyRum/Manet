import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Appearance
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
let bip39 = require('bip39')
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
class CreateWallet extends Component {
    constructor(props){
      super(props);
      this.state = {
          scheme : Appearance.getColorScheme(),
          mnemo:"",
          mnemnoics:[],
      }
    // console.log("====",())
  }
  componentDidMount(){
    this.Mnemonics()
  }
  Mnemonics=()=>{
    const mnm = bip39.generateMnemonic()
    console.log(mnm.split(' '))
    this.setState({mnemo:mnm,mnemnoics:mnm.split(' ')})
  }
render() {
  const {mnemo,mnemnoics} = this.state
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.rect1}
        imageStyle={styles.rect1_imageStyle}
        source={require("../assets/images/Gradient_H3TONXW.png")}
      >
        <View style={styles.iconRow}>
          <Icon name="plus" style={styles.icon}></Icon>
          <Text style={styles.newWallet}>NEW WALLET</Text>
        </View>
        <View style={styles.rect2}>
          <View style={styles.rect3Row}>
            <View style={styles.rect3}>
              <Text style={styles.loremIpsum}>{mnemnoics[0]}</Text>
            </View>
            <View style={styles.rect4}>
              <Text style={styles.loremIpsum1}>{mnemnoics[1]}</Text>
            </View>
            <View style={styles.rect5}>
              <Text style={styles.loremIpsum2}>{mnemnoics[2]}</Text>
            </View>
          </View>
          <View style={styles.rect8Row}>
            <View style={styles.rect8}>
              <Text style={styles.loremIpsum5}>{mnemnoics[3]}</Text>
            </View>
            <View style={styles.rect7}>
              <Text style={styles.loremIpsum4}>{mnemnoics[4]}</Text>
            </View>
            <View style={styles.rect6}>
              <Text style={styles.loremIpsum3}>{mnemnoics[5]}</Text>
            </View>
          </View>
          <View style={styles.rect11Row}>
            <View style={styles.rect11}>
              <Text style={styles.loremIpsum8}>{mnemnoics[6]}</Text>
            </View>
            <View style={styles.rect10}>
              <Text style={styles.loremIpsum7}>{mnemnoics[7]}</Text>
            </View>
            <View style={styles.rect9}>
              <Text style={styles.loremIpsum6}>{mnemnoics[8]}</Text>
            </View>
          </View>
          <View style={styles.rect14Row}>
            <View style={styles.rect14}>
              <Text style={styles.loremIpsum11}>{mnemnoics[9]}</Text>
            </View>
            <View style={styles.rect13}>
              <Text style={styles.loremIpsum10}>{mnemnoics[10]}</Text>
            </View>
            <View style={styles.rect12}>
              <Text style={styles.loremIpsum9}>{mnemnoics[11]}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.newWallet2}>
          Copy this mnemonics on a safe space
        </Text>
        <TouchableOpacity
          onPress={() => {this.props.route.params.isCreateD(mnemo)}}
          style={styles.button}
        >
          <Text style={styles.text}>Create Wallet</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(220,206,206,1)"
  },
  rect1: {
    flex: 1
  },
  rect1_imageStyle: {},
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    height: 46,
    width: 40
  },
  newWallet: {
    fontFamily: "roboto-700",
    color: "#808080",
    fontSize: 20,
    marginLeft: 13,
    marginTop: 11
  },
  iconRow: {
    height: 46,
    flexDirection: "row",
    marginTop: "20%",
    marginLeft: 23,
    marginRight: 175
  },
  rect2: {
    width: 330,
    height: 296,
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
    marginTop: "5%",
    alignSelf:"center"
  },
  rect3: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 6
  },
  rect4: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: 14
  },
  loremIpsum1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 7
  },
  rect5: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: 12
  },
  loremIpsum2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 6
  },
  rect3Row: {
    height: 32,
    flexDirection: "row",
    marginTop: 38,
    marginLeft: 10,
    marginRight: 9
  },
  rect8: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8
  },
  loremIpsum5: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 6
  },
  rect7: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: 14
  },
  loremIpsum4: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 6
  },
  rect6: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: 11
  },
  loremIpsum3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 7
  },
  rect8Row: {
    height: 32,
    flexDirection: "row",
    marginTop: 24,
    marginLeft: 12,
    marginRight: 8
  },
  rect11: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8
  },
  loremIpsum8: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 7
  },
  rect10: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: 15
  },
  loremIpsum7: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 6
  },
  rect9: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: 11
  },
  loremIpsum6: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 6
  },
  rect11Row: {
    height: 32,
    flexDirection: "row",
    marginTop: 22,
    marginLeft: 13,
    marginRight: 6
  },
  rect14: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8
  },
  loremIpsum11: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 7
  },
  rect13: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: 15
  },
  loremIpsum10: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 6
  },
  rect12: {
    width: 95,
    height: 32,
    backgroundColor: "rgba(112,123,198,1)",
    borderRadius: 8,
    marginLeft: 11
  },
  loremIpsum9: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 8,
    marginLeft: 6
  },
  rect14Row: {
    height: 32,
    flexDirection: "row",
    marginTop: 26,
    marginLeft: 13,
    marginRight: 6
  },
  newWallet2: {
    fontFamily: "roboto-regular",
    color: "white",
    fontSize: 12,
    marginTop: 29,
    textAlign:"center"
  },
  button: {
    width: 200,
    height: 56,
    backgroundColor: "#092b61",
    borderRadius: 11,
    marginTop: "10%",
    alignSelf:"center"
  },
  text: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    marginTop: 20,
    marginLeft: 58
  }
});

export default CreateWallet;
