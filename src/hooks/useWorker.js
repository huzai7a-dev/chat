import { useEffect } from "react";

const useWorker = () => {
  const urlB64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  const initWorker = async () => {
    if (!("Notification" in window)) {
      throw console.log("This browser does not support desktop notification");
    }

    if (
      Notification.permission !== "denied" &&
      Notification.permission !== "granted"
    ) {
      const permission = await Notification.requestPermission().then(
        (permission) => {
          if (permission !== "granted") {
            throw console.log("permission is denied");
          }
        }
      );
    }

    if (!("serviceWorker" in navigator)) {
      throw console.log("serviceWorker is not supported");
    }

    navigator.serviceWorker
      .getRegistration()
      .then(async (reg) => {
        
        reg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
              "BCGDIfnAeJn_Pkpz9nFdOjbLNDsGE15JKZbVwNMlJquDYx5DtmVyJWuRXBDUmB2qhakY43zrEOrc5VgL_7VFcvY"
            ),
          })
          .then((sub) => {
            console.log(JSON.stringify(sub.toJSON()));
          }).catch(e => console.log(e));
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    initWorker();
  }, []);
};

// const connectBeam = async (interest = "hello") => {
//   const beamsClient = new Client({
//     instanceId: "8562583c-fb65-44fd-8627-417d33f86cb0",
//   });

//   try {
//     await beamsClient.start();
//     await beamsClient.addDeviceInterest(interest);
//     const deviceId = await beamsClient?.getDeviceId();
//     console.log("Successfully registered with Beams. Device ID:", deviceId)
//     return beamsClient;
//   }
//   catch (e) {
//     throw console.error(e);
//   }
// }
export default useWorker;
