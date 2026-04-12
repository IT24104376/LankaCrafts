// Craft Shop (Ecommerce) Home Screen for Mobile App

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { craftsApi } from '../../src/services/api';
import type { Craft } from '../../src/types';
import { CRAFT_CATEGORIES } from '../../src/types';

export default function CraftShop() {
  const router = useRouter();
  
  const [crafts, setCrafts] = useState<Craft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCrafts = async () => {
    try {
      const data = await craftsApi.getAll(1, 20, selectedCategory || undefined, searchQuery || undefined);
      setCrafts(data.crafts || []);
    } catch (err) {
      console.error('[Shop] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrafts();
  }, [selectedCategory, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCrafts();
    setRefreshing(false);
  };

  const renderCategoryChip = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.categoryChip, selectedCategory === item && styles.categoryChipSelected]}
      onPress={() => setSelectedCategory(selectedCategory === item ? null : item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextSelected]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderCraftCard = ({ item }: { item: Craft }) => (
    <TouchableOpacity 
      style={styles.craftCard}
      onPress={() => router.push(`/shop/craft/${item._id}`)}
    >
      <Image 
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/200' }} 
        style={styles.craftImage}
      />
      <View style={styles.craftInfo}>
        <Text style={styles.craftName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.artistName} numberOfLines={1}>
          by {item.artistName || 'Unknown Artisan'}
        </Text>
        <Text style={styles.craftPrice}>Rs. {item.price.toLocaleString()}</Text>
        {!item.isAvailable && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search crafts..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CRAFT_CATEGORIES}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Products Grid */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={crafts}
          renderItem={renderCraftCard}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.craftsContainer}
          columnWrapperStyle={styles.craftsRow}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No crafts found</Text>
              <TouchableOpacity 
                style={styles.tryAgainButton}
                onPress={fetchCrafts}
              >
                <Text style={styles.tryAgainText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchInput: { 
    backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 16, 
    paddingVertical: 12, fontSize: 16, color: '#333' 
  },
  categoriesContainer: { backgroundColor: '#fff', paddingBottom: 12 },
  categoriesList: { paddingHorizontal: 16 },
  categoryChip: { 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, 
    backgroundColor: '#f5f5f5', marginRight: 8 
  },
  categoryChipSelected: { backgroundColor: '#4F46E5' },
  categoryText: { fontSize: 14, color: '#666' },
  categoryTextSelected: { color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  craftsContainer: { padding: 12 },
  craftsRow: { justifyContent: 'space-between' },
  craftCard: { 
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, width: '48%', 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 
  },
  craftImage: { 
    width: '100%', height: 140, borderTopLeftRadius: 12, borderTopRightRadius: 12 
  },
  craftInfo: { padding: 12 },
  craftName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  artistName: { fontSize: 12, color: '#666', marginBottom: 8 },
  craftPrice: { fontSize: 16, color: '#4F46E5', fontWeight: 'bold' },
  outOfStockBadge: { 
    backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 4, 
    borderRadius: 4, marginTop: 8, alignSelf: 'flex-start' 
  },
  outOfStockText: { fontSize: 12, color: '#dc2626' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 16 },
  tryAgainButton: { backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  tryAgainText: { color: '#fff', fontWeight: '600' },
});