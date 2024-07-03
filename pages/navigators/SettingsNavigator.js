// AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from '../Settings';
import Walletxs from '../Wallets';
import Tokens from '../Tokens';
import Mnemonics from '../mnemonics';
const HomeStake = createStackNavigator();

class SettingNavigator extends React.Component {
  constructor(props){
    super(props);
    this.IsCreated = this.IsCreated.bind(this)
    console.log(",-===",this.props.route.params)
  }
  IsCreated = () => {
    this.props.params.Created()
   
   }
  render() {
    return (
        
            <HomeStake.Navigator>
              <HomeStake.Screen name="main" component={Settings}  options={{ headerShown: false}}/>
              <HomeStake.Screen name="Wallets" component={Walletxs} options={{headerTransparent:'0',headerShown:false}} initialParams={{isCreateD:this.IsCreated,CallWall:this.props.route.params.callWalletData}}/>
              <HomeStake.Screen name="Tokens" component={Tokens} options={{headerTransparent:'0',headerShown:false}} initialParams={{isCreateD:this.IsCreated}}/>
              <HomeStake.Screen name="Mnemonics" component={Mnemonics} options={{headerTransparent:'0',headerShown:false}} initialParams={{isCreateD:this.IsCreated}}/>
            </HomeStake.Navigator>    
          
    );
  }
}

export default SettingNavigator;
