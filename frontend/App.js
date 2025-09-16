import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/LoginScreen";          // Changed from "./screens/Login"
import CreateAccount from "./screens/RegisterScreen"; // Changed from "./screens/CreateAccount"
import PlayerDashboard from "./screens/PlayerDashboard";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="PlayerDashboard" component={PlayerDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
