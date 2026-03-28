import { collection, addDoc } from 'firebase/firestore';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { AlertCircle, Sparkles, Lightbulb } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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

const OPENAI_API_KEY = '';

const QUICK_PICK_DESIGNS = [
  'A minimalist Scandinavian wooden chair with light oak finish and curved backrest',
  'Modern velvet sofa in navy blue with gold metal legs and tufted cushions',
  'Industrial coffee table with reclaimed wood top and black metal frame',
  'Contemporary queen bed with upholstered grey headboard and built-in side tables',
  'Mid-century modern dining table with walnut wood and tapered legs',
  'Luxury leather armchair in cognac brown with brass nailhead trim',
  'Floating TV console in matte white with hidden storage compartments',
  'Rustic farmhouse bookshelf with distressed wood and iron brackets',
];

async function generateFurnitureImage(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: `Generate a high-quality, realistic product image of furniture matching this description: ${prompt}. The style should look professional, ready for ecommerce display, on a plain white or neutral background. The furniture should be the main focus with excellent lighting.`,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate image');
  }

  const data = await response.json();
  return data.data[0].url;
}

export default function AIDesignerScreen() {
  const [prompt, setPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please describe your furniture idea');
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateFurnitureImage(prompt);
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Error', 'Failed to generate furniture image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToOrder = () => {
    if (!generatedImageUrl) return;

    addItem({
      id: `ai-${Date.now()}`,
      name: 'Custom AI Design',
      description: prompt,
      imageUrl: generatedImageUrl,
      isAiGenerated: true,
      aiPrompt: prompt,
    });

    Alert.alert('Success', 'Added to your order!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleReport = () => {
    Alert.alert(
      'Report AI Image',
      'This will report the generated image for review. Our team will investigate any inappropriate or inaccurate content.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: async () => {
            try {
              const report = {
                imageUrl: generatedImageUrl,
                prompt,
                timestamp: Date.now(),
                createdAt: new Date().toISOString(),
              };
              await addDoc(collection(db, 'reports'), report);
              console.log('Image reported:', generatedImageUrl);
              Alert.alert('Thank you', 'Your report has been submitted.');
            } catch (error) {
              console.error('Error submitting report:', error);
              Alert.alert('Error', 'Failed to submit report. Please try again.');
            }
          },
        },
      ]
    );
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
          <Sparkles color={Colors.light.primary} size={32} />
          <Text style={styles.title}>Describe Your Furniture</Text>
          <Text style={styles.subtitle}>
            Be as detailed as possible. Include style, materials, colors, and features.
          </Text>
        </View>

        <View style={styles.quickPickSection}>
          <View style={styles.quickPickHeader}>
            <Lightbulb color={Colors.light.primary} size={20} />
            <Text style={styles.quickPickTitle}>Quick Pick Designs</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPickScroll}
          >
            {QUICK_PICK_DESIGNS.map((design, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickPickChip}
                onPress={() => setPrompt(design)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickPickChipText} numberOfLines={2}>
                  {design}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g., 'A modern wooden coffee table with black metal legs and a glass top'"
            placeholderTextColor={Colors.light.text + '80'}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.generateButtonText}>Generating...</Text>
            </>
          ) : (
            <>
              <Sparkles color="#FFFFFF" size={20} />
              <Text style={styles.generateButtonText}>Generate Preview</Text>
            </>
          )}
        </TouchableOpacity>

        {generatedImageUrl && (
          <View style={styles.resultContainer}>
            <View style={styles.disclaimerBox}>
              <AlertCircle color={Colors.light.primary} size={20} />
              <Text style={styles.disclaimerText}>
                This image was generated by AI and may not be 100% accurate. Final product may vary.
              </Text>
            </View>

            <View style={styles.imageCard}>
              <Image source={{ uri: generatedImageUrl }} style={styles.generatedImage} contentFit="cover" />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.reportButton} onPress={handleReport} activeOpacity={0.8}>
                <AlertCircle color={Colors.light.error} size={20} />
                <Text style={styles.reportButtonText}>Report Image</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addButton} onPress={handleAddToOrder} activeOpacity={0.8}>
                <Text style={styles.addButtonText}>Add to My Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    alignItems: 'center' as const,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  quickPickSection: {
    marginBottom: 24,
  },
  quickPickHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 12,
  },
  quickPickTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  quickPickScroll: {
    paddingRight: 24,
  },
  quickPickChip: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    maxWidth: 240,
    minWidth: 180,
  },
  quickPickChipText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  generateButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  resultContainer: {
    marginTop: 32,
  },
  disclaimerBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.light.accent + '20',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  imageCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  generatedImage: {
    width: '100%',
    height: 320,
    backgroundColor: Colors.light.border,
  },
  actions: {
    gap: 12,
  },
  reportButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.light.error,
    borderRadius: 12,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
