import React, { Component } from 'react';
import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet,AsyncStorage ,ActivityIndicator,ToastAndroid,RefreshControl} from 'react-native';

import { Block, Card, Text, Icon, Label } from '../components';
import * as theme from '../constants/theme';
import {baseUrl} from '../ApiUrl';
import axios from 'axios';


const styles = StyleSheet.create({
  overview: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
  },
  margin: {
    marginHorizontal: 25,
  },
  driver: {
    marginBottom: 11,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  }
});

class Overview extends Component {
  static navigationOptions = {
    headerLeftContainerStyle: {
      paddingLeft: 24
    },
    headerRightContainerStyle: {
      paddingRight: 24
    },
    headerLeft: (
      <TouchableOpacity><Icon menu /></TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity><Icon notification /></TouchableOpacity>
    ),
    headerTitle: (
      <Block row middle><Text h4>Home</Text></Block>
    )
  }
  state={
    teacher:"",
    unsavedAttendane:null,
    loading:false
  }

  componentWillMount(){
    // this.subs = [
    //     this.props.navigation.addListener('didFocus', this._retrieveData),
        
    //   ];
       this._retrieveData();
     
}

getUnSavedAttendances(){

  this.setState({loading:true})
  axios.get(`${baseUrl}/teacher/unsavedattendance?id=${this.state.teacher.id}`).then(res => {
    const data=res.data
    if(data.message=="1"){
      console.log(data);
      this.setState({attendances:data.attendances,loading:false})
    }
    else{
      this.setState({loading:false,attendances:null})
      ToastAndroid.show('No UnSaved Attendance Found', ToastAndroid.SHORT);
    }
    
    }).catch((error)=>{
        alert(error)
        this.setState({ loading : false })
    });

}

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      this.setState({teacher:JSON.parse(value)},()=>{
        this.getUnSavedAttendances()
      });
      console.log(this.state.teacher);
      
     } catch (error) {
       alert(error);
     }
  } 
  signOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')
}
gotoStartAttendance = ()=>{
  this.props.navigation.navigate('StartAttendance',{
    teacher_id:this.state.teacher.id
  })
}
goToViewAttendances(attendance_id,course_name,date){
  const nextScreenData = {
    attendance_id:Number(attendance_id),
    course_name:course_name,
    date:date
}
this.props.navigation.navigate('ViewStudents',{
  data:nextScreenData
})
}
generateAttendanceList(){
  let Attendances;
  Attendances = this.state.attendances ? this.state.attendances.map((attendance,index) => {
    return (
    
        <Block key={index.toString()} style={styles.driver}>
          <TouchableOpacity  onPress={()=>{this.goToViewAttendances(attendance.attendance_id,attendance.course_name,attendance.attendance_date.split("T")[0])}} activeOpacity={0.8}>
            <Block row center>
              
              <Block flex={3}>
                <Text h4> {attendance.course_name}</Text>
                <Text paragraph color="gray">{ attendance.attendance_date.split("T")[0]}</Text>
              </Block>
            
            </Block>
          </TouchableOpacity>
        </Block>
    
      
     
       
  
      )
}):( <ActivityIndicator size="large" color="#0000ff" />)

return Attendances;
  
}

  render() {
    return (
      <SafeAreaView style={styles.overview}>
        <ScrollView  refreshControl={
            <RefreshControl
              onRefresh={()=>this.getUnSavedAttendances()}
              refreshing={this.state.loading}
              colors={['#6FB9F7', '#000000']}
            />
          } contentContainerStyle={{ paddingVertical: 25 }}>
          <Card row middle style={styles.margin}>
            <Block  center middle style={{ marginRight: 20 }}>
              <Text light height={43} size={36} spacing={-0.45}>{this.state.teacher.teacher_name}</Text>
             
            </Block>
            {/* <Block>
              <Text paragraph color="black3">
                All cars are operating well.
                There were 1,233 trips since your last login.
              </Text>
            </Block> */}
          </Card>
          
          <Block row style={[styles.margin, { marginTop: 18 }]}>
          <TouchableOpacity activeOpacity={0.8} onPress={()=>this.gotoStartAttendance()}>
            <Card middle style={{ marginRight: 7 }}>
              <Icon vehicle />
              <Text h5 style={{ marginTop: 17 }}>Start Attendance</Text>
              {/* <Text paragraph color="gray">Vehicles on track</Text> */}
            </Card>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={()=>this.signOut()}>
            <Card middle style={{ marginLeft: 7 }}>
              <Icon distance />
              <Text h5 style={{ marginTop: 17 }}>Logout</Text>
              
            </Card>
            </TouchableOpacity>
          </Block>
         

          {/* <Card
            title="TODAY'S TRIPS"
            style={[styles.margin, { marginTop: 18 }]}
          >
            <Block row right>
              <Block flex={2} row center right>
                <Label blue />
                <Text paragraph color="gray">Today</Text>
              </Block>
              <Block row center right>
                <Label purple />
                <Text paragraph color="gray">Yesterday</Text>
              </Block>
            </Block>
            <Block>
              <Text>Chart</Text>
            </Block>
          </Card> */}

          <Card
            title="Un Saved Attendance"
            style={[styles.margin, { marginTop: 18 }]}
          >
            {this.generateAttendanceList()}
         
           
          </Card>


         
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Overview;