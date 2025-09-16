import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import CreateAccount from './screens/RegisterScreen';
import PlayerDashboard from './screens/PlayerDashboard';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // Authenticated screens - Show these when logged in
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'PlayConnect Dashboard' }}
            />
            <Stack.Screen 
              name="PlayerDashboard" 
              component={PlayerDashboard}
            />
          </>
        ) : (
          // Unauthenticated screens - Show these when NOT logged in
          <>
            <Stack.Screen 
              name="Login" 
              options={{ headerShown: false }}
            >
              {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen 
              name="CreateAccount" 
              component={CreateAccount}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
