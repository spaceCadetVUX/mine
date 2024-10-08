import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import login from './screens/loginForm'; // Adjust the path as necessary
import RegisterScreen from './screens/registerForm'; // Adjust the path as necessary
import AddUserScreen from './screens/addUser'; // Renamed for clarity
import UID_ADD from './screens/USER_RFID'
import U_RF_EDIT from './screens/U_RFID_LIST'
import EDIT_TAP from './screens/EDIT_TAP'

import SignUp from './screens/signUp'
import Options from './screens/options'
import { Provider as PaperProvider } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={login} 
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen 
            name="AddUser" // Renamed for consistency
            component={AddUserScreen} 
            options={{ headerShown: false }} // Hide the header
          />
            <Stack.Screen 
            name="SignUp" // Renamed for consistency
            component={SignUp} 
            options={{ headerShown: false }} // Hide the header
          />
            <Stack.Screen 
            name="Options" // Renamed for consistency
            component={Options} 
            options={{ headerShown: false }} // Hide the header
          />
            <Stack.Screen 
            name="UID_ADD" // Renamed for consistency
            component={UID_ADD} 
            options={{ headerShown: false }} // Hide the header
          />
            <Stack.Screen 
            name="U_RF_EDIT" // Renamed for consistency
            component={U_RF_EDIT} 
            options={{ headerShown: false }} // Hide the header
          />
            <Stack.Screen 
            name="EDIT_TAP" // Renamed for consistency
            component={EDIT_TAP} 
            options={{ headerShown: false }} // Hide the header
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
