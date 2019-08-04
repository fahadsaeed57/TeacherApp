import React , {Component} from 'react';
import {View,Text,StyleSheet,AsyncStorage,ActivityIndicator,StatusBar,Dimensions,Image,Animated,ToastAndroid,Platform} from 'react-native';
import { LinearGradient } from 'expo';

export default class AuthLoadingScreen extends Component{
    static navigationOptions = {
        header : null
    }
    constructor(props){
        super(props)
      
        // this._isMounted = false;
    }

    componentWillMount(){
        
        this._isMounted = false;
        this.animatedValue = new Animated.Value(0.5);
        this.animatedValue2 = new Animated.Value(0);
    }
    componentDidMount(){
        setTimeout(()=>this.loadApp(),3000);
        this._isMounted = true;
        Animated.spring(this.animatedValue, {
            toValue: 1,
            friction: 4,
            delay: 1000,
           useNativeDriver: true,
          }).start();
      
          Animated.timing(this.animatedValue2, {
            toValue: 1,
            delay: 0,
            duration: 3000,
           useNativeDriver: true,
          }).start();
    }
    componentWillUnmount(){
        this.isCancelled = true;
    }
    loadApp = async() =>{
        const userToken =  await AsyncStorage.getItem("userData");
        this.props.navigation.navigate(userToken ? 'App' : 'Auth')
    }
    render(){
        const truckStyle = {
            transform: [{ scale: this.animatedValue }]
          };
      
      const scaleText = {
            transform: [{ scale: this.animatedValue2 }]
          };
        return(
            <LinearGradient
                colors={['#413661', '#413661']} style={styles.container}>
               <Animated.View style={[truckStyle]}>
          <Animated.Image
            source={require("../assets/images/Base/Logo.png")}
            style={[
              {
                resizeMode: "contain",
                width: 100,
                height: 100
              }
            ]}
          />
</Animated.View>

<Animated.View
     style={[
            {
              position: "absolute",
              bottom: 20,
              width: Dimensions.get('window').width / 2,
              height: 4,
              backgroundColor: "#fff",
              borderRadius: 2
            },
            scaleText
        ]}
/>
            </LinearGradient>
            
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex :1,
        alignItems:'center',
        justifyContent : 'center',
        backgroundColor:'#413661'
    }

})