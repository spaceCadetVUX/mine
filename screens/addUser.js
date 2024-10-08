import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text, View, TextInput, Button, Alert } from 'react-native';
import { Card, Appbar, Menu, IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { storedUsers, addUserToStorage } from './usersData'; // Local storage (assumed)
import { getFirestore, doc, deleteDoc, collection, addDoc } from 'firebase/firestore'; // Firestore imports
import { firebaseApp } from '../fireBaseConfig'; // Your Firebase config file

const db = getFirestore(firebaseApp); // Initialize Firestore

const App = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState(storedUsers); // Assuming `storedUsers` is initial user data from local storage or Firestore
  const [searchTerm, setSearchTerm] = useState('');
  const [menuVisible, setMenuVisible] = useState(null);

  // Menu control functions
  const openMenu = (userId) => setMenuVisible(userId);
  const closeMenu = () => setMenuVisible(null);

  // Function to add user to Firestore and local state
  const handleAddUser = async () => {
    if (userId && userName) {
      const userExists = users.some((user) => user.id === userId);
      if (userExists) {
        Alert.alert('Error', 'User with this ID already exists. Please use a different ID.');
      } else {
        const newUser = { id: userId, name: userName };
        
        // Add user to Firestore
        try {
          await addDoc(collection(db, 'users'), newUser);
          setUsers([...users, newUser]);
          addUserToStorage(newUser); // Assuming a local storage function
          setUserId('');
          setUserName('');
        } catch (error) {
          Alert.alert('Error', 'Could not add user to Firestore');
          console.error('Error adding user to Firestore:', error);
        }
      }
    } else {
      Alert.alert('Error', 'Please fill out both User ID and User Name.');
    }
  };

  // Function to delete user from Firestore and local state
  const handleDeleteUser = async (userIdToDelete) => {
    try {
      // Delete user from Firestore
      const userRef = doc(db, 'users', userIdToDelete);
      await deleteDoc(userRef);
      
      // Update local state
      setUsers(users.filter(user => user.id !== userIdToDelete));
      Alert.alert('User deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Could not delete user from Firestore');
      console.error('Error deleting user from Firestore:', error);
    }
  };

  // Confirm delete user
  const confirmDeleteUser = (userId) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteUser(userId) },
      ],
      { cancelable: true }
    );
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.headerStyle}>
        <Appbar.Content title="User Manager" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView>
        {/* User Input Form */} 
        <View style={styles.formContainer}>
          <Text style={styles.label}>User ID</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={setUserId}
            placeholder="Enter User ID"
            placeholderTextColor="#cfcccc" 
          />
          <Text style={styles.label}>User Name</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter User Name"
            placeholderTextColor="#cfcccc" 
          />
          <Button title="Add User" onPress={handleAddUser} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.label}>Search User by Name</Text>
          <TextInput
            style={styles.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Enter User Name to Search"
            placeholderTextColor="#cfcccc" 
          />
        </View>

        {/* Dashboard and user cards */}
        <View style={styles.dashboardContainer}>
          <Text style={styles.dashboardTitle}>User Dashboard</Text>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <Card key={index} style={styles.userCard}>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.userText}>ID: {user.id}</Text>
                    <Text style={styles.userText}>Name: {user.name}</Text>
                  </View>
                  {/* 3 dots menu */}
                  <Menu
                    visible={menuVisible === user.id}
                    onDismiss={closeMenu}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        size={24}
                        onPress={() => openMenu(user.id)}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => navigation.navigate('EditUser', { user })}
                      title="Edit"
                    />
                    <Menu.Item
                      onPress={() => confirmDeleteUser(user.id)}
                      title="Delete"
                    />
                  </Menu>
                </View>
              </Card>
            ))
          ) : (
            <Text style={styles.noUsersText}>No users found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#161616',
  },
  headerStyle: {
    backgroundColor: '#2e2e2e',
    elevation: 4,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#2e2e2e',
    padding: 20,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  searchContainer: {
    marginBottom: 20,
    backgroundColor: '#2e2e2e',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dashboardContainer: {
    marginTop: 20,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  userCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  noUsersText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default App;
