const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const messaging = admin.messaging();
const db = admin.firestore();


exports.sendPushNotificationOnWrite = functions.firestore.document('cities/{anyId}')
  .onWrite((change, context) => {
    // Obtiene el valor escrito en la base de datos
    const messageData = change.after.data();

    // Lógica para enviar el mensaje de notificación push
    const payload = {
      notification: {
        title: 'Ciudad añadida!',
        body: `La ciudad "${messageData.name}" ha sido añadida con éxito`, 
      },
    };

    // Accede a los tokens almacenados en Firestore
    return db.collection('tokens').get()
        .then(snapshot => {
        snapshot.forEach(doc => {
            const deviceToken = doc.data().token;

            // Enviar notificación a cada dispositivo con su token correspondiente
            return messaging.sendToDevice(deviceToken, payload)
            .then(response => {
                console.log('Notificación enviada con éxito:', response);
                return null;
            })
            .catch(error => {
                console.error('Error al enviar la notificación:', error);
            });
        });
        })
        .catch(error => {
        console.error('Error al obtener los tokens de Firestore:', error);
        });
  });

exports.sendPushNotificationOnUpdate = functions.firestore.document('cities/{anyId}')
  .onUpdate((change, context) => {
    // Obtiene el valor actualizado en la base de datos
    const messageData = change.after.data();

    // Lógica para enviar el mensaje de notificación push
    const payloadUpdate = {
      notification: {
        title: 'Ciudad modificada',
        body: `La ciudad "${messageData.name}" ha sido modificada con éxito`, 
      },
    };

    // Accede a los tokens almacenados en Firestore
    return db.collection('tokens').get()
        .then(snapshot => {
        snapshot.forEach(doc => {
            const deviceToken = doc.data().token;

            // Enviar notificación a cada dispositivo con su token correspondiente
            return messaging.sendToDevice(deviceToken, payloadUpdate)
            .then(response => {
                console.log('Notificación enviada con éxito:', response);
                return null;
            })
            .catch(error => {
                console.error('Error al enviar la notificación:', error);
            });
        });
        })
        .catch(error => {
        console.error('Error al obtener los tokens de Firestore:', error);
        });
  });
