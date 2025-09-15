import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Save token to AsyncStorage
      await AsyncStorage.setItem('token', response.data.token);
      
      // Navigate to Dashboard on successful login
      navigation.navigate('Dashboard');

    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="PlayConnect" subtitle="Where Talent Meets Opportunity" />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <Button 
            mode="contained" 
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          >
            Login
          </Button>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Register')}
            style={styles.link}
          >
            Don't have an account? Register
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  card: {
    padding: 10,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
  link: {
    marginTop: 15,
  }
});

export default LoginScreen;
