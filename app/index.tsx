
import React, { Component } from 'react'
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { View,ViewStyle  } from 'react-native';
import { Image } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import { Link,Navigator } from 'expo-router';
import CircularProgress from 'react-native-circular-progress-indicator';


export class index extends Component {
  render() {
    return (
      <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
        <View style={{alignItems:"center",justifyContent:"center"}}>
            <Text variant='headlineLarge' style={{fontWeight:'bold',textAlign:"center", color:"#75A47F"}}>
              TO DO APP
            </Text>
            <Text variant='bodyMedium' style={{fontWeight:"bold",color:"#35374B"}}>
              Manage your day
            </Text>
          </View>
        <View style={{marginVertical:10}}>
          <View style={{alignItems:"center",justifyContent:"center",marginBottom:10}}>
          <Link href={"/register"} >
          <Button
            style={{backgroundColor:"#55AD9B",borderColor:"white"}}>
            <Text variant="bodyLarge" style={{color:"#fff",fontWeight:900}}>
                Getting Start
            </Text>
          </Button>
          </Link>
          </View>
          <Text>
            Are you have Account ? {''}
            <Link href={'/login'} style={{color:"#55AD9B",fontWeight:800}}>
            Login
            </Link>
          </Text>
        </View>
      </View>
    )
  }
}

export default index