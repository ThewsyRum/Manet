import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Text,
  Appearance,
  Alert
} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";

class Settings extends Component {
    constructor(props){
      super(props);
      this.state = {
          scheme : Appearance.getColorScheme()
      }
     // console.log(this.props.route.isCreateD)
  }
  
render() {
  return (
    <View style={styles.container}>
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
            
            <TouchableOpacity
              gradientImage="Gradient_F97GTRQ.png"
              style={styles.button2} onPress={()=>{this.props.navigation.navigate("Wallets")}}
            >
              <View style={styles.icon2Row}>
                <EntypoIcon name="wallet" style={styles.icon2}></EntypoIcon>
                <Text style={styles.wallets}>Wallets</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              gradientImage="Gradient_F97GTRQ.png"
              style={styles.button3} onPress={()=>{this.props.navigation.navigate("Tokens")}}
            >
              <View style={styles.icon3Row}>
                <EntypoIcon
                  name="circle-with-plus"
                  style={styles.icon3}
                ></EntypoIcon>
                <Text style={styles.addTokens2}>Add Tokens</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              gradientImage="Gradient_F97GTRQ.png"
              style={styles.button4}
              onPress={()=>{this.props.navigation.navigate("Mnemonics")}}
            >
              <View style={styles.icon4Row}>
                <EntypoIcon name="cog" style={styles.icon4}></EntypoIcon>
                <Text style={styles.mnemonics}>Mnemonics</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              gradientImage="Gradient_F97GTRQ.png"
              style={styles.button5}
              onPress={()=>{
                Alert.alert('About Manet',"MANET is a versatile multicurrency wallet providing seamless management for various cryptocurrencies. With its intuitive interface, users can effortlessly send, receive, and monitor their digital assets across platforms. Security is paramount, employing advanced encryption and authentication methods for peace of mind. MANET integrates with major exchanges and DeFi platforms, facilitating smooth trading experiences. Its convenience and flexibility cater to both novice enthusiasts and seasoned investors, offering a centralized solution to navigate the complexities of the crypto market. MANET stands as a reliable gateway to multicurrency freedom, empowering users to control their finances with confidence and ease.")
              }}
            >
              <View style={styles.icon5Row}>
                <EntypoIcon
                  name="info-with-circle"
                  style={styles.icon5}
                ></EntypoIcon>
                <Text style={styles.abouts}>Abouts</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              gradientImage="Gradient_F97GTRQ.png"
              style={styles.button6}
              onPress={()=>{
                Alert.alert('Contact Us',"Email: support@manetcrypto.com")}}
            >
              <View style={styles.icon6Row}>
                <EntypoIcon name="old-phone" style={styles.icon6}></EntypoIcon>
                <Text style={styles.contactUs}>Contact Us</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
    width: 50,
    height: 25,
    backgroundColor: "#E6E6E6"
  },
  icon1: {
    color: "rgba(17,16,16,1)",
    fontSize: 20,
    height: 23,
    width: 20,
    marginTop: 1
  },
  settings: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginLeft: 59,
    marginTop: 12
  },
  button1Row: {
    height: 36,
    flexDirection: "row",
    marginTop: 28,
    marginLeft: 42,
    marginRight: 151
  },
  button2: {
    width: 292,
    height: 63,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 11,
    flexDirection: "row",
    marginTop: 74,
    marginLeft: 42
  },
  icon2: {
    color: "rgba(42,41,41,1)",
    fontSize: 40,
    height: 46,
    width: 40
  },
  wallets: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginLeft: 48,
    marginTop: 11
  },
  icon2Row: {
    height: 46,
    flexDirection: "row",
    flex: 1,
    marginRight: 133,
    marginLeft: 5,
    marginTop: 9
  },
  button3: {
    width: 292,
    height: 63,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 11,
    flexDirection: "row",
    marginTop: 22,
    marginLeft: 42
  },
  icon3: {
    color: "rgba(42,41,41,1)",
    fontSize: 40,
    height: 46,
    width: 40
  },
  addTokens2: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginLeft: 48,
    marginTop: 11
  },
  icon3Row: {
    height: 46,
    flexDirection: "row",
    flex: 1,
    marginRight: 94,
    marginLeft: 5,
    marginTop: 8
  },
  button4: {
    width: 292,
    height: 63,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 11,
    flexDirection: "row",
    marginTop: 21,
    marginLeft: 42
  },
  icon4: {
    color: "rgba(42,41,41,1)",
    fontSize: 40,
    height: 46,
    width: 40
  },
  mnemonics: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginLeft: 48,
    marginTop: 11
  },
  icon4Row: {
    height: 46,
    flexDirection: "row",
    flex: 1,
    marginRight: 94,
    marginLeft: 5,
    marginTop: 9
  },
  button5: {
    width: 292,
    height: 63,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 11,
    flexDirection: "row",
    marginTop: 14,
    marginLeft: 42
  },
  icon5: {
    color: "rgba(42,41,41,1)",
    fontSize: 40,
    height: 46,
    width: 40
  },
  abouts: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginLeft: 48,
    marginTop: 11
  },
  icon5Row: {
    height: 46,
    flexDirection: "row",
    flex: 1,
    marginRight: 135,
    marginLeft: 5,
    marginTop: 9
  },
  button6: {
    width: 292,
    height: 63,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 11,
    flexDirection: "row",
    marginTop: 80,
    marginLeft: 42
  },
  icon6: {
    color: "rgba(42,41,41,1)",
    fontSize: 40,
    height: 46,
    width: 40
  },
  contactUs: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginLeft: 48,
    marginTop: 11
  },
  icon6Row: {
    height: 46,
    flexDirection: "row",
    flex: 1,
    marginRight: 100,
    marginLeft: 5,
    marginTop: 9
  }
});

export default Settings;
