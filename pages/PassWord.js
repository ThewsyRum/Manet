import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,Appearance,Vibration
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from '@react-native-async-storage/async-storage';
class PINCODE extends Component {
    constructor(props){
      super(props);
      this.state = {
        scheme : Appearance.getColorScheme(),
        pin:"",
        color1:"rgba(230, 230, 230,1)",
        color2:"rgba(230, 230, 230,1)",
        color3:"rgba(230, 230, 230,1)",
        color4:"rgba(230, 230, 230,1)",
        PinType:"Enter Pin",
        createPin:false,
        storedPin:null,
        tempStore:null
    }
}
componentDidMount(){
  
     this.CheckPin()
    // this.props.navigation.setOptions({tabBarVisible: false})
    
 }
CheckPin = async()=>{
 const value = await AsyncStorage.getItem('@WalletPin:key')
 //const clearData = await AsyncStorage.clear();
   if (value !== null) {
     this.setState({PinType:"Enter Pin",createPin:false,storedPin:value})
     console.log("Value",value)
   } else {
     this.setState({PinType:"Create New Pin",createPin:true})
     
   }
}

PinEntered = async(value,number) =>{
 const {pin,createPin,storedPin,tempStore} = this.state
 var pin_temp = pin
 let lenPin = pin_temp.length+1
 Vibration.vibrate(100);
 
 switch(value) {
   
   case "number":
       //this.setState({pin:pin+number})
       if (lenPin <5) {
         pin_temp =pin_temp+ number 
        // console.log(pin_temp)
       }
       if (lenPin==4 && createPin && tempStore == null) {
         this.setState({PinType:"Re Enter Pin",tempStore:pin_temp});
         pin_temp = ""
         lenPin = 0
       }
       if (lenPin==4 && createPin && tempStore !=null) { 
         if (tempStore == pin_temp) {
           try {
             await AsyncStorage.setItem(
             '@WalletPin:key',
             pin_temp,
             );
             this.setState({PinType:"Enter Pin",createPin:false,storedPin:pin_temp})
             pin_temp = ""
             lenPin = 0
             console.log("Complete")
           } catch (error) {
               // Error saving data
           } 
         }
         
       }
       break;
   case "clear":
       pin_temp = ""
       lenPin = 0
       break;
 }
 
 if (storedPin != null) {
   if (storedPin.length>0) {
     //console.log(pin_temp,lenPin,storedPin)

     if (lenPin==4) {
       if (pin_temp == storedPin) {
     
         this.props.params.PinVerified()
         pin_temp = ""
         lenPin = 0
       } else {
       // console.log("InCorrect",pin_temp,storedPin)
         this.setState({PinType:"Incorrect Pin Try Again",color1:"rgba(230, 230, 230,1)",color2:"rgba(230, 230, 230,1)",color3:"rgba(230, 230, 230,1)",color4:"rgba(230, 230, 230,1)"})
         pin_temp = ""
         lenPin = 0
       }
     }

   }
 }
 this.setState({pin:pin_temp})
 this.RenderPin(lenPin)
}
RenderPin=(Length)=>{
 switch(Length) {
   case 1:
     this.setState({color1:"blue",color2:"rgba(230, 230, 230,1)",color3:"rgba(230, 230, 230,1)",color4:"rgba(230, 230, 230,1)"})
     break;
   case 2:
     this.setState({color1:"blue",color2:"blue",color3:"rgba(230, 230, 230,1)",color4:"rgba(230, 230, 230,1)"})
     break;
   case 3:
     this.setState({color1:"blue",color2:"blue",color3:"blue",color4:"rgba(230, 230, 230,1)"})
     break; 
   case 4:
     this.setState({color1:"blue",color2:"blue",color3:"blue",color4:"blue"})
     break;
   case 0:
     this.setState({color1:"rgba(230, 230, 230,1)",color2:"rgba(230, 230, 230,1)",color3:"rgba(230, 230, 230,1)",color4:"rgba(230, 230, 230,1)"})
     break
 }
}
render() {
  const {pin,color1,color2,color3,color4,PinType} = this.state
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.rect1}
        imageStyle={styles.rect1_imageStyle}
        source={require("../assets/images/Gradient_H3TONXWX.png")}
      >
        <View style={styles.rect2Stack}>
          <View style={styles.rect2}>
            <Text style={styles.enterPin}>{PinType}</Text>
            <View style={styles.rect3}>
              <View style={styles.rect4Row}>
                <View style={[styles.rect4,{backgroundColor:color1}]}></View>
                <View style={[styles.rect5,{backgroundColor:color2}]}></View>
                <View style={[styles.rect6,{backgroundColor:color3}]}></View>
                <View style={[styles.rect7,{backgroundColor:color4}]}></View>
              </View>
            </View>
          </View>
          <View style={styles.rect8}>
            <View style={styles.buttonStackRow}>
              <View style={styles.buttonStack}>
                <TouchableOpacity style={styles.button} onPress={()=>this.PinEntered("number","1")}>
                  <Text style={styles.loremIpsum}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button4} onPress={()=>this.PinEntered("number","4")}>
                  <Text style={styles.loremIpsum4}>4</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.button2Stack}>
                <TouchableOpacity style={styles.button2} onPress={()=>this.PinEntered("number","2")}>
                  <Text style={styles.loremIpsum1}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button5} onPress={()=>this.PinEntered("number","5")}>
                  <Text style={styles.loremIpsum5}>5</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.button3Stack}>
                <TouchableOpacity style={styles.button3} onPress={()=>this.PinEntered("number","3")}>
                  <Text style={styles.loremIpsum2}>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button6} onPress={()=>this.PinEntered("number","6")}>
                  <Text style={styles.loremIpsum3}>6</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.button7StackRow}>
              <View style={styles.button7Stack}>
                <TouchableOpacity style={styles.button7} onPress={()=>this.PinEntered("number","7")}>
                  <Text style={styles.loremIpsum7}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button10} onPress={()=>this.PinEntered("clear","")}>
                  
                  <Icon name="delete" style={styles.icon}></Icon>
                </TouchableOpacity>
              </View>
              <View style={styles.button8Stack}>
                <TouchableOpacity style={styles.button8} onPress={()=>this.PinEntered("number","8")}>
                  <Text style={styles.loremIpsum8}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button11} onPress={()=>this.PinEntered("number","0")}>
                  <Text style={styles.loremIpsum11}>0</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.button9Stack}>
                <TouchableOpacity style={styles.button9} onPress={()=>this.PinEntered("number","9")}>
                  <Text style={styles.loremIpsum6}>9</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button12} onPress={()=>this.PinEntered("number",".")}>
                  <Text style={styles.loremIpsum9}>.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  rect2: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 14
  },
  enterPin: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "10%",
   textAlign:"center",
   alignSelf:"center"
  },
  rect3: {
    width: "80%",
    height:"10%",
    backgroundColor: "rgba(255,255,255,1)",
    flexDirection: "row",
    marginTop: "10%",
    marginLeft:"2%",
    alignSelf:"center",
  },
  rect4: {
    width: 30,
    height: 30,
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 30,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 3,
      width: -3
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0
  },
  rect5: {
    width: 30,
    height: 30,
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 30,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 3,
      width: -1
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    marginLeft: 17
  },
  rect6: {
    width: 30,
    height: 30,
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 30,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 3,
      width: 1
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    marginLeft: 21
  },
  rect7: {
    width: 30,
    height: 30,
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 30,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    marginLeft: 24
  },
  rect4Row: {
    height: "90%",
    flexDirection: "row",
    flex: 1,
  },
  rect8: {
    top: "40%",
    width: "100%",
    height: "60%",
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 14,
    alignSelf:"center",
    justifyContent:"center"
  },
  button: {
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50
  },
  loremIpsum: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  button4: {
    top: "50%",
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50
  },
  loremIpsum4: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  buttonStack: {
    width: "33%",
    height: "100%"
  },
  button2: {
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
    
  },
  loremIpsum1: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  button5: {
    top: "50%",
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
  },
  loremIpsum5: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  button2Stack: {
    width: "33%",
    height: "100%"
  },
  button3: {
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
  },
  loremIpsum2: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  button6: {
    top: "50%",
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
  },
  loremIpsum3: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize:20,
    marginTop: "15%",
    textAlign:"center"
  },
  button3Stack: {
    width: "33%",
    height: "100%"
  },
  buttonStackRow: {
    height: "50%",
    flexDirection: "row"
  },
  button7: {
    
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
  },
  loremIpsum7: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  button10: {
    top: "50%",
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
  },
  x: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 30,
    marginTop: "15%",
    textAlign:"center"
  },
  icon: {
    color: "rgba(5,5,5,1)",
    fontSize: 20,
    height: 20,
    width: 20,
    alignSelf:"center",
    justifyContent:"center",
    marginTop: "30%",
  },
  button7Stack: {
    width: "33%",
    height: "100%"
  },
  button8: {
    
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
  },
  loremIpsum8: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  button11: {
    top: "50%",
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
  },
  loremIpsum11: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  button8Stack: {
    width: "33%",
    height: "100%"
  },
  button9: {
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
  },
  loremIpsum6: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
    marginTop: "15%",
    textAlign:"center"
  },
  button12: {
    top: "50%",
    left: 0,
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "rgba(200, 200, 230,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius:50,
  },
  loremIpsum9: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 20,
   
    textAlign:"center"
  },
  button9Stack: {
    width: "33%",
    height: "100%"
  },
  button7StackRow: {
    height: "50%",
    flexDirection: "row"
  },
  rect2Stack: {
    width: "60%",
    height: "50%",
    marginTop: "50%",
    alignSelf:"center",
    justifyContent:"center",
    padding:"3%"
  }
});

export default PINCODE;
