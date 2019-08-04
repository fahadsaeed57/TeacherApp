import React, { Component } from 'react';
import { View ,ActivityIndicator,Dimensions,TextInput,Platform,KeyboardAvoidingView} from 'react-native';
import { Container, Header, Left, Body, Right, Icon, Title, Button,Segment, Picker, Text } from 'native-base';
import axios from 'axios';
import {Block,Input,Button as Button2,Text as Text2} from '../components'
import {Location,Permissions,Constants} from 'expo';
import {baseUrl} from '../ApiUrl';
import Spinner from 'react-native-loading-spinner-overlay';
const { width,height } = Dimensions.get('window');

export default class StartAttendance extends Component {
    static navigationOptions={
        title:'Start Attendance'
    }
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
        selectedDepartment : 0,
        loading:true,
        disableDepartment:false,
        selectedProgram:0,
        programs:null,
        batches:null,
        selectedBatch:0,
        selectedSection:0,
        sections:null,
        courses:null,
        selectedCourse:0,
        location:null,
        spinner:false,
        distance:null,
        teacher_id:Number(navigation.getParam('teacher_id','No-Id'))

    };
  }
  componentWillMount = async()=> {
    const { status } =await Permissions.askAsync(Permissions.CAMERA);

    this.setState({hasCameraPermission:status==='granted'});
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  componentDidMount(){
    this.setState({loading:true})
    axios.post(`${baseUrl}/teacher/departments`, {
        teacher_id:this.state.teacher_id
    }).then(res => {
      const data=res.data
      this.setState({departments:data.departments,disableDepartment:true,loading:false})
      }).catch((error)=>{
          alert(error)
          this.setState({ loading : false })
      });
  }
  _getLocationAsync = async () => {
    let providerStatus = await Location.getProviderStatusAsync();
    if (!providerStatus.locationServicesEnabled) {
      this.setState({
          errorMessage: 'Location Services Disabled'
      })
      return;
    }

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      return
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    console.log(this.state.location)
  };

  mapDepartments(){
      let departments;
      departments = this.state.departments.map((department,itemIndex)=>{
          return  <Picker.Item key={itemIndex.toString()} label={department.department_name} value={department.id} />
      })
      return departments;
  }
 
  requestForPrograms(department_id){
    // this.setState({loading:true})
    this.setState({spinner:true})
    axios.post(`${baseUrl}/teacher/programs`, {
        teacher_id:this.state.teacher_id,
        department_id:department_id
    }).then(res => {
      const data=res.data
      this.setState({programs:data.programs,disableDepartment:true,spinner:false})
      }).catch((error)=>{
          alert(error)
          this.setState({ spinner : false })
      });
  }
  requestForBatch(department_id,program_id){
    this.setState({spinner:true})
    axios.post(`${baseUrl}/teacher/batches`, {
        teacher_id:this.state.teacher_id,
        department_id:department_id,
        program_id:program_id
    }).then(res => {
      const data=res.data
      console.log(data);
      this.setState({batches:data.batches,disableDepartment:true,spinner:false})
      }).catch((error)=>{
          alert(error)
          this.setState({ spinner : false })
      });
  }
  requestForSection(department_id,program_id,batch_id){
    this.setState({spinner:true})
    axios.post(`${baseUrl}/teacher/sections`, {
        teacher_id:this.state.teacher_id,
        department_id:department_id,
        program_id:program_id,
        batch_id:batch_id
    }).then(res => {
      const data=res.data
      console.log(data);
      this.setState({sections:data.sections,disableDepartment:true,spinner:false})
      }).catch((error)=>{
          alert(error)
          this.setState({ spinner : false })
      });
  }
  requestForCourse(department_id,program_id,batch_id,section_id){
      this.setState({spinner:true})
    axios.post(`${baseUrl}/teacher/courses`, {
        teacher_id:this.state.teacher_id,
        department_id:department_id,
        program_id:program_id,
        batch_id:batch_id,
        section_id:section_id
    }).then(res => {
      const data=res.data
      console.log(data);
      this.setState({courses:data.courses,disableDepartment:true,spinner:false})
      }).catch((error)=>{
          alert(error)
          this.setState({ spinner : false })
      });

  }

  generateDepartments(){
      return(
        <Picker
    
        selectedValue={this.state.selectedDepartment}
        style={{ height: 50, width: width / 2, color: 'blue' }}
        onValueChange={(itemValue, itemIndex) =>
            {
                this.setState({ selectedDepartment: itemValue })
                this.requestForPrograms(itemValue);

        
        
        }

        }>
        <Picker.Item label="select department" disabled={this.state.disableDepartment} value={0} />
        {this.mapDepartments()}
        
    </Picker>
      )
  }

  generatePrograms(){
    let programs;
    programs = this.state.programs ? this.state.programs.map((program,itemIndex)=>{
        return  <Picker.Item key={itemIndex.toString()}label={program.program_name} value={program.id} />
    }) : <Picker.Item key={0} label="select program" value={0} />
    return(
      <Picker
  
      selectedValue={this.state.selectedProgram}
      style={{ height: 50, width: width / 2, color: 'blue' }}
      onValueChange={(itemValue, itemIndex) =>
          {
              this.setState({ selectedProgram: itemValue })
              this.requestForBatch(this.state.selectedDepartment,itemValue)
           

      
      
      }

      }>
  
      {programs}
      
      
  </Picker>
    )
}
generateBatches(){
    let batches;
    batches = this.state.batches ? this.state.batches.map((batch,itemIndex)=>{
        return  <Picker.Item key={itemIndex.toString()}label={batch.batch_name} value={batch.id} />
    }) : <Picker.Item key={0} label="select batch" value={0} />
    return(
      <Picker
  
      selectedValue={this.state.selectedBatch}
      style={{ height: 50, width: width / 2, color: 'blue' }}
      onValueChange={(itemValue, itemIndex) =>
          {
              this.setState({ selectedBatch: itemValue })
              this.requestForSection(this.state.selectedDepartment,this.state.selectedProgram,itemValue)
           

      
      
      }

      }>
  
      {batches}
      
      
  </Picker>
    )
}
generateSections(){
    let sections;
    sections = this.state.sections ? this.state.sections.map((section,itemIndex)=>{
        return  <Picker.Item key={itemIndex.toString()}label={section.section_name} value={section.id} />
    }) : <Picker.Item key={0} label="select section" value={0} />
    return(
      <Picker
  
      selectedValue={this.state.selectedSection}
      style={{ height: 50, width: width / 2, color: 'blue' }}
      onValueChange={(itemValue, itemIndex) =>
          {
              this.setState({ selectedSection: itemValue })
            this.requestForCourse(this.state.selectedDepartment,this.state.selectedProgram,this.state.selectedBatch,itemValue)
           

      
      
      }

      }>
  
      {sections}
      
      
  </Picker>
    )
}
generateCourses(){
    let courses;
    courses = this.state.courses ? this.state.courses.map((course,itemIndex)=>{
        return  <Picker.Item key={itemIndex.toString()}label={course.course_name} value={course.id} />
    }) : <Picker.Item key={0} label="select course" value={0} />
    return(
      <Picker
  
      selectedValue={this.state.selectedCourse}
      style={{ height: 50, width: width / 2, color: 'blue' }}
      onValueChange={(itemValue, itemIndex) =>
          {
              this.setState({ selectedCourse: itemValue })
            
           

      
      
      }

      }>
  
      {courses}
      
      
  </Picker>
    )
}

startAttendance(){
    var datatopost;
    if(this.state.selectedCourse!=0 && this.state.distance!=null && this.state.location!=null){
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth()+1
        var year = d.getFullYear()
        datatopost = {
            teacher_id : this.state.teacher_id,
            program_id : this.state.selectedProgram,
            section_id: this.state.selectedSection,
            batch_id : this.state.selectedBatch,
            course_id : this.state.selectedCourse,
            attendance_date:year+"-"+month+"-"+day,
            attendance_time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
            latitude : this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            distance:Number(this.state.distance)

            
        }
        this.setState({spinner:true})
        axios.post(`${baseUrl}/teacher/startattendance`, datatopost).then(res => {
          const data=res.data
          
          const nextScreenData = {
              attendance_id:data.attendance_id,
              course_name:data.course[0].course_name,
              date:year+"-"+month+"-"+day
          }

          this.props.navigation.navigate('ViewStudents',{
              data:nextScreenData
          })
        this.setState({spinner:false})
          }).catch((error)=>{
              alert(error)
              this.setState({ spinner : false })
          });
        // console.log(datatopost)  
    }
    else{
        alert("You have not entered all credtentials or haven't turned on your location")
    }
}
  
  render() {
  
    if(this.state.loading==false){
        return (
            <KeyboardAvoidingView
            enabled
            behavior="padding"
            style={{ flex: 1,margin:10 }}
            keyboardVerticalOffset={height * 0.5}
          >
             <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{ color: '#FFF'}}
        />
        <Block center style={{ marginTop: 10 }}>

             <Button small bordered>
                                  <Text primary> Department </Text>
                                  {this.generateDepartments()}
                                 
                              </Button>
                              <Text> {"\n"}</Text>
                              <Button small bordered>
                                  <Text primary>Program </Text>
                                  {this.generatePrograms()}
                                 
                                 
                              </Button>
                              <Text> {"\n"}</Text>
                              <Button small bordered>
                                  <Text primary>Batch </Text>
                                  {this.generateBatches()}
                                 
                              </Button>

                               <Text> {"\n"}</Text>
                                 
                              <Button small bordered>
                                  <Text primary>Section </Text>
                                  {this.generateSections()}
                                 
                                 
                              </Button>
                              <Text> {"\n"}</Text>
                              <Button small bordered>
                                  <Text primary>Course </Text>
                                  {this.generateCourses()}
                                  
                                 
                              </Button>
                              <Text> {"\n"}</Text>
                             
                                 
              <Input
                full
               
                label="Distance Parameter"
                style={{ marginBottom: 25 }}
                onChangeText={(distance)=>{this.setState({distance})}}
                value={this.state.distance}
                placeholder={"Enter distance parameter in meters e.g 100"}
                keyboardType={'numeric'}
              />
              

              <Button2
                full
                style={{ marginBottom: 12 }}
                onPress={() => {this.startAttendance()}}
              >
                <Text2 button>Start Attendance</Text2>
              </Button2>
              
            </Block>
            </KeyboardAvoidingView>
          );
    }
    else{
        return(
            <View style={{justifyContent:'center',flex:1,alignItems:'center'}}>
              <ActivityIndicator size="large" color="#0000ff" />
     
            </View>)
    }
    
  }
}
