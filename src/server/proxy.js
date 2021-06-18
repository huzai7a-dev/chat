import express from "express";
import axios from "axios";
import multer from "multer";
import env from "../env.json";
import { saveSubscription } from "./webpush";
import { getFormData } from "./db";

const router = express.Router();

const isValidSaveRequest = (req, res) => {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.subscription) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: {
          id: "no-endpoint",
          message: "Subscription must have an endpoint.",
        },
      })
    );
    return false;
  }
  return true;
};

router.use("/api/*", multer().any(), (req, res, next) => {
  const contentType = req.get("content-type") || "application/json";

  const body = {};
  Object.keys(req.body).forEach((k) => (body[k] = req.body[k]));

  const axiosRoute = {
    params: req.params,
    headers: req.originalUrl.includes('/public/') ? undefined : { "Content-Type": contentType },
    url: `${env.url}${req.originalUrl.replace("/api", "")}`,
    method: req.method,
    responseType: req.originalUrl.includes('/public/') ? "arraybuffer" : "json",
  };

  if (contentType?.includes("form")) {
    axiosRoute.headers["Content-Type"] = "application/json";
    const data = Object.assign({}, body, { message_attachment: req.files });

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
        return res.status(response.status).send(response.data);
      } else {
        return res.status(500).send("Server not Responding");
      }
    });
});

router.use("/service-worker", async (req, res, next) => {
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

export default router;
