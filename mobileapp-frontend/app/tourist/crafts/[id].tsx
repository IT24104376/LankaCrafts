import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity,
  ActivityIndicator, Alert, Dimensions, FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/context/AuthContext';
import { getPublicCraft } from '../../../src/services/api';
import { BatikBackground } from '../../../src/components/BatikBackground';
import { Star, MapPin, ArrowLeft, ShoppingBag } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function TouristCraftDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tourist } = useAuth();
  const router = useRouter();

  const [craft, setCraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCraft();
  }, [id]);

  const loadCraft = async () => {
    try {
      setLoading(true);
      const res = await getPublicCraft(id as string);
      setCraft(res.data.craft);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to load craft details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleBookWorkshop = () => {
    if (craft?.artistId) {
      router.push({
        pathname: '/tourist/bookings/book-workshop',
        params: { artistId: craft.artistId, artistName: craft.artistName, craftType: craft.category }
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <BatikBackground />
        <View style={s.center}>
          <ActivityIndicator size="large" color="#2F5D50" />
        </View>
      </SafeAreaView>
    );
  }

  if (!craft) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <BatikBackground />
        <View style={s.center}>
          <Text style={s.errorText}>Craft not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.backLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <BatikBackground />
      <View style={s.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Images */}
          <View style={s.imageContainer}>
            {craft.images && craft.images.length > 0 ? (
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={craft.images}
                keyExtractor={(uri: string, idx: number) => idx.toString()}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={s.mainImage} />
                )}
              />
            ) : (
              <View style={s.imagePlaceholder}>
                <ShoppingBag size={48} color="#D1D5DB" />
              </View>
            )}
          </View>

          {/* Header Actions */}
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1E1E1E" />
          </TouchableOpacity>

          <View style={s.content}>
            {/* Title & Category */}
            <Text style={s.title}>{craft.name}</Text>
            <View style={s.categoryBadge}>
              <Text style={s.categoryText}>{craft.category}</Text>
            </View>

            {/* Price */}
            <View style={s.priceRow}>
              <Text style={s.price}>LKR {craft.price?.toLocaleString()}</Text>
              {craft.isAvailable === false && (
                <View style={s.outOfStockBadge}>
                  <Text style={s.outOfStockText}>Out of Stock</Text>
                </View>
              )}
            </View>

            <View style={s.divider} />

            {/* Description */}
            {craft.description && (
              <>
                <Text style={s.sectionTitle}>Description</Text>
                <Text style={s.description}>{craft.description}</Text>
                <View style={s.divider} />
              </>
            )}

            {/* Details Grid */}
            <View style={s.detailsGrid}>
              {craft.stock !== undefined && (
                <View style={s.detailItem}>
                  <Text style={s.detailValue}>{craft.stock}</Text>
                  <Text style={s.detailLabel}>In Stock</Text>
                </View>
              )}
              {craft.dimensions && (craft.dimensions.height || craft.dimensions.width || craft.dimensions.depth) && (
                <View style={s.detailItem}>
                  <Text style={s.detailValue}>
                    {craft.dimensions.height || ''}{craft.dimensions.height && craft.dimensions.width ? '×' : ''} {craft.dimensions.width || ''}{craft.dimensions.depth ? `× ${craft.dimensions.depth}${craft.dimensions.unit || 'cm'}` : ''}
                  </Text>
                  <Text style={s.detailLabel}>Size</Text>
                </View>
              )}
              {craft.weight && craft.weight.value && (
                <View style={s.detailItem}>
                  <Text style={s.detailValue}>{craft.weight.value} {craft.weight.unit}</Text>
                  <Text style={s.detailLabel}>Weight</Text>
                </View>
              )}
            </View>

            {/* Materials */}
            {craft.materials && craft.materials.length > 0 && (
              <>
                <Text style={s.sectionTitle}>Materials</Text>
                <View style={s.chipContainer}>
                  {craft.materials.map((m: string, idx: number) => (
                    <View key={idx} style={s.chip}>
                      <Text style={s.chipText}>{m}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.divider} />
              </>
            )}

            {/* Tags */}
            {craft.tags && craft.tags.length > 0 && (
              <>
                <Text style={s.sectionTitle}>Tags</Text>
                <View style={s.chipContainer}>
                  {craft.tags.map((t: string, idx: number) => (
                    <View key={idx} style={[s.chip, s.tagChip]}>
                      <Text style={s.chipText}>{t}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.divider} />
              </>
            )}

            {/* Artist Info */}
            {craft.artistId && (
              <TouchableOpacity
                style={s.artistCard}
                onPress={() => router.push(`/tourist/artists/${craft.artistId}`)}>
                <View style={s.artistAvatar}>
                  <Text style={s.artistInitials}>{craft.artistName?.charAt(0) || 'A'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.artistName}>{craft.artistName || 'Unknown Artist'}</Text>
                  <Text style={s.artistCraft}>{craft.category}</Text>
                </View>
                <View style={s.artistRating}>
                  <Star size={12} color="#C9A227" fill="#C9A227" />
                  <Text style={s.artistRatingText}> {craft.rating?.toFixed(1) || '–'}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Book Button */}
        <View style={s.footer}>
          <TouchableOpacity style={s.bookBtn} onPress={handleBookWorkshop}>
            <Text style={s.bookBtnText}>Book Workshop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F3EE' },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#6B7280', marginBottom: 12 },
  backLink: { fontSize: 15, color: '#2F5D50', fontWeight: '600' },
  imageContainer: { width: '100%', height: 280 },
  mainImage: { width, height: 280, resizeMode: 'cover' },
  imagePlaceholder: { width: '100%', height: 280, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3, zIndex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E1E1E', marginBottom: 8 },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  categoryText: { fontSize: 13, fontWeight: '600', color: '#2F5D50' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 8 },
  price: { fontSize: 22, fontWeight: '800', color: '#2F5D50' },
  outOfStockBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  outOfStockText: { fontSize: 11, fontWeight: '600', color: '#DC2626' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 12 },
  description: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  detailsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  detailItem: { flex: 1, backgroundColor: '#F6F3EE', borderRadius: 12, padding: 14, alignItems: 'center' },
  detailValue: { fontSize: 16, fontWeight: '700', color: '#2F5D50' },
  detailLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4, marginBottom: 12 },
  chip: { backgroundColor: '#E8F5E9', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  tagChip: { backgroundColor: '#E0E7FF' },
  chipText: { fontSize: 13, color: '#1E1E1E', fontWeight: '500' },
  artistCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F0F0F0', marginTop: 4 },
  artistAvatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#2F5D50', alignItems: 'center', justifyContent: 'center' },
  artistInitials: { fontSize: 18, fontWeight: '800', color: '#fff' },
  artistName: { fontSize: 14, fontWeight: '700', color: '#1E1E1E' },
  artistCraft: { fontSize: 12, color: '#9CA3AF' },
  artistRating: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
  artistRatingText: { fontSize: 12, color: '#1E1E1E', fontWeight: '600' },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  bookBtn: { backgroundColor: '#C65D3B', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
