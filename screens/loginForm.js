// Import the functions you need from the SDKs
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../fireBaseConfig'; // Adjust the path as necessary
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from '../styles_sheet/regeist_login_style'; // Adjust the path as necessary

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSignIn = () => {
    if (!email || !password) {
      setWarningMessage('Please fill in all fields.');
      return;
    }

    setLoading(true); // Start loading

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // User is signed in
        const user = userCredential.user; // Get the user object
        const uid = user.uid; // Get the uid from the user object
        console.log('User ID:', uid); // Optional: Log the UID to the console

        // Make an API call to send the UID to your server (if needed)
        fetch('https://v1.nocodeapi.com/spacecadetvux/fbsdk/EadTeMsQGmPYuKkB/getAllUsers', {
          method: 'GET', // Change to GET
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response JSON
          })
          .then(data => {
            console.log('Response from server:', data); // Log the server response
            setWarningMessage('');
            navigation.navigate('Options'); // Navigate to the next screen
          })
          .catch(error => {
            console.error('Error sending UID to API:', error);
            Alert.alert('Error', 'Failed to send UID to the server.');
          })
          .finally(() => {
            setLoading(false); // Stop loading when done
          });
      })
      .catch(error => {
        let errorMessage;
        switch (error.code) {
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          default:
            errorMessage = 'Login failed. Please try again.';
        }
        Alert.alert('Login Failed', errorMessage);
        setPassword(''); // Reset password input field
        setLoading(false); // Stop loading on error
      });
  };

  return (
    <LinearGradient
      colors={['#FF204E', '#A0153E', '#5D0E41']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>

        {warningMessage ? (
          <Text style={styles.warningText}>{warningMessage}</Text>
        ) : null}

        {/* Email */}
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={24} color="white" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#C3C3C3"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={24} color="white" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#C3C3C3"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
            <FontAwesome
              name={showPassword ? 'eye' : 'eye-slash'}
              size={24}
              color="white"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleSignIn} disabled={loading}>
          <Text style={styles.registerButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" color="#ffffff" style={{ marginVertical: 20 }} />}

        {/* Forgot Password */}
        <Text style={styles.termsText}>
          <Text style={styles.link}>Forgot Password</Text>.
        </Text>

        {/* Social Buttons */}
        <TouchableOpacity style={styles.facebookButton}>
          <FontAwesome name="facebook" size={24} color="white" />
          <Text style={styles.facebookButtonText}>Sign In with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <FontAwesome name="google" size={24} color="red" />
          <Text style={styles.googleButtonText}>Sign In with Google</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <Text style={styles.signInText}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

export default SignInScreen;
