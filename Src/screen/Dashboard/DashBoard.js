// Import React
import React, {useState} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

const DashBoard = () => {
  const [filePath, setFilePath] = useState({});

  const chooseFile = async () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option'
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
    launchImageLibrary(options, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        Alert.alert('Image upload canceled');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log(
          'User tapped custom button: ',
          response.customButton
        );
        alert(response.customButton);
      } else {
        console.log("Responseeeeee",response.assets[0].uri)
        const formData = new FormData();
        formData.append('image', {
           name: response.assets[0].fileName,
           uri: response.assets[0].uri,
           type:response.assets[0].type
        });
       console.log("responseee",Response.uri)
        try {
          const uploadResponse = await axios.post('http://192.168.48.16:8000/api/v1/upload',formData,{
            headers:{
                Accept:'application/json',
                'Content-Type':'multipart/form-data'
            }
          });
          Alert.alert('Image uploaded successfully!');
          setFilePath(uploadResponse.data);
        } catch (error) {
            console.log("Error in api", error.code)
          Alert.alert('Error uploading image!', error.code);
        }
      }
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Example of Image Picker in React Native
      </Text>
      <View style={styles.container}>
        {filePath.uri && (
          <Image
            source={{ uri: filePath.uri }}
            style={styles.imageStyle}
          />
        )}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={chooseFile}>
          <Text style={styles.textStyle}>
            Choose Image
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});
