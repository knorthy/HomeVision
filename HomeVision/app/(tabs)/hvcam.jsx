import { Camera, CameraView } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const BACKEND_UPLOAD_URL = 'http://192.168.68.119:8000/camera';

export default function CameraTab() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState('back');
  const cameraRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function uriToBlob(uri) {
    const response = await fetch(uri);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
    return await response.blob();
  }

  async function uploadUri(uri) {
    const blob = await uriToBlob(uri);
    const form = new FormData();
    form.append('photo', blob, 'photo.jpg');

    const res = await fetch(BACKEND_UPLOAD_URL, {
      method: 'POST',
      body: form,
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Upload failed: ${res.status} ${text}`);
    return text;
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setUploading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const resultText = await uploadUri(photo.uri);
      Alert.alert('Success', resultText || 'Image uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadFromGallery = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      try {
        setUploading(true);
        const resultText = await uploadUri(uri);
        Alert.alert('Success', resultText || 'Image uploaded from gallery!');
      } catch (error) {
        Alert.alert('Upload failed', error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.container}><Text>No camera access</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={cameraType}
        ref={cameraRef}
      />

      {/* Top Flip Button */}
      <TouchableOpacity
        style={styles.flipButton}
        onPress={() => setCameraType(prev => prev === 'back' ? 'front' : 'back')}
        disabled={uploading}
      >
        <Ionicons name="camera-reverse-outline" size={32} color="white" />
      </TouchableOpacity>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Upload from Gallery Button */}
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handleUploadFromGallery}
          disabled={uploading}
        >
          <Ionicons name="images-outline" size={28} color="white" />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          style={[styles.captureButton, uploading && styles.captureButtonDisabled]}
          onPress={handleCapture}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <View style={styles.captureInnerCircle} />
          )}
        </TouchableOpacity>

        {/* Empty space on left for symmetry */}
        <View style={{ width: 60 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  flipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
    padding: 12,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  galleryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 6,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureInnerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
});