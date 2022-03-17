self.addEventListener("activate", () => {
  const user_id = new URL(location).searchParams.get('user_id');
  self.registration.pushManager.getSubscription().then(async (subscription) => {
    if (!subscription) return;
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
  const data = {
    body: notification.text,
    icon: notification.image ? `/bizzportal/public/img/${notification.image}` : '/BizzWorldLogo.png',
    badge: "/BizzWorldLogo.png",
    data: notification.data,
    vibrate: [200, 100, 200, 100, 200, 100, 200]
  }

  if (notification.type == 'incoming-call') {
    data.actions = [
      {
        action: "accept",
        title: "Accept",
      },
      {
        action: "reject",
        title: "Reject",
      }
    ];
  }

  const promiseChain = self.registration.showNotification(notification.title, data);
  event.waitUntil(promiseChain);
});

const processCallingEvent = (client, event) => {
  if (client.focus) client.focus();
  switch (event.action) {
    case "reject": {
      return client.postMessage({
        type: "call::reject",
      })
    }
    case "accept": {
      return client.postMessage({
        type: "call::accept",
        data: event.notification.data
      })
    }
    default: {
      if (client.focus) client.focus();
    }
  }
}

self.addEventListener('notificationclick', function (event) {
  event.waitUntil(self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clientList) {
    if (clientList.length) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        processCallingEvent(client, event)
      }
    } else {
      self.clients.openWindow(self.location.origin).then(client => {
        processCallingEvent(client, event)
      });
    }
  }));
  event.notification.close();
});
