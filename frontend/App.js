import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PlayerDashboard from './screens/PlayerDashboard';
import ProfileEditor from './screens/ProfileEditor'; // ADD THIS IMPORT
import { PaperProvider } from 'react-native-paper';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ 
              title: 'Create Account',
              headerStyle: { backgroundColor: '#0A1F44' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="Dashboard" 
            component={PlayerDashboard}
            options={{ 
              title: 'My Dashboard',
              headerStyle: { backgroundColor: '#0A1F44' },
              headerTintColor: '#fff',
              headerLeft: null
            }}
          />
          <Stack.Screen 
            name="ProfileEditor" 
            component={ProfileEditor}
            options={{ 
              title: 'Edit Profile',
              headerStyle: { backgroundColor: '#0A1F44' },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
