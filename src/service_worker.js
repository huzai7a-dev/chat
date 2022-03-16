self.addEventListener("activate", () => {
  const user_id = new URL(location).searchParams.get('user_id');
  self.registration.pushManager.getSubscription().then(async (subscription) => {
    if(!subscription) return;
    const response = await fetch("/worker/save-subs", {
      method: "POST",
      mode: "same-origin",
      cache: 'no-cache',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        user_id
      })
    })
    console.log("Save Response", response)
    console.log("Save Subscription", subscription)
  }).catch(e => {
    console.log("Get Subscription", e)
  });
});

// self.addEventListener('fetch', () => console.log("fetch"));

self.addEventListener("push", (event) => {
  const notification = event.data.json();

  const promiseChain = self.registration.showNotification(notification.title, {
    body: notification.text,
    icon: notification.image ? `/bizzportal/public/img/${notification.image}` : '/BizzWorldLogo.png',
    // actions: [{
    //   action: "Open Chat",
    //   title: "BizzChat",
    //   icon: "/favicon.png"
    // }],
    badge: "/BizzWorldLogo.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200]
  });

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function (event) {
  console.log('On notification click: ', event.notification);
  event.notification.close();

  // event.waitUntil(clients.matchAll({
  //   type: "window"
  // }).then(function(clientList) {
  //   for (var i = 0; i < clientList.length; i++) {
  //     var client = clientList[i];
  //     if (client.url == '/' && 'focus' in client)
  //       return client.focus();
  //   }
  //   if (clients.openWindow)
  //     return clients.openWindow('/');
  // }));
});
