import React from 'react';
import { StyleSheet, Text, View, Image, Button, SafeAreaView } from 'react-native';
import {Camera} from 'expo-camera';
import {shareAsync} from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as faceapi from 'face-api.js';
import {useEffect, useRef, useState} from 'react';
import { StatusBar } from 'expo-status-bar';

function CameraPage(props) {
    let cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [photo, setPhoto] = useState();


    useEffect(()=>{
        (async () =>{
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status==="granted")
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")

        })();
    }, [])

    if (hasCameraPermission === undefined){
        return <Text>Requesting Permissions...</Text>
    } else if (!hasCameraPermission) {
        return <Text>Permission for camera not granted. Please change this in settings.</Text>
    }

    let takePic = async() =>{
        let options = {
            quality: 1,
            base64: true,
            exif: false
        }
        // faceapi.matchDimensions(cameraRef.current);
        console.log('reached')
        const detections = await faceapi.detectAllFaces(cameraRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        console.log(detections.length);
        console.log(detections[0].expressions.happy);
        if (detections.length > 0 && detections[0].expressions.happy > 0.5) {
            let newPhoto  = await cameraRef.current.takePictureAsync(options);
            setPhoto(newPhoto);
        }
    };

    if (photo){
        let sharePic = () =>{
            shareAsync(photo.uri).then(()=>{
                setPhoto(undefined);
            })
            console.log(hasMediaLibraryPermission)
        };

        let savePhoto = () =>{
            MediaLibrary.saveToLibraryAsync(photo.uri).then(()=>{
                setPhoto(undefined);
            });
        };
        
        return(
            <SafeAreaView style={styles.container}>
                <Image style={styles.preview} source={{uri: "data:image/jpg;base64," + photo.base64}}></Image>
                <Button title="Share" onPress = {sharePic}></Button>
                {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto}/> : undefined}
                <Button title="Discard" onPress = {() => setPhoto(undefined)}></Button>
            </SafeAreaView>
        )
    }

    return (
        <Camera style={styles.container} ref={cameraRef}>
            <View style={styles.buttonContainer}>
                <Button title="Take Picture" onPress = {takePic}></Button>
            </View>
            <StatusBar style="auto"/>
        </Camera>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#2f2f2f",
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
        backgroundColor: "#ff6f26",
        alignSelf: 'flex-end'
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    }
});

export default CameraPage;