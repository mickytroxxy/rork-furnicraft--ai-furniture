import { router, Stack } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <AlertCircle color={Colors.light.primary} size={64} />
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.message}>This screen doesn&apos;t exist.</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 32,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
