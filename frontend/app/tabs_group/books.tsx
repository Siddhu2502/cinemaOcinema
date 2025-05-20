import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
// If using expo-image: import { Image } from 'expo-image';
import { getBooks } from '../../services/api';
import { getContentUrl } from '../../services/api'; // To construct image URLs

// Define the type for a book object based on backend model
interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl?: string; // Make imageUrl optional as it can be null
  filePath: string;
}

export default function BooksScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const data = await getBooks();
        setBooks(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch books.');
        setBooks([]); // Clear books on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  if (books.length === 0) {
    return <View style={styles.centered}><Text>No books found.</Text></View>;
  }

  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={styles.itemContainer}>
      {item.imageUrl ? (
        <Image
          style={styles.itemImage}
          source={{ uri: getContentUrl('images', item.imageUrl) }}
          // placeholder={require('../../assets/images/image-placeholder.png')} // Example for expo-image placeholder
          // transition={1000} // Example for expo-image
        />
      ) : (
        <View style={styles.itemImagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
        <Text style={styles.itemAuthor} numberOfLines={1} ellipsizeMode="tail">{item.author}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={books}
      renderItem={renderBookItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemImage: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#e0e0e0', // Placeholder background
  },
  itemImagePlaceholder: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#757575',
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemAuthor: {
    fontSize: 14,
    color: '#555',
  },
});
