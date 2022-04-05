import connection from "./db";
import express from 'express';

const router = express.Router();
const TABLE_NAME = "Subscription";

connection.run(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (user_id TEXT PRIMARY KEY, endpoint TEXT, expirationTime TEXT, p256dh TEXT, auth TEXT)`
);

export const getSubscriptionByUser = (user_id) => new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${TABLE_NAME} WHERE user_id = ${user_id}`;
    connection.get(query, (error, result) => {
        if (error) return reject(error);
        if(!result) return resolve(result);
        const subscription = {
            endpoint: result?.endpoint,
            expirationTime: result?.expirationTime,
            keys: {
                p256dh: result?.p256dh,
                auth: result?.auth,
            },
        };
        resolve(subscription);
    }
    );
});

export const saveSubscription = (user_id, subscription) => new Promise((resolve, reject) => {

    if (!subscription) return resolve(subscription);

    const query = `INSERT INTO ${TABLE_NAME}(user_id,endpoint,expirationTime,p256dh,auth)
    VALUES('${user_id}','${subscription.endpoint}','${subscription.expirationTime}','${subscription.keys.p256dh}','${subscription.keys.auth}')
    ON CONFLICT(user_id)
    DO UPDATE SET endpoint='${subscription.endpoint}',expirationTime='${subscription.expirationTime}',p256dh='${subscription.keys.p256dh}',auth='${subscription.keys.auth}'`;

    connection.run(query, (results, error) => {
        if (error) return reject(error);
        resolve(results);
    });
});

export const getSubscriptions = () => new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${TABLE_NAME}`
    connection.all(query, (error, rows) => {
        if (error) return reject(error);
        resolve(rows);
    })
});

export const deleteSubscription = (user_id) => new Promise((resolve, reject) => {
    const query = `DELETE FROM ${TABLE_NAME} WHERE user_id='${user_id}'`;
    connection.run(query, (results, error) => {
        if (error) return reject(error);
        resolve(results)
    });
})

router.get("/", async (req, res) => {
    try {
        res.status(200).send(await getSubscriptions());
    } catch (e) {
        res.send(500).send(e);
    }
});

router.delete("/:user_id", async(req, res) => {
    if(!req.params?.user_id) return res.status(403).send("User id is missing");
    return res.json(await deleteSubscription(req.params?.user_id));
  });

export default router;