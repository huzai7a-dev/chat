import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const useWorker = () => {
  
  const auth_user = useSelector(store => store.auth.auth_user);

  const initWorker = useCallback(async (user_id) => {
    if (!("Notification" in window)) return console.log("This browser does not support desktop notification");

    if (Notification.permission !== "denied" && Notification.permission !== "granted") {
      // Requesting Permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return console.log("permission is denied")
    }

    if (!("serviceWorker" in navigator)) return console.log("serviceWorker is not supported");

    try {

      // Remove any service worker that doesn't belong to this user's id
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        if (!registration.active.scriptURL.includes(`/service-worker?user_id=${user_id}`)) {
          await registration.unregister();
        }
      }

      const registration = (await navigator.serviceWorker.getRegistration('/service-worker')) ||
        (await navigator.serviceWorker.register(`/service-worker?user_id=${user_id}`));
      
        const subscription =
        (await registration.pushManager.getSubscription()) ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(
            "BCGDIfnAeJn_Pkpz9nFdOjbLNDsGE15JKZbVwNMlJquDYx5DtmVyJWuRXBDUmB2qhakY43zrEOrc5VgL_7VFcvY"
          ),
        }));
        
      fetch("/worker/save-subs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          user_id,
        }),
      });
    } catch (e) {
      console.log(e);
    }
  },[]);
  
  useEffect(() => {
    if (auth_user?.elsemployees_empid) {
      initWorker(auth_user?.elsemployees_empid);
    }
  }, [auth_user, initWorker]);

};

export default useWorker;
