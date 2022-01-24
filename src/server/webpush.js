import webpush from "web-push";
import fcmKey from "./fcmKey.json";
import connection from "./db";

webpush.setGCMAPIKey("AIzaSyDQDWntetf2pfy6AHD2aCElQ19byjRYhew");
webpush.setVapidDetails(
  "mailto:avidhaus.ahsan@gmail.com",
  "BCGDIfnAeJn_Pkpz9nFdOjbLNDsGE15JKZbVwNMlJquDYx5DtmVyJWuRXBDUmB2qhakY43zrEOrc5VgL_7VFcvY",
  "xhtf5iVxz1x8ILcTYdglXca-FQfVIk39T_cJvHCYGLE"
);

const pushSubscription = {
  endpoint: fcmKey.endpoint,
  keys: {
    auth: fcmKey.keys.auth,
    p256dh: fcmKey.keys.p256dh,
  },
};

export const getSubscriptionByUser = (user_id) =>
  new Promise((resolve, reject) => {
    connection.get(
      `SELECT * FROM Subscription WHERE user_id = ${user_id}`,
      (error, result) => {
        if (error) {
          reject(error);
        }

        const subscription = {
          endpoint: result?.endpoint,
          expirationTime: result?.expirationTime,
          keys: {
            p256dh: result?.p256dh,
            auth: result?.auth,
          },
        };

        resolve(subscription);
      }
    );
  });

export const saveSubscription = (user_id, subscription) =>
  new Promise((resolve, reject) => {
    // console.log(user_id, subscription)
    connection.run(
      `INSERT INTO Subscription(user_id,endpoint,expirationTime,p256dh,auth)
  VALUES('${user_id}','${subscription.endpoint}','${subscription.expirationTime}','${subscription.keys.p256dh}','${subscription.keys.auth}')
  ON CONFLICT(user_id)
  DO UPDATE SET endpoint='${subscription.endpoint}',expirationTime='${subscription.expirationTime}',p256dh='${subscription.keys.p256dh}',auth='${subscription.keys.auth}'`,
  // [user_id, subscription.endpoint, subscription.expirationTime, subscription.keys.p256dh, subscription.keys.auth],
  (results, error) => {
        if (error) {
          return reject(error);
        }
        console.log("Subscription saved", results, error);
        resolve(results);
      }
    );
  });

  export const getSubscriptions = () => new Promise((resolve, reject) => {
    connection.all(`SELECT * FROM Subscription`, (error, rows)=> {
      if(error) {
        reject(error);
      } else {
        resolve(rows);
      }
    })
})

export const triggerPushMsg = async (user_id, dataToSend = "Empty Notification") => {
  const subscription = await getSubscriptionByUser(user_id);
  if(subscription) {
    return webpush.sendNotification(subscription, typeof dataToSend == typeof "" ? dataToSend : JSON.stringify(dataToSend)).catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log(
          "Subscription has expired or is no longer valid: ",
          subscription,
          err
        );
        subscription?.unsubscribe();
      } else {
        throw err;
      }
    });
  }
  return null;
};

