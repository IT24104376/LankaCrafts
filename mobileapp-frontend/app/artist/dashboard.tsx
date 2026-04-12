// Artist Dashboard Screen for Mobile App

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { artistApi, myCraftsApi } from '../../src/services/api';
import type { Artist, Craft } from '../../src/types';

export default function ArtistDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [profile, setProfile] = useState<Artist | null>(null);
  const [crafts, setCrafts] = useState<Craft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileData = await artistApi.getProfile();
      setProfile(profileData.artist);
      
      // Fetch crafts
      const craftsData = await myCraftsApi.getAll();
      setCrafts(craftsData.crafts || []);
    } catch (err: any) {
      console.error('[Dashboard] Error:', err);
      // If unauthorized, might need to re-login
      if (err.response?.status === 401) {
        Alert.alert('Session Expired', 'Please log in again.');
        router.replace('/artist/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/artist/login');
          }
        },
      ]
    );
  };

  const renderCraftItem = ({ item }: { item: Craft }) => (
    <TouchableOpacity 
      style={styles.craftCard}
      onPress={() => router.push(`/shop/craft/${item._id}`)}
    >
      <Image 
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} 
        style={styles.craftImage}
      />
      <View style={styles.craftInfo}>
        <Text style={styles.craftName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.craftPrice}>Rs. {item.price.toLocaleString()}</Text>
        <View style={[styles.stockBadge, !item.isAvailable && styles.outOfStock]}>
          <Text style={styles.stockText}>
            {item.isAvailable ? `In Stock (${item.stock})` : 'Out of Stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Welcome, {profile?.callingName || profile?.fullName || 'Artisan'}!
          </Text>
          <Text style={styles.subtitle}>{profile?.craftType || 'Craftsman'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/artist/profile')}>
          {profile?.profilePicUrl ? (
            <Image source={{ uri: profile.profilePicUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {profile?.initials || profile?.fullName?.[0] || 'A'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{crafts.length}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.rating?.toFixed(1) || '0.0'}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.reviewCount || 0}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/shop/crafts/add')}
        >
          <Text style={styles.actionIcon}>+</Text>
          <Text style={styles.actionText}>Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/artist/profile/edit')}
        >
          <Text style={styles.actionIcon}>✎</Text>
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/artist/orders')}
        >
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionText}>Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Products</Text>
          <TouchableOpacity onPress={() => router.push('/shop/my-crafts')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {crafts.length > 0 ? (
          <FlatList
            data={crafts.slice(0, 4)}
            renderItem={renderCraftItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.craftsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products yet</Text>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => router.push('/shop/crafts/add')}
            >
              <Text style={styles.addFirstText}>Add Your First Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4F46E5',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  profileButton: { marginLeft: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },
  avatarPlaceholder: { 
    width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.3)', 
    justifyContent: 'center', alignItems: 'center' 
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  statsContainer: { 
    flexDirection: 'row', justifyContent: 'space-around', marginTop: -20, marginHorizontal: 20 
  },
  statCard: { 
    backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  actionsContainer: { 
    flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, marginHorizontal: 20 
  },
  actionButton: { 
    backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', width: 100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 
  },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionText: { fontSize: 12, color: '#666', textAlign: 'center' },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  seeAllText: { color: '#4F46E5', fontSize: 14 },
  craftsList: { paddingRight: 20 },
  craftCard: { 
    backgroundColor: '#fff', borderRadius: 12, marginRight: 12, width: 150, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 
  },
  craftImage: { width: '100%', height: 100, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  craftInfo: { padding: 12 },
  craftName: { fontSize: 14, fontWeight: '600', color: '#333' },
  craftPrice: { fontSize: 14, color: '#4F46E5', fontWeight: 'bold', marginTop: 4 },
  stockBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 8, alignSelf: 'flex-start' },
  outOfStock: { backgroundColor: '#fee2e2' },
  stockText: { fontSize: 10, color: '#333' },
  emptyState: { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
  addFirstButton: { marginTop: 16, backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  addFirstText: { color: '#fff', fontWeight: '600' },
  logoutButton: { margin: 20, padding: 16, alignItems: 'center' },
  logoutText: { color: '#dc2626', fontSize: 16, fontWeight: '600' },
});