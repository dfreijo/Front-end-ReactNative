// Importa las dependencias necesarias desde React y React Navigation
import { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons'; 
// Importa los componentes de las diferentes pantallas
import DetailScreen from './src/screens/DetailScreen';
import ListScreen from './src/screens/ListScreen';
import PlayerScreen from './src/screens/PlayerScreen';

import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Crea un Stack Navigator para manejar la navegación
const Stack = createStackNavigator();

// Componente principal de la aplicación
const App = () => {
  
  // Función asincrónica para solicitar permiso al usuario para recibir notificaciones
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    // Al cargar el componente, solicita permiso al usuario
    if (requestUserPermission()) {
      // Obtiene el token de registro para el dispositivo
      messaging().getToken().then(token => {
        console.log('Token: ' + token);

        firestore().collection('tokens').where('token', '==', token).get().then(querySnapshot => {
          if (querySnapshot.empty) {
            // Si el token no existe, lo agrega a la base de datos
            firestore().collection('tokens').add({ token }).then(() => {
                console.log('Token guardado en Firestore');
              })
              .catch(error => {
                console.error('Error al guardar el token en Firestore:', error);
              });
          } else {
            console.log('El token ya existe en Firestore');
          }
          }).catch(error => {
            console.error('Error al buscar el token en Firestore:', error);
          });
        });
    }

    // Listener para manejar mensajes recibidos 
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification.title || 'Título predeterminado';
      const body = remoteMessage.notification.body || 'Cuerpo predeterminado';
      Alert.alert(title, body); // Muestra una alerta con el título y cuerpo del mensaje
    });

    return unsubscribe;
  }, []);

  // Estado para almacenar los datos del documento
  const [documentData, setDocumentData] = useState(null);
  
  // Retorna la estructura de navegación de la aplicación
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListScreen"
        screenOptions={({ navigation }) => {
          // Componente para el botón de inicio
          const HomeButton = () => (
            <AntDesign
              name="home"
              size={24}
              color="white"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('ListScreen')}         // Navega a la pantalla principal al presionar el botón de inicio
            />
          );

          return {
            headerStyle: {
              backgroundColor: '#f4511e',                               // Estilo del encabezado: color de fondo
            },
            headerTintColor: '#fff',                                    // Estilo del encabezado: color del texto/iconos
            headerTitleStyle: {
              fontWeight: 'bold',                                       // Estilo del encabezado: peso del texto
            },
            headerTitleAlign: 'center',                                 // Estilo del encabezado: alineación del título
            headerRight: (props) => <HomeButton {...props} />,          // Componente de botón de inicio en la esquina superior derecha
          };
        }}
      >
        <Stack.Screen
          name="ListScreen"
          component={ListScreen}
          options={{ title: 'VIAJE A JAPÓN' }}
        />
        <Stack.Screen
          name="DetailScreen"
          component={DetailScreen}
          options={{ title: 'Detalles' }}
        />
        <Stack.Screen
          name="PlayerScreen"
          component={PlayerScreen}
          options={{ title: 'Video' }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;