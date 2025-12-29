import { collection, addDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { db } from '@/lib/firebase';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutScreen() {
  const { items, clearCart } = useCartStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmitOrder = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const order = {
      items,
      customerInfo: {
        fullName,
        email,
        phone,
        address,
      },
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
    };

    console.log('Order submitted:', order);

    try {
      await addDoc(collection(db, 'orders'), order);
      console.log('Order saved to Firebase');
      clearCart();
      router.replace('/confirmation');
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert('Error', 'Failed to submit order. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Contact Information</Text>
          <Text style={styles.subtitle}>
            We&apos;ll contact you when your furniture is ready for payment and delivery
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={Colors.light.text + '80'}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor={Colors.light.text + '80'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+1 234 567 8900"
              placeholderTextColor={Colors.light.text + '80'}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Delivery Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="123 Main St, City, State, ZIP"
              placeholderTextColor={Colors.light.text + '80'}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items</Text>
            <Text style={styles.summaryValue}>{items.length}</Text>
          </View>
          <View style={styles.paymentNote}>
            <Check color={Colors.light.success} size={20} />
            <Text style={styles.paymentNoteText}>
              Payment will be collected after your furniture is built and ready for delivery
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.text,
    opacity: 0.7,
    lineHeight: 22,
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 80,
  },
  orderSummary: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  paymentNote: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    backgroundColor: Colors.light.success + '15',
    padding: 12,
    borderRadius: 8,
  },
  paymentNoteText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
