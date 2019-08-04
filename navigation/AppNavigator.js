// import React from 'react';
// import { createAppContainer, createSwitchNavigator } from 'react-navigation';

// import Screens from './Screens';
// import Auth from './Auth';

// // Loading screen

// export default createAppContainer(createSwitchNavigator({
//   // You could add another route here for authentication.
//   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//   Auth,
//   Main: Screens,
// }));

import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import {fromLeft , fromTop} from 'react-navigation-transitions';
import  {createSwitchNavigator,createStackNavigator,createAppContainer,createDrawerNavigator,createBottomTabNavigator} from 'react-navigation';
import LoginScreen from '../screens/Login';
import Home from '../screens/Overview';
import Icon from 'react-native-vector-icons/AntDesign';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import StartAttendance from '../screens/StartAttendance';
import ViewStudents from '../screens/ViewStudents';

let AppScenes = {
   Login : {
     screen : LoginScreen
   }
 
 }
 const AuthStackNavigator = createStackNavigator(AppScenes);
 const AppTabNavigator = createBottomTabNavigator(
  {
    // Home: HomeScreen,
    Home: Home,

    

  },
  {
    transitionConfig: () => fromLeft(300),
    navigationOptions: ({ navigation }) => ({
      
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `infocirlce${focused ? '' : 'o'}`;
        } 
       
         
       
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
    }),
    lazy:false,
    tabBarOptions: {
      activeTintColor: '#413661',
      inactiveTintColor: 'gray',
    },
    
  });
 const AppStackNavigator = createStackNavigator({
  AppTabNavigator:{
    screen:AppTabNavigator,
    
    transitionConfig: () => fromLeft(300),
    
    navigationOptions:({ navigation }) =>({
      title : 'Look and Attend',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#413661'
      },
      // headerRight: (
      //   <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
      //   <View style={{paddingHorizontal : 10 }}>
      //     <Icon name="" size={25} color={'#ffffff'}/>
      //   </View>
      // </TouchableOpacity> 
      // ),
      headerLeft : (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{paddingHorizontal : 10 }}>
            <Icon name="bars" size={25} color={'#ffffff'}/>
          </View>
        </TouchableOpacity> 
      )
      ,
    })
    ,
  },
  StartAttendance:StartAttendance,
  ViewStudents:ViewStudents


},{
  transitionConfig: () => fromLeft(300),
});
 const AppDrawerNavigator = createDrawerNavigator({
  Home : AppStackNavigator
})
 export default createAppContainer(createSwitchNavigator({
  AuthLoading : AuthLoadingScreen,
  Auth : AuthStackNavigator,
  App: AppDrawerNavigator

})); 

