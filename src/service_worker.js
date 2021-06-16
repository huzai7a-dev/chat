

self.addEventListener("activate", () => {
  const user_id = new URL(location).searchParams.get('user_id');
  self.registration.pushManager.getSubscription().then((subscription) => {
    return fetch("/worker/save-subs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        user_id
      })
    })
      .then((response) => {
        console.log("Save Response", response)
        console.log("Save Subscription", subscription)
      }).catch(e => console.log(e));
  }).catch(e => {
    console.log("Get Subscription", e)
  });
})

self.addEventListener("push", (event) => {
  const promiseChain = self.registration.showNotification(event.data.text());
  event.waitUntil(promiseChain);
});
