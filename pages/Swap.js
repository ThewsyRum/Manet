import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  Appearance,
  TextInput,
  Linking,
} from 'react-native';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {Ellipse} from 'react-native-svg';
import EntypoIcon from 'react-native-vector-icons/Entypo';
//import WebVie
//import WebView from "react-native-webview"
import {WebView} from 'react-native-webview';

class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheme: Appearance.getColorScheme(),
    };
  }
  render() {
    return (
      <WebView
        style={{width: '100%', height: '100%', backgroundColor: 'white'}}
        onLoad={() => {
          console.log('Ended');
        }}
        source={{
          uri: 'https://app.uniswap.org',
        }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
      />

      /*
    <View style={styles.container}>
      <ImageBackground
        style={styles.rect1}
        imageStyle={styles.rect1_imageStyle}
        source={require("../assets/images/Gradient_H3TONXWY.png")}
      >
        <View style={styles.rect2}>
          <View style={styles.button2Row}>
            <TouchableOpacity style={styles.button2}>
              <MaterialCommunityIconsIcon
                name="bitcoin"
                style={styles.icon1}
              ></MaterialCommunityIconsIcon>
            </TouchableOpacity>
            <TextInput style={styles.rect4}></TextInput>
          </View>
          <Text style={styles.loremIpsum}>0.000 BTC</Text>
        </View>
        <View style={styles.ellipseStack}>
          <Svg viewBox="0 0 49.78 50" style={styles.ellipse}>
            <Ellipse
              stroke="rgba(230, 230, 230,1)"
              strokeWidth={0}
              fill="rgba(230, 230, 230,1)"
              cx={25}
              cy={25}
              rx={25}
              ry={25}
            ></Ellipse>
          </Svg>
          <EntypoIcon name="cycle" style={styles.icon}></EntypoIcon>
        </View>
        <View style={styles.rect3}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <MaterialCommunityIconsIcon
                name="ethereum"
                style={styles.icon2}
              ></MaterialCommunityIconsIcon>
            </TouchableOpacity>
            <TextInput style={styles.rect7}></TextInput>
          </View>
          <Text style={styles.loremIpsum1}>0.000 ETH</Text>
        </View>
        <TouchableOpacity
          gradientImage="Gradient_F97GTRQ.png"
          style={styles.button3}
          onPress={()=>{Linking.openURL("https://app.uniswap.org").catch(err =>
            console.error('An error occured', err))}}
        >
          <Text style={styles.text}>SWAP</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>*/
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
  rect1_imageStyle: {},
  rect2: {
    width: 375,
    height: 156,
    backgroundColor: '#E6E6E6',
    borderRadius: 69,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    marginTop: 85,
  },
  button2: {
    width: 77,
    height: 49,
    backgroundColor: '#E6E6E6',
    borderRadius: 30,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    borderWidth: 1,
    borderColor: '#000000',
  },
  icon1: {
    color: 'rgba(211,156,18,1)',
    fontSize: 40,
    height: 44,
    width: 40,
    marginTop: 3,
    marginLeft: 19,
  },
  rect4: {
    width: 122,
    height: 49,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 30,
    shadowOpacity: 1,
    shadowRadius: 10,
    marginLeft: 82,
    padding: '2%',
  },
  button2Row: {
    height: 49,
    flexDirection: 'row',
    marginTop: 53,
    marginLeft: 45,
    marginRight: 49,
  },
  loremIpsum: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    marginTop: 14,
    marginLeft: 233,
  },
  ellipse: {
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    position: 'absolute',
  },
  icon: {
    top: 4,
    left: 5,
    position: 'absolute',
    color: 'rgba(44,69,113,1)',
    fontSize: 40,
    height: 46,
    width: 40,
  },
  ellipseStack: {
    width: 50,
    height: 50,
    marginLeft: 154,
  },
  rect3: {
    width: 375,
    height: 156,
    backgroundColor: '#E6E6E6',
    borderRadius: 69,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      height: 3,
      width: -3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  button: {
    width: 77,
    height: 49,
    backgroundColor: '#E6E6E6',
    borderRadius: 30,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      height: 3,
      width: -3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    borderWidth: 1,
    borderColor: '#000000',
  },
  icon2: {
    color: 'rgba(25,38,129,1)',
    fontSize: 40,
    height: 44,
    width: 40,
    marginTop: 2,
    marginLeft: 18,
  },
  rect7: {
    width: 122,
    height: 49,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 30,
    shadowOpacity: 1,
    shadowRadius: 10,
    marginLeft: 75,
    marginTop: 2,
    padding: '2%',
  },
  buttonRow: {
    height: 51,
    flexDirection: 'row',
    marginTop: 54,
    marginLeft: 52,
    marginRight: 49,
  },
  loremIpsum1: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    marginTop: 10,
    marginLeft: 233,
  },
  button3: {
    width: 292,
    height: 63,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 11,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    marginTop: 65,
    marginLeft: 42,
  },
  text: {
    fontFamily: 'roboto-700',
    color: '#121212',
    fontSize: 40,
    marginTop: 8,
    marginLeft: 90,
  },
});

export default Swap;
