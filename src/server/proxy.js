import express from "express";
import axios from "axios";
import multer from "multer";
import { getFormData } from "./db";

const router = express.Router();

router.use("/api/*", multer({dest: "./uploads"}).any(), (req, res) => {
  const contentType = req.get("content-type") || "application/json";

  const body = {};
  Object.keys(req.body).forEach((k) => (body[k] = req.body[k]));

  const axiosRoute = {
    params: req.params,
    headers: req.originalUrl.includes('/public/') ? undefined : { "Content-Type": contentType },
    url: `${process.env.RAZZLE_BASE_URL}${req.originalUrl.replace("/api", "")}`,
    method: req.method,
    responseType: req.originalUrl.includes('/public/') ? "arraybuffer" : "json",
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  };

  if (contentType?.includes("form")) {
    axiosRoute.headers["Content-Type"] = "application/json";
    const data = Object.assign({}, body, req.files.reduce((result, value) => {
      result[value.fieldname] = value;
      return result;
    }, {}));
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
        return res.status(500).send(e);
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
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
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
        return res.status(500).send(e);
      }
    });
});

router.get("/service-worker", async (req, res) => {
  return res.sendFile(`${process.cwd()}\\src\\service_worker.js`);
});

export default router;
