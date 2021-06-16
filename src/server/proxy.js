import express from "express";
import axios from "axios";
import multer from "multer";
import env from '../env.json';
import fs from 'fs';
import { saveSubscription, sendNotification, triggerPushMsg } from "./webpush";

const router = express.Router();

const isValidSaveRequest = (req, res) => {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.subscription) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
    return false;
  }
  return true;
};

router.use("/api/*", multer().any(), (req, res, next) => {
  const axiosRoute = {
    params: req.params,
    // headers: req.headers,
    url: `${env.url}${req.originalUrl.replace("/api", "")}`,
    method: req.method,
    data: req.body,
  };

  axios(axiosRoute)
    .then((r) => {
      // console.log(r.data);
      return res.status(r.status).json(r.data);
    })
    .catch((e) => {
      const { response } = e;
      if (response) {
        return res.status(response.status).send(response.data);
      } else {
        return res.status(500).send("Server not Responding");
      }
    });
});

router.use("/bizzportal/*", (req, res, next) => {
  const axiosRoute = {
    // params: req.params,
    // headers: req.headers,
    url: `${env.url}${req.originalUrl}`,
    method: req.method,
    // data: req.body,
    responseType: "arraybuffer",
  };
  axios(axiosRoute)
    .then((r) => {
      for (let key in r.headers) {
        res.setHeader(key, r.headers[key]);
      }
      return res.end(r.data);
    })
    .catch((e) => {
      const { response } = e;
      if (response) {
        return res.status(response.status).send(response.data, "binary");
      } else {
        return res.status(500).send("Server not Responding");
      }
    });
});

router.use('/service-worker', async (req, res, next) => {
  return res.sendFile(`${process.cwd()}\\src\\service_worker.js`)
})

router.post('/worker/save-subs', async (req, res) => {
  if(!req.body.user_id || !req.body.subscription) {
    return 
  }
  
  await saveSubscription(req.body.user_id, req.body.subscription);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ data: { success: true } }));
})

export default router;
