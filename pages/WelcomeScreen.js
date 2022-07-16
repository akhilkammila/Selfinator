import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function WelcomeScreen(props) {
    const handlePress = ()=>{
        props.navigation.navigate('Cam_Page')
    }
    
    return (
        <View style={styles.container}>
            <Text style={{color: "#ff6f26", fontSize: 100, fontFamily:"PartyLetPlain"}}>
                Smart Cam
            </Text>
            <Image source={require('./assets/camera200.png')} width="200" height="200"/>
            <Text style={{color: "#fff", fontSize: 35, fontFamily: "PingFangTC-Semibold", margin: 30}}
            onPress = {handlePress}>
                Start Now!
            </Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#2f2f2f",
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default WelcomeScreen;