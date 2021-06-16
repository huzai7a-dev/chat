// import webpush from 'web-push';
// import fcmKey from './fcmKey.json';
 
// const vapidKeys = webpush.generateVAPIDKeys();
 
// webpush.setGCMAPIKey('AAAA_x5NtxI:APA91bFcvrjl5JI_TdnfwDl6I_9b_96RSLq257Qh3oZmPuFllOkbxjHgEfuYj6XAVI1jSc6W-bFL7GocWh4kgqHTLf58LTirqkzgQZJ6X73KaTQkeoiyEmPQZv5coTXYYW_LJXaQmdKa');
// webpush.setVapidDetails(
//   'mailto:avidhaus.ahsan@gmail.com',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );
 
// const pushSubscription = {
//   endpoint: fcmKey.endpoint,
//   keys: {
//     auth: fcmKey.keys.auth,
//     p256dh: fcmKey.keys.p256dh
//   }
// };

// export const sendNotification = (payload) => {
//     webpush.sendNotification(pushSubscription, payload).catch(e => console.log(e));
// }