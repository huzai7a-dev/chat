import webpush from "web-push";
import { deleteSubscription, getSubscriptionByUser, saveSubscription } from "./subscription";
import express from 'express';
import multer from "multer";

const router = express.Router();

webpush.setGCMAPIKey("AIzaSyDQDWntetf2pfy6AHD2aCElQ19byjRYhew");
webpush.setVapidDetails(
  "mailto:avidhaus.ahsan@gmail.com",
  "BCGDIfnAeJn_Pkpz9nFdOjbLNDsGE15JKZbVwNMlJquDYx5DtmVyJWuRXBDUmB2qhakY43zrEOrc5VgL_7VFcvY",
  "xhtf5iVxz1x8ILcTYdglXca-FQfVIk39T_cJvHCYGLE"
);

export const triggerPushMsg = async (user_id, dataToSend = "Empty Notification") => {
  const subscription = await getSubscriptionByUser(user_id);
  if(subscription) {
    try {
      return await webpush.sendNotification(
        subscription, 
        typeof dataToSend == typeof "" ? dataToSend : JSON.stringify(dataToSend)
      )
    } catch(e) {
      console.log("Trigger Push Message Error", e);
      deleteSubscription(user_id)
      subscription?.unsubscribe();
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

router.post("/:user_id/trigger", multer({dest: "./uploads"}).single('image'),  async(req, res) => {
  try {
    const notification = {
      title: req.body?.title || "John Doe",
      text: req.body?.text ||  "You are next",
      image: req.file || null,
    };
    res.status(200).send(await triggerPushMsg(req.params.user_id, notification))
  } catch(e) {
    res.status(500).send(e)
  }
});

export default router;
