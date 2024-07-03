// AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Home';
import TrnxScreen from '../TrnxScreen';
const HomeStake = createStackNavigator();

class HomeNavigator extends React.Component {
  constructor(props){
    super(props);
    this.IsCreated = this.IsCreated.bind(this)
    console.log(",===,,",this.props.route.params)
  }
  IsCreated = () => {
    this.props.params.Created()
   
   }
  render() {
    return (
        
            <HomeStake.Navigator>
              <HomeStake.Screen name="main" component={Home}  options={{ headerShown: false}} initialParams={{Addresses:this.props.route.params.Addresses,walletNum:this.props.route.params.walletNum}}/>
              <HomeStake.Screen name="TrnxScreen" component={TrnxScreen} options={{headerTransparent:'0',headerShown:false}} initialParams={{LayerTwPrivKey:this.props.route.params.LayerTwPrivKey,Addresses:this.props.route.params.Addresses,keyST:this.props.route.params.keyST,hdN:this.props.route.params.hdN,path:this.props.route.params.path}}/>
             
            </HomeStake.Navigator>    
          
    );
  }
}

export default HomeNavigator;
