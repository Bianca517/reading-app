
import * as React from 'react';
import * as tf from '@tensorflow/tfjs';
import * as coco_model from '@tensorflow-models/coco-ssd';

import { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { RNCamera } from 'react-native-camera';

const FaceDetector = () => {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(true); // Simulating that the model is already loaded

  React.useEffect(() => {
    getUserCameraPermission();
    console.warn("Current state of webcam: " + webcamEnabled + "\n");
  })

  // Check if webcam access is supported.
  const getUserMediaSupported = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    return status === 'granted';
  };

  function getUserCameraPermission() {
    return Alert.alert(title = 'Allow camera access?',
      [
        {
          text: 'No',
          onPress: () => { setWebcamEnabled(false) },
        },
        {
          text: 'Yes',
          onPress: () => { setWebcamEnabled(true) },
        },
      ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Testing TensorFlow Face Detection</Text>

      <View style={styles.webcamView}>
        {webcamEnabled ? (

          <Camera
            style={styles.webcam}
            type={Camera.Constants.Type.front}
            onCameraReady={predictWebcam}
          />

          /*
           <RNCamera
             ref={ref => {
               this.camera = ref;
             }}
             style={styles.webcam} 
             type={RNCamera.Constants.Type.front}
             onCameraReady={predictWebcam}
           />
           */
        ) : (
          <Text>Webcam not enabled</Text>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  webcamView: {
    alignItems: 'center',
  },
  webcam: {
    width: 320,
    height: 240,
  },
});

export default FaceDetector;