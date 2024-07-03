import { StyleSheet, Text, View, Image } from "react-native";
import { useColorScheme } from 'react-native';
import colors from "../config/colors";
import colordark from "../config/colordark";
import dimensions from "../config/dimensions";
import { CYPTO_ICON } from "./iconuri";

const WalletMini = (props) =>{
    let textProp = props.text;
    console.log("-____-")
    const scheme = useColorScheme();
    let icon = '../icons/'+(props.icon)
   // console.log(CYPTO_ICON.bitcoin.uri)
   const walletSty = StyleSheet.create({
    wallet: {
        flexDirection:'row',
        justifyContent:"space-around",
        padding:6,
        alignItems:'center',
        borderRadius:20,
        height:"100%"

    }
})
    return ( 
        <View style={walletSty.wallet}>
            <Image 
                source={props.icon} 
                style={{width:'10%',height:'10%',padding:'6%'}}
                />

            <Text style={{flex:2, paddingLeft:'10%',color:"black"}}>{textProp}</Text>
            <Text style={{flex:1}}>{''}</Text>
        </View>
    )
}

export default WalletMini