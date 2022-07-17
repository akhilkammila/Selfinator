import React from 'react';
import { StyleSheet, Text, View, Image, Button, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import {shareAsync} from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FaceDetector from 'expo-face-detector';
import { StatusBar } from 'expo-status-bar';
import {useEffect, useRef, useState} from 'react';

function CameraPage(props) {
    let cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [photo, setPhoto] = useState();
    const [type, setType] = useState(CameraType.back);
    const [faceData, setFaceData] = useState([]);

    const [pictureReady, setPictureReady] = useState(false)

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
        if (pictureReady){
            let options = {
                quality: 1,
                base64: true,
                exif: false
            }
    
            console.log('taking photo')
            let newPhoto  = await cameraRef.current.takePictureAsync(options);
            setPhoto(newPhoto);
        } else {
            setTimeout(takePic, 100)
        }
    };

    const handleFacesDetected = ({faces})=>{
        setFaceData(faces)
    }

    function getFaceDataView(){
        if (faceData.length === 0){
            return(
                <View style={styles.faces}>
                    <Text style={styles.faceDesc}>no faces detected</Text>
                </View>
            )
        } else{
            return faceData.map((face, index)=>{
                const eyesOpen = face.rightEyeOpenProbability>0.4 && face.leftEyeOpenProbability>0.4
                const smiling = face.smilingProbability>0.4
                const ready = eyesOpen && smiling

                if (ready!=pictureReady){
                    setPictureReady(ready);
                }

                return (
                    <View style={styles.faces}>
                        <Text style={styles.faceDesc}>Eyes Open: {eyesOpen.toString()}</Text>
                        <Text style={styles.faceDesc}>Smiling: {smiling.toString()}</Text>
                    </View>
                )

            })
        }
    }

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
        <Camera style={styles.container} ref={cameraRef} type={type}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true
        }}>
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
            {getFaceDataView()}
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
        backgroundColor: "#fff",
        margin: 16
    },
    faceDesc: {
        fontSize: 30
    }
});

export default CameraPage;