import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '@/constants/colors';
import { furnitureData } from '@/mocks/furniture';
import { useCartStore } from '@/store/cartStore';
import { FurnitureCategory } from '@/types/furniture';

export default function CategoryScreen() {
  const { type } = useLocalSearchParams<{ type: FurnitureCategory }>();
  const addItem = useCartStore((state) => state.addItem);

  const items = furnitureData.filter((item) => item.category === type);

  const handleAddToOrder = (item: typeof items[0]) => {
    addItem({
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      isAiGenerated: false,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.itemImage}
              contentFit="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToOrder(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>Add to Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
    height: 240,
    backgroundColor: Colors.light.border,
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 15,
    color: Colors.light.text,
    opacity: 0.7,
    lineHeight: 22,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center' as const,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
