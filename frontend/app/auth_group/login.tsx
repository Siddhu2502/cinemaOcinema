import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { login as apiLogin } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loginContext } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Backend is configured for superuser "siddharth" and password "Best#123"
      const response = await apiLogin(username, password);
      if (response && response.token) {
        loginContext(response.token);
        // Navigation will be handled by RootLayoutNav in _layout.tsx
      } else {
        // This case might not be reached if apiLogin throws an error for non-2xx responses
        setError('Login failed: No token received or unexpected response structure.');
      }
    } catch (err: any) {
      // err might be an Axios error object (err.response.data) or a simple Error (err.message)
      const apiErrorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(apiErrorMessage || 'An unexpected error occurred during login.');
      // Alert.alert("Login Error", apiErrorMessage || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>cinemaOcinema</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        testID="username-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator"/>
      ) : (
        <Button title="Login" onPress={handleLogin} testID="login-button" />
      )}
      {error && <Text style={styles.errorText} testID="error-message">{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14, // Added for consistency
  },
});
