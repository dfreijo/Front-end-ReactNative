import React, { useState, useEffect } from 'react';
import { ScrollView, View, Button, Text, Modal, TextInput, StyleSheet, TouchableOpacity, Image, Keyboard, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, doc, setDoc, query, where, getDocs, getDoc, deleteDoc } from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage'; 
import { initializeApp } from 'firebase/app';
import { AntDesign } from '@expo/vector-icons';       


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

// Función asincrónica para obtener datos de la colección 'cities' de Firestore
const fetchCities = async (setCities) => {
  const citiesCollection = collection(db, 'cities');                    // Obtiene una referencia a la colección 'cities' en Firestore
  const citySnapshot = await getDocs(citiesCollection);                 // Obtiene una instantánea de los documentos en la colección 'cities'
  const cityList = citySnapshot.docs.map(doc => doc.data());            // Mapea los datos de los documentos en la instantánea a una matriz y extrae los datos de cada documento
  setCities(cityList);                                                  // Actualiza el estado de las ciudades con la lista de datos obtenida de Firestore
};

// Se utiliza el componente DetailScreen como una función que recibe las propiedades de navegacion y ruta
const DetailScreen = ({ route, navigation }) => {
  const { item } = route.params || {};                                   // Obtiene los parámetros de la ruta (si existen)
  const [cities, setCities] = useState([]);                              // Lista de ciudades
  const [modalVisible, setModalVisible] = useState(false);               // Estado para controlar la visibilidad del modal
  const [name, setName] = useState('');                                  // Estado para el campo 'name'
  const [day, setDay] = useState('');                                    // Estado para el campo 'day'
  const [accommodation, setAccommodation] = useState('');                // Estado para el campo 'accommodation'
  const [activities, setActivities] = useState('');                      // Estado para el campo 'activities'
  const [description, setDescription] = useState('');                    // Estado para el campo 'description'
  const [mediaUrl, setMediaUrl] = useState(null);                        // URL del archivo multimedia (imagen o video)
  const [image, setImage] = useState(null);                              // Previsualización de la imagen 
  const [mediaUri, setMediaUri] = useState(null);                        // Identificador del archivo multimedia
  const [mediaFileName, setMediaFileName] = useState(null);              // Nombre para el archivo multimedia
  const [currentCity, setCurrentCity] = useState(item);                  // Define el estado inicial con el valor de 'item'
  const [keyboardVisible, setKeyboardVisible] = useState(false);         // Estado para controlar la visibilidad del teclado
  const [zoomed, setZoomed] = useState(false);                           // Estado para controlar el zoom
  const [imageUrl, setImageUrl] = useState(null);                        // URL de la imagen

  // Efecto para detectar si el teclado está visible o no
  useEffect(() => {
    // Agrega un listener para el evento de que el teclado se muestre
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Establece el estado para indicar que el teclado está visible
      }
    );
  
    // Agrega un listener para el evento de que el teclado se oculte
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Establece el estado para indicar que el teclado está oculto
      }
    );
  
    // Se ejecuta cuando el componente se desmonta o se actualiza
    return () => {
      // Elimina los listeners cuando el componente se desmonta o se actualiza
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Funccion para selecionar un video o una imagen 
  const selectMedia = async () => {
    // Selecciona un archivo multimedia de la biblioteca
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,     // Tipos de medios disponibles (todos en este caso)
      allowsEditing: true,                              // Permite editar la imagen seleccionada
      aspect: [4, 3],                                   // Proporción de aspecto (4:3 en este caso)
      quality: 1,                                       // Calidad de la imagen (de 0 a 1)
    });
  
    if (!result.canceled && result.assets[0].uri) {
      // Establece la URI seleccionada en el estado (por ejemplo, para mostrarla en la interfaz)
      setImage(result.assets[0].uri);
      if (result.assets[0].uri.startsWith('data:image/')) {
        console.log('Es una imagen');
        const fileName = `images/${new Date().toISOString()}_${result.assets[0].uri.split('/').pop()}`;   // Genera un nombre de archivo único para la imagen con la ultima parte del uri
        
        // Actualizar el estado con la uri y el nombre del archivo
        setMediaUri(result.assets[0].uri);
        setMediaFileName(fileName);
        console.log(fileName);

      } else if (result.assets[0].uri.startsWith('data:video/')) {
        console.log('Es un video');
        const fileName = `videos/${new Date().toISOString()}_${result.assets[0].uri.split('/').pop()}`;   // Genera un nombre de archivo único para la imagen con la ultima parte del uri
        
        // Actualizar el estado con la uri y el nombre del archivo
        setMediaUri(result.assets[0].uri);
        setMediaFileName(fileName);
        console.log(fileName);

      } else if (result.assets[0].uri.endsWith('.jpeg') || result.assets[0].uri.endsWith('.jpg') || result.assets[0].uri.endsWith('.png') || result.assets[0].uri.endsWith('.bmp')) {
        console.log('Es una imagen');
        const fileName = `images/${new Date().toISOString()}_${result.assets[0].uri.split('/').pop()}`;   // Genera un nombre de archivo único para la imagen con la ultima parte del uri
        setMediaUri(result.assets[0].uri);
        setMediaFileName(fileName);
    
      }else if (result.assets[0].uri.endsWith('.mp4') || result.assets[0].uri.endsWith('.avi') || result.assets[0].uri.endsWith('.wmv') || result.assets[0].uri.endsWith('.mkv')) {
        console.log('Es una video');
        const fileName = `videos/${new Date().toISOString()}_${result.assets[0].uri.split('/').pop()}`;   // Genera un nombre de archivo único para la imagen con la ultima parte del uri
        setMediaUri(result.assets[0].uri);
        setMediaFileName(fileName);

      } else {
        console.log('Otro tipo de archivo');
      }
    }  
  };

  // Función para subir un archivo multimedia (imagen o video) al Storage de Firebase 
  const uploadMedia = async (uri, fileName) => {
    const response = await fetch(uri);                    // Obtiene el archivo desde la URI
    const blob = await response.blob();                   // Convierte el URI en un objeto Blob
    const storage = getStorage(app);                      // Obtiene una referencia al almacenamiento de Firebase
    const storageRef = ref(storage, fileName);            // Crea una referencia al archivo en el almacenamiento de Firebase
    await uploadBytes(storageRef, blob);                  // Sube el Blob al almacenamiento de Firebase
    const downloadURL = await getDownloadURL(storageRef); // Obtiene la URL del archivo subido
    return downloadURL;                                   // Devuelve la URL del archivo subido
  };

  // Función para actualizar lo datos de una ciudad
  const updateCityDetails = async (initName, name, day, accommodation, activities, description, mediaUrl, setModalVisible) => {
  
    const cityId = await findCityIdByName(initName);              // Busca el ID de la ciudad por su nombre inicial
    const cityDocRef = doc(db, 'cities', cityId);                 // Referencia al documento específico de la ciudad usando el ID encontrado

    // Obtiene los datos actuales de la ciudad
    const citySnapshot = await getDoc(cityDocRef);
    const currentCityData = citySnapshot.data();

    let url = currentCityData.mediaUrl || ''; // Si no hay una imagen existente, usar una cadena vacía
    // Subir la nueva imagen o video si se proporciona una nueva URI y un nombre de archivo
    if (mediaUri && mediaFileName) {
      const downloadURL = await uploadMedia(mediaUri, mediaFileName);
      url = downloadURL;
    }

    // Comprueba si cada campo ha sido cambiado, si no, usa el valor actual
    const updatedCityData = {
      name: name !== '' ? name : currentCityData.name,
      day: day !== '' ? day : currentCityData.day,
      accommodation: accommodation !== '' ? accommodation : currentCityData.accommodation,
      activities: activities !== '' ? activities : currentCityData.activities,
      description: description !== '' ? description : currentCityData.description,
      mediaUrl: url,
    };

    // Actualiza currentCity con los datos actualizados
    setCurrentCity(updatedCityData);
    // Vuelve a obtener la lista de ciudades después de la actualización
    await fetchCities(setCities);
    await setDoc(cityDocRef, updatedCityData, { merge: true });

    setModalVisible(false);
    setName('');
    setDay('');
    setAccommodation('');
    setActivities('');
    setDescription('');
    
  };
  
  // Función para encontrar el ID de una ciudad por su nombre
  const findCityIdByName = async (cityName) => {
    const citiesCollection = collection(db, 'cities'); // Referencia a la colección 'cities'
    
    // Realiza una consulta para encontrar el documento que coincida con el nombre de la ciudad
    const q = query(citiesCollection, where('name', '==', cityName));
    
    // Obtiene los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);
    
    // Verifica si se encontró algún documento
    if (!querySnapshot.empty) {
      // Devuelve el cityId del primer documento que coincide con el nombre de la ciudad
      return querySnapshot.docs[0].id;
    } else {
      // Si no se encontró ningún documento que coincida con el nombre de la ciudad
      return null;
    }
  };

  // Función para abrir el modal 
  const openModal = () => {
    setModalVisible(true);  
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Restablecer los campos del modal
  const resetFields = () => {
    setName('');
    setDay('');
    setAccommodation('');
    setActivities('');
    setDescription('');
    setMediaUri(null);
    setMediaFileName(null);
    setImage(null);
  };

  // Función para navegar a la pantalla de detalles de una ciudad
  const navigateToPlayer = () => {
  navigation.navigate('PlayerScreen', { mediaUrl: currentCity.mediaUrl });
  };

  // Efecto para hacer zoom en la imagen
  const toggleZoom = (url) => {
    setImageUrl(url);
    setZoomed(!zoomed);
  };

  return (
    <ScrollView style={styles.container}>

      {/* Título */}
      <View style={[{ alignItems: 'center', marginBottom: 10 }]}>
        <Text style={styles.title}>
          {('Información').toUpperCase()}
        </Text>
      </View>

      {/* Contenedor de cada sección de información */}
      <View style={styles.infoContainer}>

        {/* Sección: Día */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{('Dia').toUpperCase()}</Text>
          <Text style={ {marginTop: 7, marginLeft: 10}}>{currentCity.day}</Text>
        </View>

        {/* Sección: Nombre */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{('Ciudad').toUpperCase()}</Text>
          <Text style={{marginTop: 7, marginLeft: 10}}>{currentCity.name}</Text>
        </View>

        {/* Sección: Alojamiento */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{('Alojamiento').toUpperCase()}</Text>
          <Text style={{marginTop: 7, marginLeft: 10}}>{currentCity.accommodation}</Text>
        </View>

        {/* Sección: Actividades */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{('Actividades').toUpperCase()}</Text>
          <View style={{marginTop: 7, marginLeft: 10}}>
            {/* Mapeo de actividades */}
            {currentCity.activities.split(',').map((activity, index) => (
              // Cada actividad como un elemento de Text
              <Text key={index} style={styles.info}>
                {activity.trim()} {/* Muestra la actividad */}
              </Text>
            ))}
          </View>
        </View>

        {/* Sección: Descripción */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{('Descripción').toUpperCase()}</Text>
          <Text style={{marginTop: 7, marginLeft: 10}}>{currentCity.description}</Text>
        </View>
        
        {/* Sección: Imagen */}
        <View style={{ marginTop: 7, marginLeft: 10 }}>
          {currentCity.mediaUrl && typeof currentCity.mediaUrl !== 'undefined' ? (
            String(currentCity.mediaUrl).includes('/images') ? (
              // Si es una URL de imagen, mostrar la imagen con funcionalidad de zoom
              <>
                {/* Cuando se presiona la imagen, se llama a la función toggleZoom con la URL de la imagen */}
                <TouchableOpacity onPress={() => toggleZoom(currentCity.mediaUrl)}>
                  {/* La imagen que muestra la vista previa de la imagen */}
                  <Image source={{ uri: currentCity.mediaUrl }} style={{ width: 160, height: 120 }} />
                </TouchableOpacity>

                {/* Modal que muestra la imagen en un tamaño más grande cuando se activa el zoom */}
                <Modal visible={zoomed} transparent={true} onRequestClose={() => setZoomed(false)}>
                  <View style={styles.modalContainer}>
                    {/* Se puede cerrar el modal presionando la imagen */}
                    <TouchableOpacity onPress={() => setZoomed(false)}>
                      {/* La imagen ampliada */}
                      <Image source={{ uri: imageUrl }} resizeMode="contain" style={styles.zoomedImage} />
                    </TouchableOpacity>
                  </View>
                </Modal>
              </>
            ) : String(currentCity.mediaUrl).includes('/videos') ? (
              // Si es una URL de video, mostrar el texto "Ver video"

              <TouchableOpacity onPress={navigateToPlayer}>
                <AntDesign name="playcircleo" size={30} color="black" style={{ marginTop: 6 }} />
              </TouchableOpacity>
            ) : (
              // Si no se encuentra ninguna subcadena relevante, mostrar un mensaje predeterminado
              <Text>No se puede determinar el tipo de medio</Text>
            )
          ) : (
            // Si no hay URL de media o no está definido, mostrar un mensaje predeterminado
            <Text>
              <AntDesign name="picture" size={30} color="black" style={{ marginTop: 6 }} />
            </Text>
          )}
        </View>

        {/* Botón para editar */}
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={openModal} style={[styles.buttonModal, { marginVertical: 20 }]}>
            <Text style={styles.buttonText}>Editar Contenido </Text>
          </TouchableOpacity>
        </View>
      </View>
                                                                                
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            {/* Botón para cerrar el modal */}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>

          {/* Campos para agregar detalles de la nueva ciudad */}
          <TextInput
              style={styles.input}
              onChangeText={text => setName(text)}
              value={name}
              placeholder={currentCity.name}
          />
          <TextInput
              style={styles.input}
              onChangeText={text => setDay(text)}
              value={day}
              placeholder={currentCity.day}
          />
          <TextInput
              style={styles.input}
              onChangeText={text => setAccommodation(text)}
              value={accommodation}
              placeholder={currentCity.accommodation}
          />
          <TextInput
              style={styles.input}
              onChangeText={text => setActivities(text)}
              value={activities}
              placeholder={currentCity.activities}
          />
          <TextInput
              style={styles.descriptionInput}
              onChangeText={text => setDescription(text)}
              value={description}
              placeholder= {currentCity.description}
              multiline={true} 
          />

          {/* Botón para seleccionar un archivo */}
          <TouchableOpacity onPress={selectMedia} style={[styles.buttonModal, { marginBottom: 10 }]}>
            <Text style={styles.buttonText}>Seleccionar archivo</Text>
          </TouchableOpacity>
          {/* Condición para mostrar imagen o video */}
          {mediaUri && (
            <View style={{ alignItems: 'center' }}>
              {mediaUri.startsWith('data:image/') ? (
                <>
                  <Image source={{ uri: mediaUri }} style={{ width: 180, height: 150 }} />
                  <Text style={{ marginTop: 5 }}>Imagen cargada</Text>
                </>
              ) : mediaUri.startsWith('data:video/') ? (
                <>
                  <Image source={require('../../assets/video2.jpg')} style={{ width: 180, height: 150 }} />
                  <Text style={{ marginTop: 5 }}>Video cargado</Text>
                </>
              ) : null}
            </View>
          )}

          {/* Botón para guardar detalles */}
          <TouchableOpacity onPress={() => updateCityDetails(item.name, name, day, accommodation, activities, description, mediaUrl, setModalVisible)} style={[styles.buttonModal, { marginTop: 10 }]}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>

          {/* Botón para restablecer los campos del modal */}
          {!keyboardVisible && (
            <TouchableOpacity onPress={resetFields} style={[styles.buttonModal, { position: 'absolute', bottom: 20 },]}>
              <Text style={styles.buttonText}>Restablecer</Text>
            </TouchableOpacity>
          )}
          
          </View>
      </Modal>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 10,
  },
  infoContainer: {
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    width: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonModal: {
    width: 200,
    backgroundColor: '#565656', 
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '500'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  descriptionInput: {
    height: 100, 
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomedImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default DetailScreen;
