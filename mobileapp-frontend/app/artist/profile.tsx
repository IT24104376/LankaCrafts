// Artist Profile Screen for Mobile App

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { artistApi } from '../../src/services/api';
import type { Artist } from '../../src/types';

export default function ArtistProfile() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Artist>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await artistApi.getProfile();
      setProfile(data.artist);
      setEditData(data.artist);
    } catch (err) {
      console.error('[Profile] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await artistApi.updateProfile(editData);
      setProfile(editData as Artist);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profile?.profilePicUrl ? (
            <Image source={{ uri: profile.profilePicUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {profile?.initials || profile?.fullName?.[0] || 'A'}
              </Text>
            </View>
          )}
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.name}>{profile?.fullName}</Text>
        <Text style={styles.craftType}>{profile?.craftType}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            {profile?.rating?.toFixed(1) || '0.0'} ★
          </Text>
          <Text style={styles.reviewCount}>
            ({profile?.reviewCount || 0} reviews)
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.infoCard}>
          {isEditing ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput 
                  style={styles.input} 
                  value={editData.email} 
                  onChangeText={(v) => setEditData({...editData, email: v})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput 
                  style={styles.input} 
                  value={editData.phone || ''} 
                  onChangeText={(v) => setEditData({...editData, phone: v})}
                  keyboardType="phone-pad"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profile?.phone || 'Not provided'}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Bio */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
        </View>
        {isEditing ? (
          <View style={styles.inputGroup}>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={editData.bio || ''} 
              onChangeText={(v) => setEditData({...editData, bio: v})}
              placeholder="Tell us about yourself..."
              multiline
            />
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.bioText}>
              {profile?.bio || 'No bio provided yet.'}
            </Text>
          </View>
        )}
      </View>

      {/* Location */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Location</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.locationText}>
            {profile?.address?.village ? `${profile.address.village}, ` : ''}
            {profile?.address?.city}, {profile?.address?.district}
          </Text>
          <Text style={styles.provinceText}>{profile?.address?.province}</Text>
        </View>
      </View>

      {/* Specialties */}
      {profile?.specialties && profile.specialties.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Specialties</Text>
          </View>
          <View style={styles.specialtiesContainer}>
            {profile.specialties.map((spec, index) => (
              <View key={index} style={styles.specialtyChip}>
                <Text style={styles.specialtyText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <View style={styles.editButtons}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => {
              setIsEditing(false);
              setEditData(profile || {});
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Navigate to Crafts Management */}
      <TouchableOpacity 
        style={styles.manageButton}
        onPress={() => router.push('/shop/my-crafts')}
      >
        <Text style={styles.manageButtonText}>Manage My Products</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#4F46E5', padding: 24, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  changePhotoButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  changePhotoText: { fontSize: 12, color: '#4F46E5' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  craftType: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 16, color: '#fff', fontWeight: '600' },
  reviewCount: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginLeft: 4 },
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  editButton: { color: '#4F46E5', fontSize: 14, fontWeight: '600' },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  infoRow: { marginBottom: 12 },
  infoLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#333' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  bioText: { fontSize: 14, color: '#333', lineHeight: 22 },
  locationText: { fontSize: 16, color: '#333', marginBottom: 4 },
  provinceText: { fontSize: 14, color: '#666' },
  specialtiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specialtyChip: { backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  specialtyText: { color: '#fff', fontSize: 14 },
  editButtons: { flexDirection: 'row', paddingHorizontal: 20, gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  cancelButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
  saveButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#4F46E5', alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  manageButton: { margin: 20, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#4F46E5' },
  manageButtonText: { color: '#4F46E5', fontSize: 16, fontWeight: '600' },
});