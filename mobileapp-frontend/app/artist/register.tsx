// Artist Registration Screen for Mobile App

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { artistApi } from '../../src/services/api';
import { CRAFT_CATEGORIES, PROVINCES } from '../../src/types';

export default function ArtistRegister() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  // Form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: Personal
    fullName: '',
    callingName: '',
    phone: '',
    craftType: '',
    bio: '',
    // Step 3: Location
    city: '',
    district: '',
    province: '',
    village: '',
    street: '',
    number: '',
    postalCode: '',
    // Step 4: Specialties
    specialties: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!formData.email.includes('@')) {
          Alert.alert('Error', 'Please enter a valid email');
          return false;
        }
        if (formData.password.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return false;
        }
        return true;
      case 2:
        if (!formData.fullName.trim()) {
          Alert.alert('Error', 'Full name is required');
          return false;
        }
        if (!formData.craftType) {
          Alert.alert('Error', 'Please select a craft type');
          return false;
        }
        return true;
      case 3:
        if (!formData.city.trim()) {
          Alert.alert('Error', 'City is required');
          return false;
        }
        if (!formData.district.trim()) {
          Alert.alert('Error', 'District is required');
          return false;
        }
        if (!formData.province) {
          Alert.alert('Error', 'Please select a province');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Step 1: Create Firebase account
      await register(formData.email, formData.password, 'artist');
      
      // Step 2: Create artist profile in backend
      await artistApi.register({
        fullName: formData.fullName,
        callingName: formData.callingName || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        craftType: formData.craftType,
        bio: formData.bio || undefined,
        address: {
          number: formData.number || undefined,
          street: formData.street || undefined,
          village: formData.village || undefined,
          city: formData.city,
          district: formData.district,
          province: formData.province,
          postalCode: formData.postalCode || undefined,
        },
        specialties: formData.specialties.length > 0 ? formData.specialties : undefined,
      });

      Alert.alert(
        'Success!',
        'Your artisan account has been created.',
        [{ text: 'OK', onPress: () => router.replace('/artist/dashboard') }]
      );
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((s) => (
        <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]}>
          <Text style={[styles.stepText, step >= s && styles.stepTextActive]}>{s}</Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.sectionTitle}>Account Details</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(v) => updateFormData('email', v)}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(v) => updateFormData('password', v)}
          placeholder="Min 6 characters"
          secureTextEntry={!showPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(v) => updateFormData('confirmPassword', v)}
          placeholder="Re-enter password"
          secureTextEntry={!showPassword}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.fullName}
          onChangeText={(v) => updateFormData('fullName', v)}
          placeholder="As per ID"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Calling Name</Text>
        <TextInput
          style={styles.input}
          value={formData.callingName}
          onChangeText={(v) => updateFormData('callingName', v)}
          placeholder="Preferred name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(v) => updateFormData('phone', v)}
          placeholder="+94 77 123 4567"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Craft Type *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {CRAFT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, formData.craftType === cat && styles.chipSelected]}
              onPress={() => updateFormData('craftType', cat)}
            >
              <Text style={[styles.chipText, formData.craftType === cat && styles.chipTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.bio}
          onChangeText={(v) => updateFormData('bio', v)}
          placeholder="Tell us about yourself and your craft..."
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.sectionTitle}>Location</Text>
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Province *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {PROVINCES.map((prov) => (
              <TouchableOpacity
                key={prov}
                style={[styles.chip, formData.province === prov && styles.chipSelected]}
                onPress={() => updateFormData('province', prov)}
              >
                <Text style={[styles.chipText, formData.province === prov && styles.chipTextSelected]}>
                  {prov}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>District *</Text>
          <TextInput
            style={styles.input}
            value={formData.district}
            onChangeText={(v) => updateFormData('district', v)}
            placeholder="e.g., Kandy"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(v) => updateFormData('city', v)}
            placeholder="e.g., Kandy"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Village</Text>
          <TextInput
            style={styles.input}
            value={formData.village}
            onChangeText={(v) => updateFormData('village', v)}
            placeholder="Village name"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Street</Text>
          <TextInput
            style={styles.input}
            value={formData.street}
            onChangeText={(v) => updateFormData('street', v)}
            placeholder="Street name"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Number</Text>
          <TextInput
            style={styles.input}
            value={formData.number}
            onChangeText={(v) => updateFormData('number', v)}
            placeholder="House No."
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            style={styles.input}
            value={formData.postalCode}
            onChangeText={(v) => updateFormData('postalCode', v)}
            placeholder="20000"
            keyboardType="number-pad"
          />
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.sectionTitle}>Specialties (Optional)</Text>
      <Text style={styles.helperText}>
        Select the techniques or styles you're best known for
      </Text>
      <View style={styles.specialtiesContainer}>
        {[
          'Traditional', 'Modern', 'Hand-painted', 'Wood-carved', 
          'Natural Dyes', 'Ancient Techniques', 'Custom Orders', 'Bulk Orders'
        ].map((spec) => (
          <TouchableOpacity
            key={spec}
            style={[
              styles.specialtyChip, 
              formData.specialties.includes(spec) && styles.specialtyChipSelected
            ]}
            onPress={() => {
              const newSpecs = formData.specialties.includes(spec)
                ? formData.specialties.filter(s => s !== spec)
                : [...formData.specialties, spec];
              updateFormData('specialties', newSpecs);
            }}
          >
            <Text style={[
              styles.specialtyText,
              formData.specialties.includes(spec) && styles.specialtyTextSelected
            ]}>
              {spec}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Join as an Artisan</Text>
        {renderStepIndicator()}
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          {step < 4 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/artist/login')}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 24, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 24, textAlign: 'center' },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginHorizontal: 4 },
  stepDotActive: { backgroundColor: '#4F46E5' },
  stepText: { color: '#999', fontSize: 14 },
  stepTextActive: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#e0e0e0' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0' },
  chipSelected: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  chipText: { fontSize: 14, color: '#666' },
  chipTextSelected: { color: '#fff' },
  helperText: { fontSize: 14, color: '#666', marginBottom: 16 },
  specialtiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specialtyChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0' },
  specialtyChipSelected: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  specialtyText: { fontSize: 14, color: '#666' },
  specialtyTextSelected: { color: '#fff' },
  buttonContainer: { flexDirection: 'row', marginTop: 32, gap: 12 },
  backButton: { flex: 1, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  backButtonText: { fontSize: 16, color: '#666', fontWeight: '600' },
  nextButton: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: '#4F46E5', alignItems: 'center' },
  nextButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  submitButton: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: '#4F46E5', alignItems: 'center' },
  submitButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  buttonDisabled: { opacity: 0.7 },
  loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginText: { color: '#666', fontSize: 14 },
  loginLinkText: { color: '#4F46E5', fontSize: 14, fontWeight: '600' },
});