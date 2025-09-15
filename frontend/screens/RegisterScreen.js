import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, RadioButton } from 'react-native-paper';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'player'
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending registration request...');
      
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      console.log('Registration successful:', response.data);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
        Alert.alert('Error', error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        Alert.alert('Error', 'No response from server. Is the backend running?');
      } else {
        console.error('Request error:', error.message);
        Alert.alert('Error', 'Request failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Create Account" subtitle="Join PlayConnect Today" />
        <Card.Content>
          <TextInput
            label="Full Name *"
            value={formData.name}
            onChangeText={(text) => updateFormData('name', text)}
            style={styles.input}
            autoCapitalize="words"
          />

          <TextInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password *"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            style={styles.input}
            secureTextEntry
          />

          <TextInput
            label="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            style={styles.input}
            secureTextEntry
          />

          <Text style={styles.sectionTitle}>Account Type</Text>
          <RadioButton.Group
            onValueChange={(value) => updateFormData('role', value)}
            value={formData.role}
          >
            <View style={styles.radioOption}>
              <RadioButton value="player" />
              <Text>Player</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="scout" />
              <Text>Scout/Coach</Text>
            </View>
          </RadioButton.Group>

          <Button 
            mode="contained" 
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          >
            Create Account
          </Button>

          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Login')}
            style={styles.link}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  card: {
    padding: 10,
    marginVertical: 20
  },
  input: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  button: {
    marginTop: 20,
    padding: 5,
  },
  link: {
    marginTop: 15,
  }
});

export default RegisterScreen;
