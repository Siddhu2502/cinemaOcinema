import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';

// Custom SearchBar Header Component
function CustomHeaderTitle() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({ pathname: '/search', params: { q: searchQuery } });
      // setSearchQuery(''); // Optionally clear after search
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch} // Search on keyboard submit
        returnKeyType="search"
        testID="search-input"
      />
      {/* Using TouchableOpacity for better styling control over Button */}
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton} testID="search-button">
        <Ionicons name="search" size={20} color={Platform.OS === 'ios' ? '#007AFF' : '#fff'} />
      </TouchableOpacity>
    </View>
  );
}


export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: 'blue',
        // Use a function for headerTitle to render the custom component
        headerTitle: () => <CustomHeaderTitle />,
        // headerTitleAlign: 'left', // Align search bar to the left if desired. Default might be 'center'.
        // The CustomHeaderTitle component uses flex: 1, so it should try to fill available space.
      }}
    >
      <Tabs.Screen
        name="books" // This will correspond to a file named `books.tsx` in this directory
        options={{
          // title is overridden by headerTitle in screenOptions, so no need to set it here
          // title: 'Books', 
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="movies" // This will correspond to a file named `movies.tsx`
        options={{
          // title: 'Movies',
          tabBarIcon: ({ color, size }) => <Ionicons name="film-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="images" // This will correspond to a file named `images.tsx`
        options={{
          // title: 'Images',
          tabBarIcon: ({ color, size }) => <Ionicons name="image-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
    // For Android, negative margin can help if there's too much default padding around header title
    marginLeft: Platform.OS === 'android' ? -25 : 0, 
    marginRight: Platform.OS === 'android' ? 10 : 10, // Add some margin to the right for the button
    height: 40, // Explicit height for the container
  },
  searchInput: {
    flex: 1,
    height: '100%', // Take full height of parent
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    marginLeft: 8,
    height: '100%', // Take full height of parent
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#007AFF', // Button-like bg for Android
    borderRadius: 5,
  },
  // searchButtonText: { // Not needed if using Icon
  //   color: Platform.OS === 'ios' ? '#007AFF' : '#fff',
  //   fontSize: 16,
  // }
});
