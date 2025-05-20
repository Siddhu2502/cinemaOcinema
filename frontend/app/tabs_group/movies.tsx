import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
// import { Image } from 'expo-image'; // Optional: if using expo-image
import { getMovies } from '../../services/api';
import { getContentUrl } from '../../services/api';

interface Movie {
  id: number;
  title: string;
  director: string;
  imageUrl?: string;
  filePath: string;
  genre: string;
}

export default function MoviesScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const data = await getMovies();
        setMovies(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies.');
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  if (movies.length === 0) {
    return <View style={styles.centered}><Text>No movies found.</Text></View>;
  }

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.itemContainer}>
      {item.imageUrl ? (
        <Image
          style={styles.itemImage} // Use similar dimensions as book covers
          source={{ uri: getContentUrl('images', item.imageUrl) }}
        />
      ) : (
        <View style={styles.itemImagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
        <Text style={styles.itemDirector} numberOfLines={1} ellipsizeMode="tail">{item.director}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={movies}
      renderItem={renderMovieItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
}

// Use styles similar to BooksScreen for consistency
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemImage: {
    width: 60, // Adjust if movie posters have different aspect ratio, but keep consistent for list view
    height: 90,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
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
  itemDirector: { // Changed from itemAuthor
    fontSize: 14,
    color: '#555',
  },
});
