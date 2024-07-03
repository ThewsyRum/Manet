import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  Appearance,
  Modal
} from "react-native";
import CreateWallet from "./CreateWallet";
class StartScreen extends Component {
  constructor(props){
    console.log(props.navigation.navigate)
    super(props);
    this.state = {
        newWallet:false,
        ImpWallet:false,
        //mnemonics:bip39.generateMnemonic(),
        scheme : Appearance.getColorScheme()
    }
}

render() {
  const {newWallet,ImpWallet,mnemonics} = this.state
  return (
    <View style={styles.container}>
      <Modal visible={newWallet} collapsable={true}><CreateWallet></CreateWallet></Modal>
      <ImageBackground
        style={styles.rect}
        imageStyle={styles.rect_imageStyle}
        source={require("../assets/images/Gradient_H3TONXW.png")}
      >

        <Text style={styles.mandatWallet}>MANDAT WALLET</Text>
        <Image
          source={require("../assets/images/currency-exchange-service-monetary-transfer-changing-dollar-euro-buying-selling-foreign-money-golden-coins-with-eu-us-currency-symbols-vector-isolated-concept-metaphor-illustration_335657-2818.jpeg")}
          resizeMode="contain"
          style={styles.image}
        ></Image>
        <Text style={styles.loremIpsum}>
          Store and Exchange Crypto currenciec
        </Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("CreateWallet")}
          style={styles.button}
        >
          <Text style={styles.createWallet}>Create Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("RestoreWallet")}
          style={styles.button2}
        >
          <Text style={styles.restoreWallet}>Restore Wallet</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rect: {
    flex: 1
  },
  rect_imageStyle: {},
  mandatWallet: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "10%",
    textAlign:"center"
  },
  image: {
    width: 200,
    height: 200,
    marginTop: "2%",
    alignSelf:"center"
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: "2%",
    textAlign:"center"
  },
  button: {
    width: 200,
    height: 56,
    backgroundColor: "#092b61",
    borderRadius: 11,
    marginTop: "25%",
    alignSelf:"center"
  },
  createWallet: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    marginTop: 20,
    marginLeft: 58
  },
  button2: {
    width: 200,
    height: 56,
    backgroundColor: "#092b61",
    borderRadius: 11,
    marginTop: "5%",
    alignSelf:"center"
  },
  restoreWallet: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    marginTop: 21,
    marginLeft: 54
  }
});

export default StartScreen;
