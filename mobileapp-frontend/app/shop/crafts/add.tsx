// Add/Edit Craft Screen for Mobile App - Artist Product Management

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { myCraftsApi } from '../../../src/services/api';
import { CRAFT_CATEGORIES } from '../../../src/types';

export default function AddCraft() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '1',
    isAvailable: true,
    images: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== indexToRemove) }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await myCraftsApi.create({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 1,
        isAvailable: formData.isAvailable,
        images: formData.images.length > 0 ? formData.images : ['https://via.placeholder.com/200'],
      });

      Alert.alert(
        'Success!',
        'Your product has been added.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock image picker - in a real app, use expo-image-picker
  const handleAddImage = () => {
    Alert.alert(
      'Add Image',
      'In a real app, this would open the image picker',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Add New Product</Text>

      {/* Image Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Images</Text>
        <View style={styles.imagesContainer}>
          {formData.images.length > 0 ? (
            formData.images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>X</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
              <Text style={styles.addImageText}>+</Text>
              <Text style={styles.addImageLabel}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(v) => updateField('name', v)}
            placeholder="e.g., Batik Table Runner"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(v) => updateField('description', v)}
            placeholder="Describe your product..."
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesRow}>
            {CRAFT_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, formData.category === cat && styles.categoryChipSelected]}
                onPress={() => updateField('category', cat)}
              >
                <Text style={[styles.categoryText, formData.category === cat && styles.categoryTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Pricing & Stock */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing & Stock</Text>
        
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Price (LKR) *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(v) => updateField('price', v)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput
              style={styles.input}
              value={formData.stock}
              onChangeText={(v) => updateField('stock', v)}
              placeholder="1"
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>

      {/* Availability */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <TouchableOpacity
          style={[styles.toggleButton, formData.isAvailable && styles.toggleButtonActive]}
          onPress={() => updateField('isAvailable', !formData.isAvailable)}
        >
          <Text style={[styles.toggleText, formData.isAvailable && styles.toggleTextActive]}>
            {formData.isAvailable ? 'Available for Sale' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Add Product</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  imagesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  imageWrapper: { position: 'relative' },
  imagePreview: { width: 100, height: 100, borderRadius: 12 },
  removeImageButton: { position: 'absolute', top: -8, right: -8, backgroundColor: '#dc2626', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  removeImageText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  addImageButton: { width: 100, height: 100, borderRadius: 12, borderWidth: 2, borderColor: '#e0e0e0', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addImageText: { fontSize: 32, color: '#999' },
  addImageLabel: { fontSize: 12, color: '#999', marginTop: 4 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#e0e0e0' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  categoriesRow: { flexDirection: 'row', gap: 8 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0' },
  categoryChipSelected: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  categoryText: { fontSize: 14, color: '#666' },
  categoryTextSelected: { color: '#fff' },
  toggleButton: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  toggleButtonActive: { backgroundColor: '#d1fae5', borderColor: '#059669' },
  toggleText: { fontSize: 16, color: '#666' },
  toggleTextActive: { color: '#059669', fontWeight: '600' },
  submitButton: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: { paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  cancelButtonText: { color: '#666', fontSize: 16 },
});