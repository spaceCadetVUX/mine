import React, { useState } from 'react';
import { View, Text, TextInput, Switch, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import getDoc to fetch documents
import { db } from '../fireBaseConfig'; // Assuming Firebase is already initialized

const USER_RFID = () => {
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

  const [useDailyTime, setUseDailyTime] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator

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

  const handleAddUser = async () => {
    const times = ['daily', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let time of times) {
        if (!validateTime(user[time]) && user[time] !== '') {
            Alert.alert('Invalid Time Format', `Please enter a valid time in the format HH:mm-HH:mm for ${time}.`);
            return;
        }
    }

    if (user.id && user.name) {
        setLoading(true); // Show loading indicator
        try {
            const userRef = doc(db, 'RFID_Users', user.id);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                Alert.alert('Error', 'A user with this ID already exists. Please use a different ID.');
            } else {
                await setDoc(userRef, user);
                Alert.alert('Success', 'User added successfully!');
                setUser({ // Reset the form after adding the user
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
                setUseDailyTime(false); // Reset the Daily Time button as well
            }
        } catch (error) {
            console.error("Error adding user: ", error);
        } finally {
            // Introduce a delay for testing purposes
            setTimeout(() => {
                setLoading(false); // Hide loading indicator
            }, 1000); // 1 second delay
        }
    } else {
        Alert.alert('Error', 'Please fill in both ID and Name.');
    }
};

  const applyDailyTime = () => {
    if (user.daily && validateTime(user.daily)) {
      setUser((prevUser) => ({
        ...prevUser,
        sunday: prevUser.daily,
        monday: prevUser.daily,
        tuesday: prevUser.daily,
        wednesday: prevUser.daily,
        thursday: prevUser.daily,
        friday: prevUser.daily,
        saturday: prevUser.daily,
      }));
    } else {
      Alert.alert('Invalid Time Format', 'Please enter a valid time in the format HH:mm-HH:mm for Daily.');
    }
  };

  const toggleDailyTime = () => {
    setUseDailyTime((prev) => !prev);
    if (!useDailyTime) {
      applyDailyTime();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={{alignSelf:'center',
        color: 'white',
        fontSize:30,
        fontWeight:'500',
// Rounded corners
      }}>Create RFID USER</Text>
        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ID"
          value={user.id}
          color={'white'}
          placeholderTextColor={'#d9dcdc'}
          onChangeText={(value) => handleInputChange('id', value)}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={user.name}
          color={'white'}         
          placeholderTextColor={'#d9dcdc'}
          onChangeText={(value) => handleInputChange('name', value)}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.Text}>Disable</Text>
          <Switch
            value={user.disable}
            onValueChange={() => handleToggleSwitch('disable')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            style={styles.switch} // Apply any additional styles
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.Text}>Full Control</Text>
          <Switch
            value={user.fullControl}
            onValueChange={() => handleToggleSwitch('fullControl')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            style={styles.switch} // Apply any additional styles
          />
        </View>

        <Text style={styles.label}>Daily Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Daily Time (HH:mm-HH:mm)"
          value={user.daily}
          placeholderTextColor={'#d9dcdc'}
          color={'white'}
          onChangeText={(value) => handleInputChange('daily', value)}
        />

        <TouchableOpacity
          style={[styles.dailyButton, useDailyTime && styles.dailyButtonActive]}
          onPress={toggleDailyTime}
        >
          <Text style={styles.dailyButtonText}>
            {useDailyTime ? 'Daily Time Applied' : 'Apply Daily Time to All Days'}
          </Text>
        </TouchableOpacity>

        {/* Weekday Inputs */}
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
          <View key={day}>
            <Text style={styles.label}>{day}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${day} Time (HH:mm-HH:mm)`}
              value={user[day.toLowerCase()]}
              placeholderTextColor={'#d9dcdc'}
              color={'white'}
              onChangeText={(value) => handleInputChange(day.toLowerCase(), value)}
            />
          </View>
        ))}

        {/* TouchableOpacity for Add User Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Adding User...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop:40,
    backgroundColor:'#031424'
  },
  container: {
    padding: 20,
    backgroundColor:'#031424'
  },
  contentContainer: {
    paddingBottom: 40, // Add padding to ensure everything is visible
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: 'white',
    paddingHorizontal: 10,   // Horizontal padding for spacing
    paddingVertical: 5,      // Vertical padding for spacing
    backgroundColor: '#ff6533',  // Background color
    borderRadius: 10,         // Rounded corners
    alignSelf: 'flex-start', // Makes the width fit the text
  },
  switch:{
    transform: [{ scale: 1.2 }], // Optional: scale the switch size
    marginLeft:10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#7294d3',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

  },
  dailyButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,

  },
  Text:{
    fontSize: 16,
    marginVertical: 8,
    color: 'white',
    paddingHorizontal: 10,   // Horizontal padding for spacing
    paddingVertical: 5,      // Vertical padding for spacing
    backgroundColor: '#fb9003',  // Background color
    borderRadius: 10,         // Rounded corners
    alignSelf: 'flex-start', // Makes the width fit the text
  },
  dailyButtonActive: {
    backgroundColor: '#0056b3',
  },
  dailyButtonText: {
    color: '#fff',
    textAlign: 'center',
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

export default USER_RFID;
