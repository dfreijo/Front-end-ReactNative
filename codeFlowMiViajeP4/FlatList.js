
// Importa los módulos necesarios desde React y React Native, así como Firebase
import React, { useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';

// Componente funcional YourComponent
const YourComponent = () => {
  // Define un estado para almacenar los datos obtenidos de Firebase
  const [data, setData] = useState([]);

  // Hook useEffect, se ejecuta después de que el componente se monta
  useEffect(() => {
    // Configuración de Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAIxvIBjZFRaAKTg3IS8YQ4fXHfnQA_AC4",
      authDomain: "codeflowmiviajep4.firebaseapp.com",
      projectId: "codeflowmiviajep4",
      storageBucket: "codeflowmiviajep4.appspot.com",
      messagingSenderId: "239418664935",
      appId: "1:239418664935:web:179126ec4a0f3809797f42",
      measurementId: "G-JRF1F928L1"
    };

    // Inicializa Firebase si no hay aplicaciones inicializadas
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Obtiene una referencia a la colección 
    const retosCollection = firebase.firestore().collection('retos');

    // Recupera todos los retos de la colección
    retosCollection.get().then((querySnapshot) => {
      const retrievedData = [];
      querySnapshot.forEach((doc) => {
        // Almacena los datos en el array
        retrievedData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setData(retrievedData); // Actualiza el estado con los datos de Firestore
    }).catch((error) => {
      console.log('Error obteniendo retos: ', error);
    });
  }, []);

  // Renderiza cada elemento de la lista
  const renderItem = ({ item }) => (
    <View>
      <Text>{item.id}</Text>
      {/* Renderiza otros datos según la estructura */}
      <Text>{item.otroCampo}</Text>
    </View>
  );

  // Retorna un componente FlatList que renderiza los datos obtenidos de Firebase
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

// Exporta el componente
export default YourComponent;
