// app/(tabs)/wAIs.jsx
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WAIsResult() {
  const { imageUri } = useLocalSearchParams();

  // Sample items detected in the redesigned room (you'll get this from AI later)
  const detectedItems = [
    {
      id: 1,
      name: 'Samsung 65" QLED 4K Smart TV',
      price: '₱3,999 x 24 months',
      image: 'https://images.samsung.com/is/image/samsung/p6pim/ph/qa65q60cawxxp/gallery/ph-qled-q60c-qa65q60cakxxp-536495897?$650_519_PNG$',
    },
    {
      id: 2,
      name: 'Modern L-Shaped Fabric Sofa',
      price: '₱1,899 x 24 months',
      image: 'https://m.media-amazon.com/images/I/71fV7g3X6YL._AC_SL1500_.jpg',
    },
    {
      id: 3,
      name: 'Minimalist Coffee Table',
      price: '₱599 x 12 months',
      image: 'https://m.media-amazon.com/images/I/81fK3+CzM+L._AC_SL1500_.jpg',
    },
    {
      id: 4,
      name: 'LED Floor Lamp with Remote',
      price: '₱899 x 12 months',
      image: 'https://m.media-amazon.com/images/I/71yM1eZ9k+L._AC_SL1500_.jpg',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Redesigned Room Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.redesignedImage}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Ionicons name="sparkles" size={32} color="#fff" />
            <Text style={styles.overlayText}>Your Dream Room by wAIs</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Items in Your Design</Text>
          <Text style={styles.subtitle}>Tap any item to view installment plans</Text>
        </View>

        {/* Vertical List of Items */}
        <View style={styles.itemsList}>
          {detectedItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>as low as</Text>
                <Text style={styles.priceAmount}>{item.price}</Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Rectangular FAB Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="calculator-outline" size={26} color="#fff" />
        <Text style={styles.fabText}>Calculate in Installment</Text>
        <Ionicons name="arrow-forward" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  imageContainer: {
    height: 420,
    position: 'relative',
  },
  redesignedImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 6,
  },
  itemsList: {
    paddingHorizontal: 16,
    paddingBottom: 100, // space for FAB
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E31E24',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: '#E31E24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
});