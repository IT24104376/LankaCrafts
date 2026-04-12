// Cart Screen for Mobile App

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

// Mock cart data - in a real app, use a context/state
const MOCK_CART_ITEMS = [
  {
    id: '1',
    craftId: 'c1',
    name: 'Batik Table Runner',
    price: 4500,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    artistName: 'Kamala Wijesinghe',
  },
  {
    id: '2',
    craftId: 'c2',
    name: 'Traditional Pottery Vase',
    price: 2500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=200',
    artistName: 'Rohan De Silva',
  },
];

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setCartItems(cartItems.filter(item => item.id !== id))
        },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Proceed to Checkout',
      `Total: Rs. ${totalAmount.toLocaleString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue to Payment',
          onPress: () => {
            // Navigate to payment
            Alert.alert('Payment', 'Redirecting to payment gateway...');
          }
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: typeof MOCK_CART_ITEMS[0] }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemArtist}>by {item.artistName}</Text>
        <Text style={styles.itemPrice}>Rs. {item.price.toLocaleString()}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
          <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Browse our crafts and add items to your cart
        </Text>
        <TouchableOpacity 
          style={styles.browseButton}
          onPress={() => router.push('/shop')}
        >
          <Text style={styles.browseButtonText}>Browse Crafts</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart ({itemCount} items)</Text>
      
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>Rs. {totalAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Calculated at checkout</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rs. {totalAmount.toLocaleString()}</Text>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', padding: 20 },
  listContainer: { paddingHorizontal: 16 },
  cartItem: { 
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 
  },
  itemImage: { width: 100, height: 100, borderRadius: 8 },
  itemInfo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemArtist: { fontSize: 12, color: '#666', marginTop: 4 },
  itemPrice: { fontSize: 16, color: '#4F46E5', fontWeight: 'bold', marginTop: 8 },
  quantityContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityText: { fontSize: 14, color: '#666' },
  removeText: { color: '#dc2626', fontSize: 14 },
  summaryContainer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, color: '#333' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#4F46E5' },
  checkoutButton: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  browseButton: { backgroundColor: '#4F46E5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  browseButtonText: { color: '#fff', fontWeight: '600' },
});