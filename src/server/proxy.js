import express from "express";
import axios from "axios";
import multer from "multer";
import env from '../env.json';
import fs from 'fs';
import { sendNotification } from "./webpush";

const router = express.Router();

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

router.use('/service_worker', async (req, res, next) => {
  // return res.sendFile();
  // return res.sendFile(`${process.cwd()}\\src\\service_worker.js`)
  sendNotification("Sent")
})

export default router;
