import React, { Component } from 'react';
import { View,TouchableOpacity,Image,ScrollView,RefreshControl,StyleSheet,Dimensions,ActivityIndicator } from 'react-native';
const { width,height } = Dimensions.get('window');
import axios from 'axios';
import {Card,Block,Text ,Icon} from '../components/index'
import * as theme from '../constants/theme';
import Modal from 'react-native-modal';
import {baseUrl} from '../ApiUrl';
import Spinner from 'react-native-loading-spinner-overlay';


export default class ViewStudents extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.getParam('data','No-Id').course_name}`,
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#6FB9F7'
        },
        headerRight: (
            // <Button
            //   onPress={() => alert('This is a button!')}
            //   title={`${navigation.getParam('data','No-Id').date}`}
            //   color="#6FB9F7"
            // />
            <TouchableOpacity style={{backgroundColor:'#6FB9F7',color:'white',flexDirection:'column'}}>
                <Text style={{color:'white',fontSize:15}}>{`${navigation.getParam('data','No-Id').date}`} </Text>
               
            </TouchableOpacity>
          )
    });
  constructor(props) {
    super(props);
    this.state = {
        loading:true,
        spinner:false,
        students:null,
        modelVisible:false
    };
  }
  componentWillMount(){
      this.getStudents();
  }

  getStudents(){
    let attendance_id = Number(this.props.navigation.getParam('data','No-Id').attendance_id)
    this.setState({loading:true})
    axios.get(`${baseUrl}/teacher/getattendance?id=${attendance_id}`).then(res => {
      const data=res.data
      console.log(data);
      this.setState({students:data.students,loading:false})
      }).catch((error)=>{
          alert(error)
          this.setState({ loading : false })
      });
  }
 markAttendance(student_id){
    let attendance_id = Number(this.props.navigation.getParam('data','No-Id').attendance_id)
    const data2post = {
        student_id : student_id,
        attendance_id : attendance_id
    }
    this.setState({spinner:true})
    axios.post(`${baseUrl}/teacher/markattendance`,data2post).then(res => {
      const data=res.data
      console.log(data);
      this.getStudents();
      this.setState({spinner:false})
      }).catch((error)=>{
          alert(error)
          this.setState({ spinner : false })
      });


  }
  stopAttendance(){
    let attendance_id = Number(this.props.navigation.getParam('data','No-Id').attendance_id)
    const data2post = {
        attendance_id : attendance_id
    }
    this.setState({loading:true})
    axios.post(`${baseUrl}/teacher/closeattendance`,data2post).then(res => {
      const data=res.data
      console.log(data);
     this.props.navigation.navigate('Home')
      this.setState({loading:false})
      }).catch((error)=>{
          alert(error)
          this.setState({ loading : false })
      });


  }
  

  renderSeparator = () => {  
    return (  
        <View  
            style={{  
                height: 1,  
                width: "100%",  
                backgroundColor: "#000",  
            }}  
        />  
    );  
}; 
_renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => {
      const {navigation} = this.props;
      let attendance_id = Number(navigation.getParam('data','No-Id').attendance_id)

    return (
        <View style={styles.modalContent}>
        <Text>Attendance QRCode</Text>
        {/* <QRCode
          value={'http://facebook.github.io/react-native/'}
          size={200}
          bgColor='white'

          fgColor='purple'/> */}
          <Image style={{width:200,height:200}}source={{uri:`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${attendance_id}`}} />
        {this._renderButton('Close', () => this.setState({ modelVisible: false }))}
      </View>
    )
  }

  generateStudentList(){
      let Students;
      Students = this.state.students ? this.state.students.map((student,index) => {
        return (
        
            <Block key={index.toString()} style={styles.driver}>
              <TouchableOpacity activeOpacity={0.8}>
                <Block row center>
                  {/* <Block>
                    <Image
                      style={styles.avatar}
                      source={{ uri: 'https://images.unsplash.com/photo-1506244856291-8910ea843e81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80' }}
                    />
                  </Block> */}
                  <Block flex={3}>
                    <Text h4> {student.student_name}</Text>
                    <Text paragraph color="gray">{student.roll_num}</Text>
                  </Block>
                  {student.isPresent?<TouchableOpacity onPress={()=>{this.markAttendance(student.id)}} activeOpacity={0.8}>
                  <Block flex={1}>
    
                  <Image
                      style={styles.avatar}
                      source={{ uri: 'https://cdn3.iconfinder.com/data/icons/simple-web-navigation/165/cross-512.png' }}
                    />
                   
                  </Block>
                  </TouchableOpacity>:<TouchableOpacity onPress={()=>{this.markAttendance(student.id)}} activeOpacity={0.8}><Block flex={1}>
    
    <Image
        style={styles.avatar}
        source={{ uri: 'https://www.searchpng.com/wp-content/uploads/2018/12/Blue-tick-png-715x682.png' }}
      />
     
    </Block></TouchableOpacity> }
                </Block>
              </TouchableOpacity>
            </Block>
        
          
         
           
      
          )
    }):( <ActivityIndicator size="large" color="#0000ff" />)

    return Students;
      
  }
   
  

  render() {
      const {navigation}= this.props;
      let attendance_id = Number(navigation.getParam('data','No-Id').attendance_id)
    return (
      <View style={{flex:1}}>
      <ScrollView refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={()=>{this.getStudents()}}
              colors={['#6FB9F7', '#000000']}
            />
          }>
           <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{ color: '#FFF'}}
        />
           <Block row middle style={[styles.margin, { marginTop: 18 }]}>
          <TouchableOpacity activeOpacity={0.8}  onPress={()=>{this.setState({modelVisible:true})}}>
            <Card middle style={{ marginRight: 7 }}>
            <Image style={{width:50,height:50}}source={{uri:`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${attendance_id}`}} />
              <Text h5 style={{ marginTop: 17 }}>Show QRcode</Text>
              {/* <Text paragraph color="gray">Vehicles on track</Text> */}
            </Card>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{this.stopAttendance()}}>
            <Card middle style={{ marginLeft: 7 }}>
              <Icon distance />
              <Text h5 style={{ marginTop: 17 }}>Stop Attendance</Text>
              
            </Card>
            </TouchableOpacity>
            </Block>
            <Card
        title="All Students"
        style={[styles.margin, { marginTop: 18 }]}
      >
            {this.generateStudentList()}
            </Card>
            {/* <FlatList                    
                    data={this.state.students}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item, index }) => {
                        return (
                            
                          <Text style={{color:'black'}} key={index.toString()}> {item.student_name}</Text> 
                          
                          );
                    }}     
                    keyExtractor={(item, index) => index.toString()}
                                   
                >
                </FlatList> */}
            
        
          {/* <Text> {JSON.stringify(this.state.students)}</Text> */}
    </ScrollView>
    <Modal isVisible={this.state.modelVisible} style={styles.bottomModal}>
          {this._renderModalContent()}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: 'lightblue',
      padding: 12,
      margin: 16,
      justifyContent: 'center',

      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    overview: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: theme.colors.white,
      },
      margin: {
        marginHorizontal: 5,
      },
      driver: {
        marginBottom: 11,
      },
      avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
      },
  });