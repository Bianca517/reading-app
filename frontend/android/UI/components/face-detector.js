import { Alert, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

export default function FaceDetectionModule({ userAlreadyGavePermission, scrollRightCallback, scrollLeftCallback }) {
  const [hasPermission, setHasPermission] = React.useState(userAlreadyGavePermission);
  const [faceData, setFaceData] = React.useState([]);
  const [faceTiltedRight, setFaceTiltedRight] = React.useState(false);
  const [faceTiltedLeft, setFaceTiltedLeft] = React.useState(false);
  const STRAIGHT_ANGLES = [355, 5];
  const TILTED_RIGHT_ANGLE = 10;
  const TILTED_LEFT_ANGLE = 350;
  const HALF_ANGLE = 180; 
  const X_LIMITS = [0.03, 0.4];
  const Y_LIMITS = [15, 300];

  React.useEffect(() => {
    (async () => {
        if(!userAlreadyGavePermission) {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
            console.log("here");
            console.log(hasPermission);
        }
    })();
  }, []);

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function checkFaceTiltLeft(faceTilt) {
    if(!faceTiltedLeft) {
      if (HALF_ANGLE < faceTilt) {
        if(faceTilt > STRAIGHT_ANGLES[0]) {
            if(faceTiltedLeft != false) {
              setFaceTiltedLeft(false);
            }
        } else if (faceTilt <= TILTED_LEFT_ANGLE) {
            setFaceTiltedLeft(true);
            scrollLeftCallback();
            console.log("swiping left");
            //Alert.alert('Swipe left');
            delay(800).then(() => {
              setFaceTiltedLeft(false)
            });
        }
      }
    }
  }

  function checkFaceTiltRight(faceTilt) {
    if(!faceTiltedRight) {
      if (HALF_ANGLE > faceTilt) {
        if(faceTilt < STRAIGHT_ANGLES[1]) {
            if(faceTiltedRight != false) {
              setFaceTiltedRight(false);
            }
        } else if (faceTilt >= TILTED_RIGHT_ANGLE) {
            setFaceTiltedRight(true);
            //Alert.alert('Swipe right');
            scrollRightCallback();
            console.log('Swipe right');
            delay(800).then(() => {
              setFaceTiltedRight(false)
            });
        }
      }
    }
  }


  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    //console.log("hereeeeeee");
    //console.log(faces);
    if(faces.length > 0) {
      const face = faces[0]; //assuming its only one face
      const faceTilt = face.rollAngle;
      const faceYawAngle = face.yawAngle;
      const faceX = face.bounds.origin.x;
      const faceY = face.bounds.origin.y;
      //console.log(faceX);
      //const isFaceCentered = ((faceX > X_LIMITS[0]) && (faceX < X_LIMITS[1])) && ((faceY > Y_LIMITS[0]) && (faceY < Y_LIMITS[1]));
      const isFaceCentered = ((faceX > X_LIMITS[0]) && (faceX < X_LIMITS[1]));
      const isFaceNotRotated = (faceYawAngle > STRAIGHT_ANGLES[0]) || (faceYawAngle < STRAIGHT_ANGLES[1])
      //console.log("face centered", isFaceCentered);
      //console.log("face not rotated", isFaceNotRotated);
      if(isFaceNotRotated && isFaceCentered) {
        console.log("face centered OK");
        checkFaceTiltRight(faceTilt);
        checkFaceTiltLeft(faceTilt);
      }
    }
  }

  return (
    <Camera 
      type={Camera.Constants.Type.front}
      style={styles.camera}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 300,
        tracking: false
      }}>
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    height: 1, //to make it invisible
    width: 1
  },
});