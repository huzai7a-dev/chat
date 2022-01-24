import { isMoment } from "moment";
import FormData from "form-data";
import path from 'path'
const sqlite3 = require('sqlite3').verbose();

const connection = new sqlite3.Database(
  path.resolve(process.cwd(), "subscriptions.db"),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the subscription database.");
  }
);

connection.run(
  `CREATE TABLE IF NOT EXISTS Subscription (user_id TEXT PRIMARY KEY, endpoint TEXT, expirationTime TEXT, p256dh TEXT, auth TEXT)`
);

const appendArray = (formData, key, arrValue) => {
  arrValue.forEach((value, index) => {
    if (isMoment(value)) {
      return formData.append(`${key}[${index}]`, value.format("YYYY-MM-DD"));
    }

    if (value instanceof Array) {
      return appendArray(formData, `${key}[${index}]`, value);
    }

    // eslint-disable-next-line no-prototype-builtins
    if (value.hasOwnProperty("buffer")) {
      return formData.append(`${key}[${index}]`, value.buffer, {
        filename: value.originalname,
      });
    }

    if (value !== null && typeof value === typeof {}) {
      return appendObject(formData, `${key}[${index}]`, value);
    }

    formData.append(`${key}[${index}]`, value);
  });
};

const appendObject = (formData, mainKey, obj) => {
  Object.keys(obj).forEach((key, index) => {
    const value = obj[key];
    if (isMoment(value)) {
      return formData.append(`${mainKey}[${key}]`, value.format("YYYY-MM-DD"));
    }

    if (value instanceof Array) {
      return appendArray(formData, `${mainKey}[${key}]`, value);
    }

    // eslint-disable-next-line no-prototype-builtins
    if (value.hasOwnProperty("buffer")) {
      return formData.append(`${key}[${index}]`, value.buffer, {
        filename: value.originalname,
      });
    }

    if (value !== null && typeof value === typeof {}) {
      return appendObject(formData, `${mainKey}[${key}]`, value);
    }

    formData.append(`${mainKey}[${key}]`, value);
  });
};

export const getFormData = (obj = {}) => {
  const formData = new FormData();
  for (const key in obj) {
    if (isMoment(obj[key])) {
      formData.append(key, obj[key].format("YYYY-MM-DD"));
      continue;
    }

    if (obj[key] instanceof Array) {
      appendArray(formData, key, obj[key]);
      continue;
    }

    // eslint-disable-next-line no-prototype-builtins
    if (obj[key]?.hasOwnProperty("buffer")) {
      // formData.append(`${key}[${index}]`, Readable.from(value.buffer.toString()), value.originalname)
      formData.append(key, obj[key].buffer, {
        filename: obj[key].originalname,
      });
      continue;
    }

    if (obj[key] !== null && typeof obj[key] === typeof {}) {
      appendObject(formData, key, obj[key]);
      continue;
    }

    formData.append(key, obj[key]);
  }
  return formData;
};

export default connection;
