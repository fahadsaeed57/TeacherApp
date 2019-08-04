import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, Dimensions,Alert,AsyncStorage,Keyboard } from 'react-native';

import { Button, Block, Text, Input } from '../components';
import Spinner from 'react-native-loading-spinner-overlay';
import { baseUrl } from '../ApiUrl';
import axios from 'axios';

const { height } = Dimensions.get('window');

class Login extends Component {

  constructor(props){
    super(props)
  }
  state = {
    email:"",
    password:""
  }
  loginTeacher(){
    Keyboard.dismiss();
         const datatopost = {
                email:this.state.email,
                password:this.state.password
            
            }
            if(this.state.email!="" && this.state.password!=""){
                this.setState({loading:true});
                axios.post(`${baseUrl}/teacher/login`,datatopost).then(res => {
                    const data = res.data.teacher;
                    if(data!=null){
                        this.setState({teacher: data[0] , loading:false});
                        // alert(JSON.stringify(data[0]));
                        
                     
                            try {
                            AsyncStorage.setItem('userData', JSON.stringify(data[0]));
                            this.props.navigation.navigate('App');
                         } catch (error) {
                           // Error saving data
                       
                        }
                        
                        
                       
                    }
                    else{
                        this.setState({loading:false},Alert.alert(" Error ","Incorrect password or emaill"));
                        
                    }
                   
                    
                }).catch(error => {
                   this.setState({ loading: false })
                    Alert.alert(" Error ","Some Thing went wrong please check your internet connection")
                    
                  })
            }
            else{
                Alert.alert(" Error ","Fill Empty Details");
            }
           
  }
  render() {
    const { navigation } = this.props;

    return (
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={height * 0.5}
      >
       <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={{ color: '#FFF'}}
        />
        <Block center middle>
          <Block middle>
            <Image
              source={require('../assets/images/Base/Logo.png')}
              style={{ height: 100, width: 100 }}
            />
          </Block>
          <Block flex={2.5} center>
            <Text h4 style={{ marginBottom: 6 }}>
              Sign in to Look and Attend - Teacher
            </Text>
            <Text paragraph color="black3">
              Please enter your credentials to proceed.
            </Text>
            <Block center style={{ marginTop: 44 }}>
              <Input
                full
                email
                label="Email address"
                style={{ marginBottom: 25 }}
                onChangeText={(email)=>{this.setState({email})}}
              />
              <Input
                full
                password
                label="Password"
                style={{ marginBottom: 25 }}
                onChangeText={(password)=>{this.setState({password})}}
                
              />

              <Button
                full
                style={{ marginBottom: 12 }}
                onPress={() => {this.loginTeacher()}}
              >
                <Text button>Sign in</Text>
              </Button>
              
            </Block>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

export default Login;