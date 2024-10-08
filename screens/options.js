import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RFIDManagerScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Manage Users Section */}
      <View style={styles.card}>
        <Text style={styles.title}>Information</Text>
        <Text style={styles.subtitle}>
          all the information will be showed up here
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddUser')}>
          <Text style={styles.buttonText}>Go to User Information</Text>
        </TouchableOpacity>
      </View>

      {/* Manage Groups Section */}
      <View style={styles.card}>
        <Text style={styles.title}>Add User</Text>
        <Text style={styles.subtitle}>
          Include: Name, ID, permission, time setting
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UID_ADD')}>
          <Text style={styles.buttonText}>Go to Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Set Time Restrictions Section */}
      <View style={styles.card}>
        <Text style={styles.title}>Show all User</Text>
        <Text style={styles.subtitle}>
          edit and delete user
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('U_RF_EDIT')}>
          <Text style={styles.buttonText}>let's take a look</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Tab Simulation */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031424',
    padding: 20,
    //justifyContent: '', // Ensure the content stretches
    paddingTop:40,
  },
  card: {
    marginTop:20,
    backgroundColor: '#0742a0',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#161616',
    fontWeight: 'bold',
  },
  tabBar: {
    position: 'absolute', // Ensure the tab bar stays at the bottom
    bottom: 0, // Position it at the very bottom
    left: 0,
    right: 0,
    backgroundColor: '#1F1F1F',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tab: {
    alignItems: 'center',
    padding: 10,
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RFIDManagerScreen;
