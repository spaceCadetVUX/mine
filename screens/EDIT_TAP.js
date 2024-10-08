import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../fireBaseConfig';

const EditUser = ({ userId, onClose }) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;

  const [user, setUser] = useState({
    id: '',
    name: '',
    disable: false,
    fullControl: false,
    daily: '',
    sunday: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, 'RFID_Users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setUser({ id: userId, ...userDoc.data() }); // Ensures ID is set correctly
      } else {
        Alert.alert('Error', 'User not found.');
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (key, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [key]: value
    }));
  };

  const handleToggleSwitch = (key) => {
    setUser((prevUser) => ({
      ...prevUser,
      [key]: !prevUser[key]
    }));
  };

  const validateTime = (timeString) => {
    return timeRegex.test(timeString);
  };

  const handleUpdateUser = async () => {
    const times = ['daily', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let time of times) {
      if (!validateTime(user[time]) && user[time] !== '') {
        Alert.alert('Invalid Time Format', `Please enter a valid time in the format HH:mm-HH:mm for ${time}.`);
        return;
      }
    }

    if (user.name) { // Ensure only name is required for update
      setLoading(true);
      try {
        const userRef = doc(db, 'RFID_Users', userId); // Use userId directly for update
        await setDoc(userRef, user, { merge: true }); // Merging to avoid overwriting fields
        Alert.alert('Success', 'User updated successfully!');
        onClose(); // Close the edit modal or navigate back
      } catch (error) {
        console.error("Error updating user: ", error);
        Alert.alert('Error', 'An error occurred while updating the user.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please fill in the Name.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          value={user.id}
          editable={false} // ID should not be editable
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={user.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />

        <View style={styles.switchContainer}>
          <Text>Disable</Text>
          <Switch
            value={user.disable}
            onValueChange={() => handleToggleSwitch('disable')}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text>Full Control</Text>
          <Switch
            value={user.fullControl}
            onValueChange={() => handleToggleSwitch('fullControl')}
          />
        </View>

        <Text style={styles.label}>Daily Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Daily Time (HH:mm-HH:mm)"
          value={user.daily}
          onChangeText={(value) => handleInputChange('daily', value)}
        />

        {/* Weekday Inputs */}
        {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
          <View key={day}>
            <Text style={styles.label}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${day.charAt(0).toUpperCase() + day.slice(1)} Time (HH:mm-HH:mm)`}
              value={user[day]}
              onChangeText={(value) => handleInputChange(day, value)}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleUpdateUser}>
          <Text style={styles.addButtonText}>Update User</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Updating User...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default EditUser;
