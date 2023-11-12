
import * as React from 'react';

import { useState, useEffect, setState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Camera, CameraOrientation, CameraType } from 'expo-camera';
import { RNCamera } from 'react-native-camera';
import * as FileSystem from 'expo-file-system';
import BackgroundTimer from 'react-native-background-timer';

const FaceDetector = () => {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const cameraReference = React.useRef(null);

  [currentTime, setCurrentTime] = useState(new Date());
  [cameraReady, setCameraReady] = useState(false);

  //did this so the first thing when user opens this page, is the alert for asking for permission
  useEffect(() => {
    getUserCameraPermission();
  }, []);

  setInterval(async () => {
    this.setCurrentTime(new Date());
    console.log('Current time ' + currentTime.getMinutes() + "m : " + currentTime.getSeconds() + "s" + " : " + currentTime.getMilliseconds() + "ms");
    //console.log("in time st interval\n");
  }, 500);

  const removePreviousPicture = async (previousPictureURI) => {
    try {
      await FileSystem.deleteAsync(previousPictureURI);
      console.log('File deleted');
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }

  const takePictureWithCamera = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      if (webcamEnabled && cameraReference.current) {
        cameraReference.current.takePictureAsync({
          quality: 0.1,
          skipProcessing: true,
          base64: true
        })
          .then(photo => {
            // Process the photo if needed
            removePreviousPicture(photo.uri); // You can use your remove function here
            console.log('Took Picture:', new Date());
          })
          .catch(error => {
            console.error('Failed to take picture:', error);
          });
      }
    }, 1000); // Interval time in milliseconds
  };

  function getUserCameraPermission() {
    return Alert.alert(title = '"App_name" Would Like to Access the Camera', message = 'This will be used for gesture scrolling',
      [
        {
          text: "Don't Allow",
          onPress: () => { setWebcamEnabled(false) },
        },
        {
          text: 'OK',
          onPress: () => { setWebcamEnabled(true) },
        },
      ])
  }

  return (
    <View style={styles.full_container}>
      <Text style={styles.title}>Testing TensorFlow Face Detection</Text>

      <View style={styles.webcamView}>
        {webcamEnabled ? (

          <Camera
            style={styles.webcam}
            type={CameraType.front}
            ref={cameraReference}
            onCameraReady={takePictureWithCamera}
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

      <View style={styles.results_container}>
        <Text>
          current_time: {currentTime.getMinutes()}m : {currentTime.getSeconds()}s : {currentTime.getMilliseconds()}ms
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  full_container: {
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
    width: 340,
    height: 600,
  },
  results_container: {
    alignItems: 'center', //horizontally
    justifyContent: 'center', //vertically
    height: 100,
    width: '100%',
    backgroundColor: '#FFB6C1'
  }
});

export default FaceDetector;