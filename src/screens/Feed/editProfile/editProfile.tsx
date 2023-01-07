import React, { useEffect, useState } from "react"
import { Image, ScrollView, Text, TextInput, View, ActivityIndicator, TouchableOpacity} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/header/header";
import { userAction, useUserData } from "../../../redux/reducers/userSlice/userSlice";
import colors from "../../../theme/colors";
import editProfileScreenStyle from "./editProfileScreenStyle";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import { getUploadMediaUrl, showToast } from "../../../helper/helper";
import colorPalates from "../../../theme/colorPalates";
import { useDispatch } from "react-redux";
import auth from '@react-native-firebase/auth';
import CameraModel from "../../../components/cameraModal/cameramodal";
import images from "../../../theme/images";
import Permission from "../../../helper/permission";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import storage from '@react-native-firebase/storage';

const EditProfileScreen = () => {

    const dispatch = useDispatch()
    const userData = useUserData();
    const navigation = useNavigation();
    const [bio, setBio] = useState('');
    const [image, setImage] = useState('');
    const [userName, setUserName] = useState('');
    const [uploadUrl, setUploadUrl] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] =  useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [iSModalVisible, setIsModalVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    console.log(progress,'pppppppppppppp')

    useEffect(()=>{
        setUserName(userData?.userName);
        setDisplayName(userData?.displayName);
        setBio(userData?.bio);
        setImage(userData?.profilePicture)
    },[])

    const onPressProfileSave = () => {

        if(uploadUrl){
            try {
                const filename= `${userData?.userId}${new Date().getTime()}`
                const task = storage().ref(filename).putFile(uploadUrl);
                task.on('state_changed', snapshot =>{
                    setProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000);
                })
            } catch (error) {
                console.log(error,'error')
            }
        }
        // setLoading(true);
        // try {
        //     firestore().collection('user').doc(userData?.userId).update({
        //         userName:userName,
        //         displayName:displayName,
        //         profilePicture:'',
        //         bio:bio
        //     })
        //     .then(() => { 
        //         dispatch(userAction.setUserData({
        //             ...userData,
        //             userName: userName,
        //             displayName: displayName,
        //             bio:bio
        //        }))
        //     })
        //     setLoading(false);
        //     navigation.goBack();
        //     showToast('Profile saved')
        // } catch (error) {
        //     console.log(error);
        //     setLoading(false);
        // }
    }

    const onPressLogout = () => {
        setLogoutLoading(true);
        try {
            auth().signOut().then(() =>{
                dispatch(userAction.clearUser());
                setLogoutLoading(false);
            });
        } catch (error) {
            console.log(error,'error');
            setLogoutLoading(false);
        }
    }

    const onPressCamera = async () => {
        setIsModalVisible(false);
        const cameraPermission = await Permission.getCameraPermission();
        if(!cameraPermission){
            showToast('Please allow the camera permission');
            return;
        }

        launchCamera({
            mediaType: 'photo',
            quality: 1,
            videoQuality: 'high',
            presentationStyle: 'fullScreen',
        }).then(async (cameraResponse: any) => {
            if (cameraResponse.didCancel) {
              return;
            }
            if (cameraResponse.errorCode) {
              return;
            }
            if (cameraResponse.errorMessage) {
              return;
            }
            const resp = {
              uri: cameraResponse?.assets[0].uri,
              fileSize: cameraResponse?.assets[0].fileSize,
              filename: cameraResponse.assets[0].fileName,
              height: cameraResponse.assets[0].height,
              width: cameraResponse.assets[0].width,
              timestamp: cameraResponse.assets[0].timestamp,
              type: cameraResponse.assets[0].type,
            };
            if (resp?.fileSize / 1000000 > 10) {
                showToast('Select an Image with less then 10 MB.');
                return;
            }
            const ext = resp?.type.split('/')[1];

            if (ext === 'jpeg' || ext === 'png' || ext === 'jpg') {
                const dataImage = await getUploadMediaUrl(resp);
                setImage(dataImage);
                setUploadUrl(resp?.uri)
            } else {
                showToast('select only .jpg, .jpeg and .png formate image');
                return;
            }
        });
    }

    const onPressGallery = async () => {
        setIsModalVisible(false);
        const storagePermission = await Permission.getStoragePermission();
        if(!storagePermission){
            showToast('Please allow the camera permission');
            return;
        }
        launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 1,
            includeExtra: true,
            presentationStyle: 'fullScreen',
          }).then(async (cameraResponse: any) => {
            if (cameraResponse.didCancel) {
              return;
            }
            if (cameraResponse.errorCode) {
              return;
            }
            if (cameraResponse.errorMessage) {
              return;
            }
      
            const resp = {
              uri: cameraResponse?.assets[0].uri,
              fileSize: cameraResponse?.assets[0].fileSize,
              filename: cameraResponse.assets[0].fileName,
              height: cameraResponse.assets[0].height,
              width: cameraResponse.assets[0].width,
              timestamp: cameraResponse.assets[0].timestamp,
              type: cameraResponse.assets[0].type,
            };
      
            if (resp?.fileSize / 1000000 > 10) {
                showToast('Select an Image with less then 10 MB.');
                return;
            }
      
            const ext = resp?.type.split('/')[1];
      
            if (ext === 'jpeg' || ext === 'png' || ext === 'jpg') {
                const dataImage = await getUploadMediaUrl(resp);
                setImage(dataImage)
                setUploadUrl(resp?.uri)
                console.log(dataImage,'dddddddddd')
            } else {
                showToast('select only .jpg, .jpeg and .png formate image');
                return;
            }
        });
    }

    return(
        <SafeAreaView style={editProfileScreenStyle.container}>
            {loading ?
                <ActivityIndicator size={'large'} color={colorPalates.AppTheme.primary}/>
            :
            <>
                <Header title={userData?.userName} isBack={true} isProfileSave={true} onPressProfileSave={onPressProfileSave}/>
                <ScrollView>
                    <TouchableOpacity onPress={()=>setIsModalVisible(true)}>
                    <Image
                        style={editProfileScreenStyle.Image}
                        source={image ? { uri:image } : images.dp}
                        resizeMode={"cover"} 
                    />
                    </TouchableOpacity>
                    <View style={editProfileScreenStyle.secondContainer}>
                        <Text style={editProfileScreenStyle.text}>Username</Text>
                        <TextInput 
                            placeholder="Username"
                            placeholderTextColor={colors.grayShade8F}
                            style={editProfileScreenStyle.textInput}
                            value={userName}
                            onChangeText={val => setUserName(val)}
                        />
                        <View style={editProfileScreenStyle.emptyView}/>
                        <Text style={editProfileScreenStyle.text}>Disaplay name</Text>
                        <TextInput 
                            placeholder="Disaplay name"
                            placeholderTextColor={colors.grayShade8F}
                            style={editProfileScreenStyle.textInput}
                            value={displayName}
                            onChangeText={val => setDisplayName(val)}
                        />
                        <View style={editProfileScreenStyle.emptyView}/>
                        <Text style={editProfileScreenStyle.text}>Bio</Text>
                        <TextInput 
                            placeholder="Bio"
                            placeholderTextColor={colors.grayShade8F}
                            style={editProfileScreenStyle.bio}
                            multiline={true}
                            value={bio}
                            onChangeText={val => setBio(val)}
                        />
                    </View>
                    <View style={editProfileScreenStyle.logoutView}>
                        <TouchableOpacity style={editProfileScreenStyle.logoutButton} onPress={onPressLogout}>
                            {logoutLoading ?
                                <ActivityIndicator size={'small'} color={colorPalates.AppTheme.secondary}/>
                            :
                                <Text style={editProfileScreenStyle.logoutText}>Logout</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <CameraModel isVisible={iSModalVisible} onClose={()=>setIsModalVisible(false)} onPressCamera={onPressCamera} onPressGallery={onPressGallery}/>
                </>
            }
        </SafeAreaView>
    )
}

export default EditProfileScreen;