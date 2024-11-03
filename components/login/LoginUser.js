import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';

// Instalar la librería de npm imagen picker
// > npm i react-native-image-picker

const LoginUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('user@example.com');
    const [profileUrl, setProfileUrl] = useState('https://via.placeholder.com/150');

    const handleImagePicker = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 1 },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                    const imageUri = response.assets[0].uri;
                    setProfileUrl(imageUri);
                }
            }
        );
    };

    const handleLogout = () => {
        console.log('Logged out');
    };

    return (
        <View className="flex-1 justify-center items-center p-4 bg-white">
            <Avatar.Image size={150} source={{ uri: profileUrl }} className="mb-4" />
            <TouchableOpacity
                className="bg-blue-500 p-3 rounded-full mb-4"
                onPress={handleImagePicker}
            >
                <Text className="text-white text-center">Upload Photo</Text>
            </TouchableOpacity>
            <Text className="mt-2 text-lg font-bold text-gray-800">{email}</Text>
            <TextInput
                className="w-70 p-3 border border-gray-300 rounded-lg text-center mt-4"
                placeholder="Update username"
                value={username}
                onChangeText={setUsername}
            />
            <TouchableOpacity
                className="bg-red-600 p-3 rounded-full mt-4"
                onPress={handleLogout}
            >
                <Text className="text-white text-center">Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginUser;
