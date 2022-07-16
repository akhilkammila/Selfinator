import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import WelcomeScreen from './pages/WelcomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraPage from './pages/CameraPage';

const Stack = createStackNavigator()

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Home_Screen"
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Cam_Page"
          component={CameraPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}



