import { Image } from 'expo-image';
import { router } from 'expo-router';
import { AlertCircle, ShoppingBag, Trash2 } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';

export default function CartScreen() {
  const { items, removeItem } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingBag color={Colors.light.text} size={64} opacity={0.3} />
        <Text style={styles.emptyTitle}>Your order is empty</Text>
        <Text style={styles.emptySubtitle}>Browse furniture or design with AI to get started</Text>
        <TouchableOpacity style={styles.browseButton} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.browseButtonText}>Browse Furniture</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} contentFit="cover" />
            <View style={styles.itemInfo}>
              <View style={styles.itemHeader}>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.isAiGenerated && (
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>AI Generated</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} activeOpacity={0.7}>
                  <Trash2 color={Colors.light.error} size={20} />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
              {item.isAiGenerated && (
                <View style={styles.aiWarning}>
                  <AlertCircle color={Colors.light.primary} size={16} />
                  <Text style={styles.aiWarningText}>AI-generated design - final product may vary</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items</Text>
          <Text style={styles.summaryValue}>{items.length}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>Payment will be collected after your furniture is built</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.light.text,
    opacity: 0.6,
    textAlign: 'center' as const,
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  itemCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.light.border,
  },
  itemInfo: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  itemTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  aiBadge: {
    backgroundColor: Colors.light.accent + '30',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start' as const,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    lineHeight: 20,
  },
  aiWarning: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  aiWarningText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    textAlign: 'center' as const,
    marginTop: 12,
  },
});
