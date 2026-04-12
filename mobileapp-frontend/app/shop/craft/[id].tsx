// Craft Detail Screen with Add to Cart for Mobile App

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { craftsApi, paymentsApi } from '../../../src/services/api';
import { useAuth } from '../../../src/context/AuthContext';
import type { Craft } from '../../../src/types';

const { width } = Dimensions.get('window');

export default function CraftDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const [craft, setCraft] = useState<Craft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCraft();
    }
  }, [id]);

  const fetchCraft = async () => {
    try {
      const data = await craftsApi.getById(id!);
      setCraft(data.craft);
    } catch (err) {
      console.error('[CraftDetail] Error:', err);
      Alert.alert('Error', 'Failed to load craft details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    // In a real app, this would add to a cart store/context
    Alert.alert(
      'Added to Cart',
      `${quantity} x ${craft?.name} added to your cart`,
      [
        { text: 'Continue Shopping', onPress: () => router.back() },
        { text: 'View Cart', onPress: () => router.push('/cart') },
      ]
    );
  };

  const handleBuyNow = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to purchase',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/tourist/login') },
        ]
      );
      return;
    }

    if (!craft) return;

    setIsProcessingPayment(true);
    try {
      // Create payment link
      const paymentData = await paymentsApi.createPaymentLink({
        orderId: `ORD-${Date.now()}`,
        amount: craft.price * quantity,
        currency: 'LKR',
        items: `${quantity}x ${craft.name}`,
        customerName: user.profile?.fullName || 'Customer',
        email: user.email || '',
        phone: user.profile?.phone || '',
      });

      // Open PayHere checkout in browser
      if (paymentData.paymentUrl) {
        Alert.alert(
          'Proceed to Payment',
          'You will be redirected to PayHere to complete your payment.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Continue', 
              onPress: () => {
                // In a real app, use WebBrowser to open the payment URL
                Alert.alert('Payment Link', `Payment URL: ${paymentData.paymentUrl}`);
              }
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Payment Error', err.message || 'Failed to create payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!craft) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Craft not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.imageContainer}
        >
          {craft.images && craft.images.length > 0 ? (
            craft.images.map((img: string, index: number) => (
              <Image 
                key={index} 
                source={{ uri: img }} 
                style={styles.image}
                resizeMode="cover"
              />
            ))
          ) : (
            <Image 
              source={{ uri: 'https://via.placeholder.com/400' }} 
              style={styles.image}
            />
          )}
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.header}>
            <Text style={styles.name}>{craft.name}</Text>
            <Text style={styles.price}>Rs. {craft.price.toLocaleString()}</Text>
          </View>

          {/* Artist Info */}
          <TouchableOpacity 
            style={styles.artistCard}
            onPress={() => router.push(`/artist/${craft.artistId}`)}
          >
            {craft.artistProfilePic ? (
              <Image source={{ uri: craft.artistProfilePic }} style={styles.artistImage} />
            ) : (
              <View style={styles.artistImagePlaceholder}>
                <Text style={styles.artistInitial}>
                  {craft.artistName?.[0] || 'A'}
                </Text>
              </View>
            )}
            <View style={styles.artistInfo}>
              <Text style={styles.artistLabel}>By Artist</Text>
              <Text style={styles.artistName}>{craft.artistName || 'Unknown'}</Text>
            </View>
          </TouchableOpacity>

          {/* Stock Status */}
          <View style={[styles.stockBadge, !craft.isAvailable && styles.outOfStock]}>
            <Text style={[styles.stockText, !craft.isAvailable && styles.outOfStockText]}>
              {craft.isAvailable 
                ? `In Stock (${craft.stock} available)` 
                : 'Out of Stock'
              }
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {craft.description || 'No description available.'}
            </Text>
          </View>

          {/* Dimensions */}
          {craft.dimensions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dimensions</Text>
              <Text style={styles.dimensions}>
                {craft.dimensions.height && `Height: ${craft.dimensions.height} ${craft.dimensions.unit || 'cm'} `}
                {craft.dimensions.width && `Width: ${craft.dimensions.width} ${craft.dimensions.unit || 'cm'} `}
                {craft.dimensions.depth && `Depth: ${craft.dimensions.depth} ${craft.dimensions.unit || 'cm'}`}
              </Text>
            </View>
          )}

          {/* Weight */}
          {craft.weight && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weight</Text>
              <Text style={styles.weight}>
                {craft.weight.value} {craft.weight.unit || 'g'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {craft.isAvailable && (
        <View style={styles.actionBar}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.min(craft.stock, quantity + 1))}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buyNowButton}
            onPress={handleBuyNow}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buyNowText}>Buy Now</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#666' },
  imageContainer: { height: 300 },
  image: { width: width, height: 300 },
  backButton: { position: 'absolute', top: 40, left: 16, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  backButtonText: { color: '#fff', fontSize: 14 },
  content: { padding: 20 },
  header: { marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  price: { fontSize: 28, color: '#4F46E5', fontWeight: 'bold' },
  artistCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 12, borderRadius: 12, marginBottom: 16 },
  artistImage: { width: 50, height: 50, borderRadius: 25 },
  artistImagePlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center' },
  artistInitial: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  artistInfo: { marginLeft: 12 },
  artistLabel: { fontSize: 12, color: '#666' },
  artistName: { fontSize: 16, fontWeight: '600', color: '#333' },
  stockBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginBottom: 16, alignSelf: 'flex-start' },
  outOfStock: { backgroundColor: '#fee2e2' },
  stockText: { fontSize: 14, color: '#059669' },
  outOfStockText: { color: '#dc2626' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },
  dimensions: { fontSize: 14, color: '#666' },
  weight: { fontSize: 14, color: '#666' },
  actionBar: { 
    flexDirection: 'row', alignItems: 'center', padding: 16, 
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e0e0e0',
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 
  },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 8, marginRight: 12 },
  quantityButton: { padding: 10 },
  quantityButtonText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  quantityText: { fontSize: 16, fontWeight: '600', color: '#333', paddingHorizontal: 16 },
  addToCartButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#4F46E5', marginRight: 8 },
  addToCartText: { color: '#4F46E5', fontWeight: '600' },
  buyNowButton: { flex: 1, backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buyNowText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});