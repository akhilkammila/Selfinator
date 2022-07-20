import React from 'react';
import { StyleSheet, Text, View, Image, Button, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FaceDetector from 'expo-face-detector';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';

function CameraPage(props) {
    let cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [photo, setPhoto] = useState();
    const [type, setType] = useState(CameraType.back);
    const [faceData, setFaceData] = useState([]);

    const [pictureReady, setPictureReady] = useState(false)

    const back = () => {
        props.navigation.navigate('Home_Screen')
    }

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === "granted")
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")

        })();
    }, [])

    // if (hasCameraPermission === undefined) {
    //     return <Text>Requesting Permissions...</Text>
    // } else if (!hasCameraPermission) {
    //     return <Text>Permission for camera not granted. Please change this in settings.</Text>
    // }

    function takePic(){
        console.log('running takePic')
        if (pictureReady){
            executeTakePic()
        } else{
            setTimeout(function(){takePic()}, 1000)
        }
    };

    async function executeTakePic(){
        let options = {
            quality: 1,
            base64: true,
            exif: false
        }

        let newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);
    }

    const handleFacesDetected = ({ faces }) => {
        setFaceData(faces)
    }

    function getFaceDataView() {
        if (faceData.length === 0) {
            return (
                <SafeAreaView style={styles.faces}>
                    <View style={styles.faces2}>
                        <Text style={styles.faceDesc}>No Faces Were</Text>
                        <Text style={styles.faceDesc}>Detected</Text>
                    </View>
                </SafeAreaView>
            )
        } else {
            let eyesOpen = true
            let smiling = true

            for (const face of faceData){
                if(face.rightEyeOpenProbability < 0.4 || face.leftEyeOpenProbability < 0.4){
                    eyesOpen=false
                }
                if (face.smilingProbability < 0.4){
                    smiling=false
                }
            }

            const ready = eyesOpen && smiling

            if (ready != pictureReady) {
                console.log('CHANGEING PICTURE READY')
                setPictureReady(ready);
            }

            return (
                <SafeAreaView style={styles.faces}>
                    <View style={styles.faces2}>
                        <Text style={styles.faceDesc}>All Eyes Open: {eyesOpen.toString()}</Text>
                        <Text style={styles.faceDesc}>Everyone Smiling: {smiling.toString()}</Text>
                    </View>
                </SafeAreaView>
            )
        }
    }

    if (photo) {
        let sharePic = () => {
            shareAsync(photo.uri).then(() => {
                setPhoto(undefined);
            })
            console.log(hasMediaLibraryPermission)
        };

        let savePhoto = () => {
            MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
                setPhoto(undefined);
            });
        };

        return (
            <SafeAreaView style={styles.container}>
                <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }}></Image>
                <Button title="Share" onPress={sharePic}></Button>
                {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
                <Button title="Discard" onPress={() => setPhoto(undefined)}></Button>
            </SafeAreaView>
        )
    }

    return (
        <Camera style={styles.container} ref={cameraRef} type={type}
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
                minDetectionInterval: 200,
                tracking: true
            }}>
            {getFaceDataView()}
            <View style={styles.buttonContainer}>
                <View style={styles.buttonContainer2}>
                    <TouchableWithoutFeedback onPress={back}>
                        <Image source={require('./assets/back.png')} width="100" height="100" />
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={takePic}>
                        <Image source={require('./assets/camera100.png')} width="100" height="100" />
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => {
                            console.log('turning camera')
                            setType(type === CameraType.back ? CameraType.front : CameraType.back);
                        }}
                    >
                        <Image source={require('./assets/turncamera.png')} width="100" height="100" />
                    </TouchableWithoutFeedback>

                </View>
            </View>
            <StatusBar style="auto" />
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
    },
    faces: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    faces2: {
        backgroundColor: "#ffe4a4",
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 15,
    },
    faceDesc: {
        fontSize: 30,
        color: "#ff6f26",
        fontFamily: "PingFangTC-Semibold",
    }
});

export default CameraPage;