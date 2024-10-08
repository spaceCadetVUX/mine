import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../fireBaseConfig'; // Assuming Firebase is already initialized

const ShowUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null); // Track which user's options are open

  // Fetch all users from Firestore on initial render
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'RFID_Users'));
      const usersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  // Function to filter users based on the search query
  const handleFindUser = () => {
    if (search.trim() === '') {
      setFilteredUsers(users); // Reset to full list if search is empty
    } else {
      const filtered = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
      setFilteredUsers(filtered);
    }
  };

  const handleDeleteUser = async (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'RFID_Users', id));
              Alert.alert('Success', 'User deleted successfully');
              fetchUsers(); // Reload the list after deletion
            } catch (error) {
              console.error('Error deleting user: ', error);
            }
          },
        },
      ],
    );
  };

  const handleEditUser = (id) => {
    // Navigate to the Edit User screen and pass the user ID
    navigation.navigate('EDIT_TAP', { userId: id });
  };

  const toggleOptions = (userId) => {
    // Close any previously opened options
    if (selectedUserId === userId) {
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
    }
  };

  const closeOptions = () => {
    setSelectedUserId(null);
  };

  return (
    <TouchableWithoutFeedback onPress={closeOptions}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name"
            value={search}
            color={'white'}
            placeholderTextColor={'#9ba8a6'}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.findButton} onPress={handleFindUser}>
            <Text style={styles.findButtonText}>Find</Text>
          </TouchableOpacity>
        </View>

        {/* List of Users */}
        <ScrollView style={styles.usersList}>
          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDetails}>ID: {user.id}</Text>

              {/* Options Button */}
              <TouchableOpacity style={styles.optionsButton} onPress={() => toggleOptions(user.id)}>
                <Text style={styles.optionsText}>...</Text>
              </TouchableOpacity>

              {/* Conditionally render the dropdown if this user's options are selected */}
              {selectedUserId === user.id && (
                <View style={styles.optionsDropdown}>
                  <TouchableOpacity style={styles.optionItem} onPress={() => handleEditUser(user.id)}>
                    <Text style={styles.optionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionItem} onPress={() => handleDeleteUser(user.id)}>
                    <Text style={styles.optionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor:'#031424',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  findButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usersList: {
    marginTop: 10,
  },
  userCard: {
    backgroundColor: '#123970',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    position: 'relative',
    zIndex: 100,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white'
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  optionsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  optionsText: {
    fontSize: 24,
    color: '#000',
  },
  optionsDropdown: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 10,
  },
  optionItem: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default ShowUsersScreen;
