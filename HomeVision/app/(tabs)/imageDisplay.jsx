import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
/**
 * DreamRoomDisplay Component
 * Displays the AI-generated renovated room.
 * * Usage:
 * <DreamRoomDisplay imageUri="https://..." />
 * * If imageUri is null, it shows a default sample image for demo purposes.
 */

// Sample "Renovated" Image
const SAMPLE_IMAGE =
  "https://m.media-amazon.com/images/I/919Jj69lpqL._AC_SX679_.jpg";

export const DreamRoomDisplay = ({ imageUri }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Initial fade-in animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for the badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, pulseAnim]);

  const handlePriceBreakdown = async () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsAnalyzing(true);
    // TODO: Send image for price breakdown analysis
    console.log("Analyzing image:", imageUri || SAMPLE_IMAGE);

    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);
  };
  const displaySource = imageUri ? { uri: imageUri } : { uri: SAMPLE_IMAGE };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTextTop}>HOME</Text>
          <Text style={styles.headerTextBottom}>CREDIT</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>HomeVision</Text>
        </View>
      </View>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Main Renovation Image */}
        <Animated.Text
          style={[styles.title, { transform: [{ scale: pulseAnim }] }]}
        >
          Your Dream Room
        </Animated.Text>

        <Animated.View
          style={[styles.imageWrapper, { transform: [{ scale: scaleAnim }] }]}
        >
          <Image source={displaySource} style={styles.image} />
        </Animated.View>

        <TouchableOpacity
          onPress={handlePriceBreakdown}
          disabled={isAnalyzing}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[styles.button, { transform: [{ scale: buttonScale }] }]}
          >
            <Text style={styles.buttonText}>
              {isAnalyzing ? "Analyzing..." : "View Price Breakdown"}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#E31E24",
  },
  headerTextTop: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  headerTextBottom: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  imageWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 16,
  },
  image: {
    width: 340,
    height: 340,
    borderRadius: 16,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#E31E24",
    borderRadius: 10,
    shadowColor: "#E31E24",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    padding: 10,
  },
});

export default DreamRoomDisplay;
