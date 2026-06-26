import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { auth } from '../../src/config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { BatikBackground } from '../../src/components/BatikBackground';
import Svg, { Ellipse, Circle as SvgCircle } from 'react-native-svg';

/** Map Firebase Auth error codes to user-friendly messages */
const getFirebaseErrorMessage = (err: any): string => {
  const code = err?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
  }
};

export default function TouristLoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first, then tap "Forgot Password".');
      setSuccess('');
      return;
    }
    try {
      setError('');
      setSuccess('');
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait before trying again.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/tourist/(tabs)/dashboard');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <BatikBackground>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Back button */}
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <ArrowLeft size={20} color="#C65D3B" />
              <Text style={s.backText}>Back</Text>
            </TouchableOpacity>

            {/* Card */}
            <View style={s.card}>
              {/* Logo */}
              <View style={s.logoArea}>
                <View style={s.logoRow}>
                  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                    <Ellipse cx="16" cy="8" rx="4" ry="7" fill="#C65D3B" opacity={0.9} />
                    <Ellipse cx="24" cy="16" rx="7" ry="4" fill="#C65D3B" opacity={0.75} />
                    <Ellipse cx="16" cy="24" rx="4" ry="7" fill="#C65D3B" opacity={0.6} />
                    <Ellipse cx="8" cy="16" rx="7" ry="4" fill="#C65D3B" opacity={0.75} />
                    <SvgCircle cx="16" cy="16" r="3.5" fill="#C65D3B" />
                  </Svg>
                  <Text style={s.logoText}>Lanka Crafts</Text>
                </View>
                <Text style={s.logoSub}>Discover. Experience. Share Sri Lanka.</Text>
              </View>

              <View style={s.divider} />

              <Text style={s.title}>Welcome Back</Text>
              <Text style={s.subtitle}>Sign in to continue your cultural journey</Text>

              {error ? (
                <View style={s.errorBox}>
                  <Text style={s.errorText}>{error}</Text>
                </View>
              ) : null}

              {success ? (
                <View style={s.successBox}>
                  <Text style={s.successText}>{success}</Text>
                </View>
              ) : null}

              {/* Email */}
              <View style={s.field}>
                <Text style={s.label}>Email Address</Text>
                <View style={s.inputWrap}>
                  <Mail size={18} color="#9CA3AF" style={s.icon} />
                  <TextInput
                    style={s.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#C0C0C0"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={s.field}>
                <Text style={s.label}>Password</Text>
                <View style={s.inputWrap}>
                  <Lock size={18} color="#9CA3AF" style={s.icon} />
                  <TextInput
                    style={[s.input, { paddingRight: 44 }]}
                    placeholder="••••••••"
                    placeholderTextColor="#C0C0C0"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <View style={s.forgotRow}>
                <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
                  <Text style={s.forgotText}>{resetSent ? 'Resend Reset Email' : 'Forgot Password?'}</Text>
                </TouchableOpacity>
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={[s.submitBtn, { opacity: loading ? 0.6 : 1 }]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.submitText}>Login</Text>}
              </TouchableOpacity>

              {/* Links */}
              <View style={s.linksRow}>
                <Text style={s.linkGray}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/tourist/register')}>
                  <Text style={s.linkOrange}>Register here</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ marginTop: 8, alignSelf: 'center' }} onPress={() => router.push('/')}>
                <Text style={s.linkOrange}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BatikBackground>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '600', color: '#C65D3B' },
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8,
  },
  logoArea: { alignItems: 'center', marginBottom: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  logoText: { fontSize: 22, fontWeight: '800', color: '#C65D3B' },
  logoSub: { fontSize: 12, color: '#9CA3AF', letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E1E1E', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#9CA3AF', marginBottom: 20 },
  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 16 },
  successBox: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#86EFAC', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 16 },
  errorText: { fontSize: 13, color: '#DC2626' },
  successText: { fontSize: 13, color: '#166534' },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#1E1E1E', marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, backgroundColor: '#fff' },
  icon: { marginLeft: 14 },
  input: { flex: 1, paddingVertical: 13, paddingHorizontal: 12, fontSize: 14, color: '#1E1E1E' },
  eyeBtn: { position: 'absolute', right: 14, top: '50%', transform: [{ translateY: -9 }] },
  forgotRow: { alignItems: 'center', marginBottom: 16 },
  forgotText: { fontSize: 13, fontWeight: '600', color: '#C65D3B' },
  submitBtn: { backgroundColor: '#C65D3B', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  submitText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  linksRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkGray: { fontSize: 13, color: '#9CA3AF' },
  linkOrange: { fontSize: 13, fontWeight: '700', color: '#C65D3B' },
});
