import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

const useWorker = () => {
  
  const { auth_user } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {}
    }
  });

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

  const initWorker = useCallback(async (user_id) => {
    if (!("Notification" in window)) {
      throw console.log("This browser does not support desktop notification");
    }

    if (
      Notification.permission !== "denied" &&
      Notification.permission !== "granted"
    ) {
      await Notification.requestPermission().then(
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
    try {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          if (
            !registration.active.scriptURL.includes("/service-worker?user_id")
          ) {
            registration.unregister();
          }
        }
      });
      const reg =
        (await navigator.serviceWorker.getRegistration()) ||
        (await navigator.serviceWorker.register(
          `/service-worker?user_id=${auth_user?.elsemployees_empid}`,
          {scope: '.' }
        ));
      const sub =
        (await reg.pushManager.getSubscription()) ||
        (await reg.pushManager.subscribe({
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
          subscription: sub,
          user_id,
        }),
      });
    } catch (e) {
      console.log(e);
    }
  },[auth_user?.elsemployees_empid]);
  useEffect(() => {
    if (auth_user?.elsemployees_empid) {
      initWorker(auth_user?.elsemployees_empid);
    }
  }, [auth_user, initWorker]);
};

export default useWorker;
