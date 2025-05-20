import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
// import { Image } from 'expo-image';
import { getImages } from '../../services/api';
import { getContentUrl } from '../../services/api';

interface ImageItem {
  id: number;
  name: string;
  filePath: string;
  folder?: string;
}

interface ImageSection {
  title: string;
  data: ImageItem[];
}

export default function ImagesScreen() {
  const [sections, setSections] = useState<ImageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const groupedImages: Record<string, ImageItem[]> = await getImages();
        const formattedSections: ImageSection[] = Object.keys(groupedImages)
          .sort((a, b) => { // Ensure "ALL" comes first, then alphabetical
            if (a === "ALL") return -1;
            if (b === "ALL") return 1;
            return a.localeCompare(b);
          })
          .map(folderName => ({
            title: folderName,
            data: groupedImages[folderName]
          }));
        setSections(formattedSections);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch images.');
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  if (sections.length === 0 || sections.every(sec => sec.data.length === 0)) {
    return <View style={styles.centered}><Text>No images found.</Text></View>;
  }

  const renderImageItem = ({ item }: { item: ImageItem }) => (
    <View style={styles.itemContainer}>
      <Image
        style={styles.itemImage}
        source={{ uri: getContentUrl('images', item.filePath) }}
        // contentFit="cover" // for expo-image
      />
      <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
    </View>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.id.toString() + index}
      renderItem={({ item }) => (
        // To achieve a grid, renderItem would return a FlatList or View with flexDirection: 'row' and wrapping
        // For simplicity, we'll render items in a single column per section for now.
        // If a grid is desired, numColumns can be set on SectionList's FlatList via renderSection
        // This basic renderItem will list images vertically in each section.
         renderImageItem({item})
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      contentContainerStyle={styles.listContainer}
      // For a grid display within sections, one might need to customize renderSection or use a different approach.
      // A simpler way for a grid-like feel with SectionList is to make items smaller and allow them to wrap,
      // or set numColumns on the SectionList itself if supported, but that applies to the whole list.
      // The current renderImageItem will create a vertical list of images for each section.
    />
  );
}

// const imageSize = Dimensions.get('window').width / 3 - 16; // Example for 3 columns

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
    paddingHorizontal: 8,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  itemContainer: { // Styles for a single column list item
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    alignItems: 'center', // Center image and text
    elevation: 1,
    marginHorizontal: 8, // Add some horizontal margin for single column items
  },
  itemImage: {
    width: Dimensions.get('window').width * 0.8, // Larger image for single column
    height: Dimensions.get('window').width * 0.8 * (9/16), // Assuming 16:9 aspect ratio
    borderRadius: 4,
    marginBottom: 5,
    backgroundColor: '#e0e0e0', // Standardized background color
  },
  itemName: {
    fontSize: 12,
    textAlign: 'center',
  },
});
