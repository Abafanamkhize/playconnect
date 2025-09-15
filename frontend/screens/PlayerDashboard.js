import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Avatar, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayerDashboard = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    views: 0,
    shortlists: 0,
    messages: 0
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/players/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUser(response.data.user);
      
      // Simulate some stats for demo
      setStats({
        views: Math.floor(Math.random() * 100),
        shortlists: Math.floor(Math.random() * 20),
        messages: Math.floor(Math.random() * 15)
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A1F44" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Text 
            size={80} 
            label={user?.name?.charAt(0) || 'P'} 
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Title style={styles.name}>{user?.name}</Title>
            <Paragraph style={styles.role}>{user?.role} • {user?.position || 'No position set'}</Paragraph>
            <Paragraph style={styles.email}>{user?.email}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.views}</Title>
            <Paragraph>Profile Views</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.shortlists}</Title>
            <Paragraph>Shortlists</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.messages}</Title>
            <Paragraph>Messages</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Title title="Quick Actions" />
        <Card.Content>
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ProfileEditor')}
          >
            Edit Profile
          </Button>
          
          <Button 
            mode="outlined" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Skills')}
          >
            Update Skills
          </Button>

          <Button 
            mode="outlined" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Stats')}
          >
            View Statistics
          </Button>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.activityCard}>
        <Card.Title title="Recent Activity" />
        <Card.Content>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Your profile was viewed by a scout</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Added to shortlist by FC Academy</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>

          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Profile completeness: 65%</Text>
            <Text style={styles.activityTime}>Complete your profile for better visibility</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button 
        mode="text" 
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#FF3B30"
      >
        Logout
      </Button>
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
  headerCard: {
    marginBottom: 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: '#0A1F44',
    marginRight: 15
  },
  headerText: {
    flex: 1
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A1F44'
  },
  role: {
    color: '#666',
    fontSize: 16
  },
  email: {
    color: '#888',
    fontSize: 14
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A1F44',
    textAlign: 'center'
  },
  actionsCard: {
    marginBottom: 20
  },
  actionButton: {
    marginVertical: 5
  },
  activityCard: {
    marginBottom: 20
  },
  activityItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  activityText: {
    fontSize: 14
  },
  activityTime: {
    fontSize: 12,
    color: '#888'
  },
  logoutButton: {
    marginVertical: 20
  }
});

export default PlayerDashboard;
