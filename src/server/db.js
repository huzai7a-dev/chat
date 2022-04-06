import { isMoment } from "moment";
import FormData from "form-data";
import path from 'path'
import fs from 'fs';

const sqlite3 = require('sqlite3').verbose();

const connection = new sqlite3.Database(
  path.resolve(process.cwd(), "db.sqlite3"),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the subscription database.");
  }
);

const appendArray = (formData, key, arrValue) => {
  arrValue.forEach((value, index) => {
    if (isMoment(value)) {
      return formData.append(`${key}[${index}]`, value.format("YYYY-MM-DD"));
    }

    if (value instanceof Array) {
      return appendArray(formData, `${key}[${index}]`, value);
    }

    if (typeof value == "object" && "buffer" in value) {
      return formData.append(`${key}[${index}]`, value.buffer, {
        filename: value.originalname,
      });
    }

    if (typeof value == "object" && "path" in value && "originalname" in value && "mimetype" in value) {
      return formData.append(`${key}[${index}]`, fs.createReadStream(value.path), {
        filename: value.originalname, 
        contentType: value.mimetype
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
    if (typeof value == "object" && "buffer" in value) {
      return formData.append(`${key}[${index}]`, value.buffer, {
        filename: value.originalname,
      });
    }

    // eslint-disable-next-line no-prototype-builtins
    if (typeof value == "object" && "path" in value && "originalname" in value && "mimetype" in value) {
      return formData.append(`${key}[${index}]`, fs.createReadStream(value.path), {
        filename: value.originalname, 
        contentType: value.mimetype
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
    if (typeof obj[key] == "object" && "buffer" in obj[key]) {
      // formData.append(`${key}[${index}]`, Readable.from(value.buffer.toString()), value.originalname)
      formData.append(key, obj[key].buffer, {
        filename: obj[key].originalname,
      });
      continue;
    }

    if (typeof obj[key] == "object" && "path" in obj[key] && "originalname" in obj[key] && "mimetype" in obj[key]) {
      formData.append(key, fs.createReadStream(obj[key].path), {
        filename: obj[key].originalname, 
        contentType: obj[key].mimetype
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
