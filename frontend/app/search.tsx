import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { searchContent, getContentUrl } from '../services/api'; // Adjust path

// Define a common interface for search result data part
interface SearchResultData {
  id: number;
  title?: string; // For books/movies
  name?: string;  // For images
  author?: string; // For books
  director?: string; // For movies
  imageUrl?: string; // For book/movie covers (served from 'images' type)
  filePath?: string; // For image files (served from 'images' type)
  folder?: string; // for images
}

interface SearchResultItem {
  type: 'book' | 'movie' | 'image';
  data: SearchResultData;
}

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const query = params.q || "";

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchContent(query);
        setResults(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch search results.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const renderItem = ({ item }: { item: SearchResultItem }) => {
    let imageUri = null; // Changed variable name for clarity
    if (item.type === 'book' || item.type === 'movie') {
      if (item.data.imageUrl) { // imageUrl field from Book/Movie entity
        imageUri = getContentUrl('images', item.data.imageUrl);
      }
    } else if (item.type === 'image') {
      if (item.data.filePath) { // filePath field from Image entity
        imageUri = getContentUrl('images', item.data.filePath);
      }
    }

    return (
      <View style={styles.itemContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.itemImage} />
        ) : (
          <View style={styles.itemImagePlaceholder}><Text style={styles.placeholderText}>No Image</Text></View>
        )}
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.data.title || item.data.name}
            <Text style={styles.itemType}> ({item.type})</Text>
          </Text>
          {item.type === 'book' && item.data.author && <Text numberOfLines={1}>{item.data.author}</Text>}
          {item.type === 'movie' && item.data.director && <Text numberOfLines={1}>{item.data.director}</Text>}
        </View>
      </View>
    );
  };

  if (isLoading) { // Show loading indicator whenever fetching
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.queryText}>Results for: "{query}"</Text>
      {results.length === 0 && !isLoading && <Text style={styles.centeredNoResults}>No results found.</Text>}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.type + item.data.id.toString() + index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centeredNoResults: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  queryText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, paddingHorizontal: 5 },
  itemContainer: { flexDirection: 'row', padding: 10, marginBottom: 10, backgroundColor: '#fff', borderRadius: 5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  itemImage: { width: 50, height: 75, borderRadius: 4, marginRight: 10, backgroundColor: '#e0e0e0' },
  itemImagePlaceholder: { width: 50, height: 75, borderRadius: 4, marginRight: 10, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 10, color: '#757575'},
  itemTextContainer: { flex: 1, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemType: { fontSize: 12, color: 'gray', fontStyle: 'italic' },
});
