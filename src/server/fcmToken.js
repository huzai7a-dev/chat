// *This File is NOT intended to reflect upon FCM Token but is management to FCM token to manually notify on device token*

import connection from "./db";
import express from 'express';
import axios from "axios";

const router = express.Router();
const TABLE_NAME = "FCM_Token";

connection.run(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (user_id TEXT PRIMARY KEY, token TEXT)`
);

export const getFCMTokenByUser = (user_id) => new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${TABLE_NAME} WHERE user_id = ${user_id}`;
    connection.get(query, (error, result) => {
        if (error) return reject(error);
        if (!result) return resolve(result);
        resolve(result?.token);
    }
    );
});

export const saveFCMToken = (user_id, token) => new Promise((resolve, reject) => {

    if (!token) return resolve(token);

    const query = `INSERT INTO ${TABLE_NAME}(user_id,token)
    VALUES('${user_id}','${token}')
    ON CONFLICT(user_id)
    DO UPDATE SET token='${token}'`;

    connection.run(query, (results, error) => {
        if (error) return reject(error);
        resolve(results);
    });
});

export const getFCMTokens = () => new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${TABLE_NAME}`
    connection.all(query, (error, rows) => {
        if (error) return reject(error);
        resolve(rows);
    })
});

export const deleteFCMToken = (user_id) => new Promise((resolve, reject) => {
    const query = `DELETE FROM ${TABLE_NAME} WHERE user_id='${user_id}'`;
    connection.run(query, (results, error) => {
        if (error) return reject(error);
        resolve(results)
    });
})

export const sendNotificationToFCMToken = async (user_id, notification) => {
    const fcmToken = await getFCMTokenByUser(user_id);
    if(!fcmToken) return;
    await axios({
        url: 'https://fcm.googleapis.com/fcm/send',
        data: {
            "to": fcmToken,
            "collapse_key": "type_a",
            "notification": {
                "body": notification.text,
                "title": notification.title
            },
            "data": {
                ...notification,
                "body": notification.text,
                "title": notification.title,
            }
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${process.env.RAZZLE_SERVER_KEY}`
        },
        method: "POST",
    })
}

router.get("/", async (req, res) => {
    try {
        res.status(200).send(await getFCMTokens());
    } catch (e) {
        res.send(500).send(e);
    }
});

router.delete("/:user_id", async (req, res) => {
    if (!req.params?.user_id) return res.status(403).send("User id is missing");
    return res.json(await deleteFCMToken(req.params?.user_id));
});

export default router;