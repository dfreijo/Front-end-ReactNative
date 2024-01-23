import React, { useState, useEffect } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { getFirestore} from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import { Video, ResizeMode  } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';


// Configuración de las credenciales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAIxvIBjZFRaAKTg3IS8YQ4fXHfnQA_AC4",
  authDomain: "codeflowmiviajep4.firebaseapp.com",
  projectId: "codeflowmiviajep4",
  storageBucket: "codeflowmiviajep4.appspot.com",
  messagingSenderId: "239418664935",
  appId: "1:239418664935:web:179126ec4a0f3809797f42",
  measurementId: "G-JRF1F928L1"
};

const app = initializeApp(firebaseConfig);                // Inicializa la aplicación Firebase con la configuración proporcionada
const db = getFirestore(app);                             // Obtiene una referencia a la base de datos Firestore

const PlayerScreen = ({ route }) => {
  const { mediaUrl } = route.params;                      // Extrae la URL del video de los parámetros de la ruta
  const [videoURL, setVideoURL] = useState(null);         // Estado para la URL del video
  const [volume, setVolume] = useState(1);                // Estado para el volumen del video
  const [status, setStatus] = useState({});               // Estado para el estado actual del video

  // Efecto para ACTUALIZAR la URL desde detalle
  useEffect(() => {
    if (mediaUrl) {
      setVideoURL(mediaUrl);
    }
  }, [mediaUrl]); 
  
  // Función para manejar el cambio de volumen
  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  // Función que se activa cuando el video llega al final
  const handleVideoEnd = () => {
    // Establece un estado (por ejemplo, videoEnd) para indicar el final del video
    setVideoEnd(true);
  };

  if (Platform.OS === 'web') {
    return (      // Renderización Web
      <View style={[ styles.containerWeb , {} ]}>
        <video src={videoURL} {
          ...{
            controls: true,
            autoPlay: false,
            onEnded: handleVideoEnd,
            style: styles.videoWeb,
          }
      } />
    </View>
    )
  } else {      // Renderización movil
    return (
      <View style={styles.container}>
        {videoURL && (
          <View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
            <>
              <Video
                style={styles.video}
                source={{uri: videoURL,}}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isLooping={false}
                volume={volume}
              />
              <View style={[styles.volumeControl, {marginTop: 10}]}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={volume}
                  onValueChange={handleVolumeChange}
                  minimumTrackTintColor="#1E90FF"
                />
                <TouchableOpacity onPress={() => handleVolumeChange(volume === 0 ? 1 : 0)}>
                  <FontAwesome
                    name={volume === 0 ? 'volume-off' : volume < 0.5 ? 'volume-down' : 'volume-up'} size={26} color="white"
                  />
                </TouchableOpacity>
              </View>
            </>
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  containerWeb: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  video: {
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").width * 1 * (9 / 16),
  },
  slider: {
    flex: 1,
    marginRight: 3, 
    marginLeft: 250,
    maxWidth: 100,
  },
  volumeControl: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
    marginBottom: 10,
  },
  videoWeb: {
    maxWidth: '100%', 
    maxHeight: '100%',
    width: 'auto', 
    height: 'auto', 
  },
});

export default PlayerScreen;
