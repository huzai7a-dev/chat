import App from "./App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import cors from 'cors';
import { renderToString } from "react-dom/server";
import proxyRoutes from './server/proxy'
import socketRoutes from './server/socket'
import webpushRoutes from './server/webpush'
import subscriptionRoutes from "./server/subscription";
import fcmRoutes from "./server/fcmToken";
import { GREY, LIGHT, PRIMARYLIGHT, PRIMARYMAIN, BLACK, SECONDARYMAIN, SECONDARYLIGHT, WHITE } from "./Theme/colorConstant";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map((asset) => `<link rel="stylesheet" href="${asset}">`)
          .join("")
      : ""
    : "";
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = "") => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map((asset) => `<script src="${asset}"${extra}></script>`)
          .join("")
      : ""
    : "";
};

const server = express()
  .disable("x-powered-by")
  .use(cors())
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/dialpad',(req, res) => res.sendFile('dialpad.html', {root:process.env.RAZZLE_PUBLIC_DIR}))
  .use('/socket', socketRoutes)
  .use('/subscription', subscriptionRoutes)
  .use('/fcm-token', fcmRoutes)
  .use('/worker', webpushRoutes)
  .use(proxyRoutes)
  .get("/*", (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.png" />
    <style> 
    :root {
      --chat-primary: ${PRIMARYMAIN};
      --chat-primary-light: ${PRIMARYLIGHT};
      --chat-grey: ${GREY};
      --chat-black: ${BLACK};
      --chat-light: ${LIGHT};
      --chat-secondary: ${SECONDARYMAIN};
      --chat-secondary-light: ${SECONDARYLIGHT};
      --chat-white: ${WHITE};
    }
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="/logo192.png" />

    <link rel="manifest" href="/manifest.json" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    ${cssLinksFromAssets(assets, "client")}
    <title>Bizz Chat</title>
  </head>
    <body>
        <div id="root">${markup}</div>
        <audio id="remoteVideo"></audio>
        ${jsScriptTagsFromAssets(assets, "client", " defer crossorigin")}
    </body>
</html>`
      );
    }
  });

export default server;
