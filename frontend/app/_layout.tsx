import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import React, { useEffect } from 'react';
// import { View, ActivityIndicator } from 'react-native'; // For loading indicator

function RootLayoutNav() {
  const { isAuthenticated, token } = useAuth(); // token might be used later for auto-login checks
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Expo router segments are not available until the first render,
    // so we need to handle the case where segments is an empty array.
    if (segments.length === 0) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth_group';

    console.log(`RootLayoutNav: isAuthenticated: ${isAuthenticated}, segments: ${segments.join('/')}, inAuthGroup: ${inAuthGroup}`);


    // This effect will run whenever isAuthenticated or segments change
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      console.log("RootLayoutNav: Redirecting to /auth_group/login");
      router.replace('/auth_group/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and in auth group (e.g., after login)
      console.log("RootLayoutNav: Redirecting to /tabs_group/books");
      router.replace('/tabs_group/books'); // Or your default tab
    }
  }, [isAuthenticated, segments, router]);

  // Optional: Add a loading indicator while checking token if using SecureStore
  // const { isLoadingToken } = useAuth(); // Assuming isLoadingToken is provided by AuthContext
  // if (isLoadingToken) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" /></View>;

  return <Slot />; // Renders the current child route
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
