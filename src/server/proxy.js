import express from "express";
import axios from "axios";
import multer from "multer";
import { getSubscriptions, saveSubscription, triggerPushMsg } from "./webpush";
import { getFormData } from "./db";

const router = express.Router();

router.use("/api/*", multer().any(), (req, res) => {
  const contentType = req.get("content-type") || "application/json";

  const body = {};
  Object.keys(req.body).forEach((k) => (body[k] = req.body[k]));

  const axiosRoute = {
    params: req.params,
    headers: req.originalUrl.includes('/public/') ? undefined : { "Content-Type": contentType },
    url: `${process.env.RAZZLE_BASE_URL}${req.originalUrl.replace("/api", "")}`,
    method: req.method,
    responseType: req.originalUrl.includes('/public/') ? "arraybuffer" : "json",
  };

  if (contentType?.includes("form")) {
    axiosRoute.headers["Content-Type"] = "application/json";
    const attachmentFile = {}
    if (req.files[0]?.fieldname !== "message_attachment[0]") {
      attachmentFile[req.files[0]?.fieldname] = req.files
    }else {
      attachmentFile["message_attachment"] = req.files
    }
    const data = Object.assign({}, body, attachmentFile);
    const formData = getFormData(data)
    axiosRoute.headers = formData.getHeaders();
    axiosRoute.data = formData;
  } else {
    axiosRoute.data = body;
  }

  axios(axiosRoute)
    .then((r) => {
      for (let key in r.headers) {
        res.setHeader(key, r.headers[key]);
      }

      if(req.originalUrl.includes('/public/')) {
        return res.end(r.data);
      }
      
      return res.status(r.status).send(r.data);
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

router.use("/bizzportal/*", (req, res) => {
  const axiosRoute = {
    // params: req.params,
    // headers: req.headers,
    url: `${process.env.RAZZLE_BASE_URL}${req.originalUrl}`,
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
        return res.status(response.status).send(response.data);
      } else {
        return res.status(500).send("Server not Responding");
      }
    });
});

router.use("/service-worker", async (req, res) => {
  return res.sendFile(`${process.cwd()}\\src\\service_worker.js`);
});

router.post("/worker/save-subs", async (req, res) => {
  if (!req.body.user_id || !req.body.subscription) {
    return;
  }

  await saveSubscription(req.body.user_id, req.body.subscription);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ data: { success: true } }));
});

router.get("/subscription", async(req, res) => {
  try {
    res.status(200).send(await getSubscriptions());
  } catch(e) {
    res.send(500).send(e);
  }
})

router.get("/worker/trigger/:user_id", async(req, res) => {
  try {
    const notification = {
      title: "John Doe",
      text: "You are next",
      image: null,
    };
    res.status(200).send(await triggerPushMsg(req.params.user_id, notification))
  } catch(e) {
    res.status(500).send(e)
  }
})

export default router;
