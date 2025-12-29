import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCartStore } from '@/store/cartStore';
import Colors from '@/constants/colors';
import { categories } from '@/mocks/furniture';

export default function HomeScreen() {
  const cartItems = useCartStore((state) => state.items);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5A3C', '#C89F7E', '#FAFAF8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>FurniCraft</Text>
            <Text style={styles.subtitle}>Custom Furniture at Your Fingertips</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => router.push(`/category?type=${category.id}`)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.aiSection}>
            <View style={styles.aiCard}>
              <LinearGradient
                colors={['#8B5A3C', '#6B4A2C']}
                style={styles.aiGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.aiContent}>
                <View style={styles.aiHeader}>
                  <Sparkles color="#FFFFFF" size={32} />
                  <Text style={styles.aiTitle}>AI Design Assistant</Text>
                </View>
                <Text style={styles.aiDescription}>
                  Describe your dream furniture and watch our AI bring it to life
                </Text>
                <TouchableOpacity
                  style={styles.aiButton}
                  onPress={() => router.push('/ai-designer')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.aiButtonText}>Start Designing</Text>
                  <Sparkles color="#8B5A3C" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {cartItems.length > 0 && (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => router.push('/cart')}
              activeOpacity={0.8}
            >
              <Text style={styles.cartButtonText}>
                View Order ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  gradient: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    height: 400,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  aiSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  aiCard: {
    borderRadius: 24,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  aiGradient: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  aiContent: {
    padding: 24,
  },
  aiHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
    gap: 12,
  },
  aiTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  aiDescription: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
    lineHeight: 22,
  },
  aiButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
  aiButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#8B5A3C',
  },
  cartButton: {
    marginHorizontal: 24,
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
  cartButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
