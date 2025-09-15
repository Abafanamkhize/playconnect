import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Title, RadioButton, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEditor = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    age: '',
    height: '',
    weight: '',
    dominantFoot: '',
    team: '',
    location: { city: '', country: '' },
    skills: { pace: '', shooting: '', passing: '', dribbling: '', defense: '', physical: '' },
    bio: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/players/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setFormData(prev => ({
        ...prev,
        ...response.data.user,
        age: response.data.user.age?.toString() || '',
        height: response.data.user.height?.toString() || '',
        weight: response.data.user.weight?.toString() || '',
        skills: {
          pace: response.data.user.skills?.pace?.toString() || '',
          shooting: response.data.user.skills?.shooting?.toString() || '',
          passing: response.data.user.skills?.passing?.toString() || '',
          dribbling: response.data.user.skills?.dribbling?.toString() || '',
          defense: response.data.user.skills?.defense?.toString() || '',
          physical: response.data.user.skills?.physical?.toString() || ''
        }
      }));

    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Convert string values to numbers where appropriate
      const dataToSend = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        skills: {
          pace: formData.skills.pace ? parseInt(formData.skills.pace) : undefined,
          shooting: formData.skills.shooting ? parseInt(formData.skills.shooting) : undefined,
          passing: formData.skills.passing ? parseInt(formData.skills.passing) : undefined,
          dribbling: formData.skills.dribbling ? parseInt(formData.skills.dribbling) : undefined,
          defense: formData.skills.defense ? parseInt(formData.skills.defense) : undefined,
          physical: formData.skills.physical ? parseInt(formData.skills.physical) : undefined
        }
      };

      await axios.put('http://localhost:5000/api/players/profile', dataToSend, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();

    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSkills = (skill, value) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: value }
    }));
  };

  const updateLocation = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A1F44" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Edit Profile" />
        <Card.Content>
          {/* Basic Information */}
          <Title style={styles.sectionTitle}>Basic Information</Title>
          <TextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => updateFormData('name', text)}
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Position */}
          <Title style={styles.sectionTitle}>Position</Title>
          <RadioButton.Group
            onValueChange={(value) => updateFormData('position', value)}
            value={formData.position}
          >
            <View style={styles.radioOption}>
              <RadioButton value="Goalkeeper" />
              <Text>Goalkeeper</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Defender" />
              <Text>Defender</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Midfielder" />
              <Text>Midfielder</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Forward" />
              <Text>Forward</Text>
            </View>
          </RadioButton.Group>

          {/* Physical Attributes */}
          <Title style={styles.sectionTitle}>Physical Attributes</Title>
          <View style={styles.row}>
            <TextInput
              label="Age"
              value={formData.age}
              onChangeText={(text) => updateFormData('age', text)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
            />
            <TextInput
              label="Height (cm)"
              value={formData.height}
              onChangeText={(text) => updateFormData('height', text)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <TextInput
              label="Weight (kg)"
              value={formData.weight}
              onChangeText={(text) => updateFormData('weight', text)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
            />
            <View style={[styles.halfInput, styles.radioGroup]}>
              <Text style={styles.label}>Dominant Foot</Text>
              <RadioButton.Group
                onValueChange={(value) => updateFormData('dominantFoot', value)}
                value={formData.dominantFoot}
              >
                <View style={styles.radioOption}>
                  <RadioButton value="Left" />
                  <Text>Left</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="Right" />
                  <Text>Right</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="Both" />
                  <Text>Both</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>

          {/* Team & Location */}
          <Title style={styles.sectionTitle}>Team & Location</Title>
          <TextInput
            label="Current Team"
            value={formData.team}
            onChangeText={(text) => updateFormData('team', text)}
            style={styles.input}
          />

          <View style={styles.row}>
            <TextInput
              label="City"
              value={formData.location.city}
              onChangeText={(text) => updateLocation('city', text)}
              style={[styles.input, styles.halfInput]}
            />
            <TextInput
              label="Country"
              value={formData.location.country}
              onChangeText={(text) => updateLocation('country', text)}
              style={[styles.input, styles.halfInput]}
            />
          </View>

          {/* Skills Ratings (1-100) */}
          <Title style={styles.sectionTitle}>Skills Rating (1-100)</Title>
          {Object.entries(formData.skills).map(([skill, value]) => (
            <TextInput
              key={skill}
              label={skill.charAt(0).toUpperCase() + skill.slice(1)}
              value={value}
              onChangeText={(text) => updateSkills(skill, text)}
              style={styles.input}
              keyboardType="numeric"
            />
          ))}

          {/* Bio */}
          <Title style={styles.sectionTitle}>Bio</Title>
          <TextInput
            label="Tell us about yourself"
            value={formData.bio}
            onChangeText={(text) => updateFormData('bio', text)}
            style={styles.input}
            multiline
            numberOfLines={4}
          />

          {/* Save Button */}
          <Button 
            mode="contained" 
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
          >
            Save Profile
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    color: '#666'
  },
  card: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#0A1F44'
  },
  input: {
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5
  },
  radioGroup: {
    justifyContent: 'center'
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginBottom: 5,
    color: '#666'
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 10,
    padding: 5
  },
  cancelButton: {
    marginBottom: 20
  }
});

export default ProfileEditor;
