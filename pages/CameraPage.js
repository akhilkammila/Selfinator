import React from 'react';
import { StyleSheet, Text, View, Image, Button, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
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
    const [type, setType] = useState(CameraType.back);

    const back = ()=>{
        props.navigation.navigate('Home_Screen')
    }


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

        //code with face api
        // faceapi.matchDimensions(cameraRef.current);
        // console.log('reached')
        // const detections = await faceapi.detectAllFaces(cameraRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        // console.log(detections.length);
        // console.log(detections[0].expressions.happy);
        // if (detections.length > 0 && detections[0].expressions.happy > 0.5) {
        //     let newPhoto  = await cameraRef.current.takePictureAsync(options);
        //     setPhoto(newPhoto);
        // }

        //code without face api
        console.log('taking photo')
        let newPhoto  = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);
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
        <Camera style={styles.container} ref={cameraRef} type={type}>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonContainer2}>
                    <TouchableWithoutFeedback onPress={back}>
                        <Image source={require('./assets/back.png')} width="100" height="100"/>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={takePic}>
                        <Image source={require('./assets/camera100.png')} width="100" height="100"/>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => {
                            console.log('turning camera')
                            setType(type === CameraType.back ? CameraType.front : CameraType.back);
                        }}
                    >
                        <Image source={require('./assets/turncamera.png')} width="100" height="100"/>
                    </TouchableWithoutFeedback>

                </View>
            </View>
            <StatusBar style="auto"/>
        </Camera>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#2f2f2f",
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36
    },
    buttonContainer2: {
        flexDirection: 'row',
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    }
});

export default CameraPage;