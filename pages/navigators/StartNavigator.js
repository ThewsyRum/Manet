// AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from '../StartScreen';
import CreateWallet from '../CreateWallet';
import RestoreWallet from '../RestoreWallet';
const StartUPStake = createStackNavigator();

class StartNavigator extends React.Component {
  constructor(props){
    super(props);
    this.IsCreated = this.IsCreated.bind(this)
    console.log(",==,",this.props.params)
  }
  IsCreated = (mnemo) => {
    this.props.params.Created(mnemo)
   
   }
  render() {
    return (
        
            <StartUPStake.Navigator>
              <StartUPStake.Screen name="main" component={StartScreen}  options={{ headerShown: false}}/>
              <StartUPStake.Screen name="CreateWallet" component={CreateWallet} options={{headerTransparent:'0'}} initialParams={{isCreateD:this.IsCreated}}/>
              <StartUPStake.Screen name="RestoreWallet" component={RestoreWallet} options={{headerTransparent:'100%'}} initialParams={{isCreateD:this.IsCreated}}/>
            </StartUPStake.Navigator>    
          
    );
  }
}

export default StartNavigator;
