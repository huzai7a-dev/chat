import webpush from "web-push";
import { deleteSubscription, getSubscriptionByUser, saveSubscription } from "./subscription";
import express from 'express';
import multer from "multer";
import { saveFCMToken, getFCMTokenByUser, sendNotificationToFCMToken } from "./fcmToken";

const router = express.Router();

webpush.setGCMAPIKey(process.env.RAZZLE_GCM_API);
webpush.setVapidDetails(
  process.env.RAZZLE_VAPID_SUBJECT,
  process.env.RAZZLE_VAPID_PUBLIC_KEY,
  process.env.RAZZLE_VAPID_PRIVATE_KEY
);

export const triggerPushMsg = async (user_id, dataToSend = "Empty Notification") => {
  const subscription = await getSubscriptionByUser(user_id);
  if (subscription) {
    try {
      await webpush.sendNotification(
        subscription,
        typeof dataToSend == typeof "" ? dataToSend : JSON.stringify(dataToSend)
      )
    } catch (e) {
      console.log("Trigger Push Message Error", e);
      subscription?.unsubscribe();
      deleteSubscription(user_id).catch(() => e);
      throw e;
    }
  }
  const deviceToken = await getFCMTokenByUser(user_id)
  if (deviceToken) {
    try {
      await sendNotificationToFCMToken(
        user_id,
        typeof dataToSend == typeof "" ? dataToSend : JSON.stringify(dataToSend)
      );
    } catch (e) {
      console.log(e)
    }
  }
  return null;
};

router.post("/save-subs", async (req, res) => {
  if (!req.body.user_id || !req.body.subscription) {
    return;
  }

  await saveSubscription(req.body.user_id, req.body.subscription);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ data: { success: true } }));
});

router.post("/:user_id/trigger", multer({ dest: "./uploads" }).single('image'), async (req, res) => {
  try {
    const notification = {
      title: req.body?.title || "John Doe",
      text: req.body?.text || "You are next",
      image: req.file || null,
      type: req.body?.type || "message"
    };
    res.status(200).send(await triggerPushMsg(req.params.user_id, notification))
  } catch (e) {
    res.status(404).send("Cannot send notification to the user at the moment")
  }
});

router.post("/save-token", async (req, res) => {
  if (!req.body.user_id || !req.body.token) {
    return;
  }

  await saveFCMToken(req.body.user_id, req.body.token);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ data: { success: true } }));

});

export default router;
