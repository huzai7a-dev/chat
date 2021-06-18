import mysql from 'mysql';
import env from '../env.json';
import { isMoment } from 'moment';
import FormData from 'form-data';
import { Readable } from 'stream';

const connection = mysql.createConnection({
  host     : "192.168.0.7",
  user     : 'crmreact',
  password : '123',
  database: "bwchrms",
});
 
connection.connect((err)=> {
  if (err) return console.error('error connecting: ' + err.stack);
  console.log('connected as id ' + connection.threadId);
});

const appendArray = (formData, key, arrValue) => {
  arrValue.forEach((value, index) => {
    if(isMoment(value)){
      return formData.append(`${key}[${index}]`, value.format("YYYY-MM-DD"));
    }
    
    if(value instanceof Array) {
      return appendArray(formData, `${key}[${index}]`, value)
    }

    if(value.hasOwnProperty('buffer')) {
      return formData.append(`${key}[${index}]`, value.buffer, {filename: value.originalname})
    }

    if(value !== null && typeof value === typeof {}) {
      return appendObject(formData, `${key}[${index}]`, value)
    }

    formData.append(`${key}[${index}]`, value);
  })
}

const appendObject = (formData, mainKey, obj) => {
  Object.keys(obj).forEach((key, index) => {
    const value = obj[key];
    if(isMoment(value)){
      return formData.append(`${mainKey}[${key}]`, value.format("YYYY-MM-DD"));
    }
    
    if(value instanceof Array) {
      return appendArray(formData, `${mainKey}[${key}]`, value)
    }

    if(value.hasOwnProperty('buffer')) {
      return formData.append(`${key}[${index}]`, value.buffer,{filename: value.originalname})
    }

    if(value !== null && typeof value === typeof {}) {
      return appendObject(formData, `${mainKey}[${key}]`, value)
    }

    formData.append(`${mainKey}[${key}]`, value);
  })
}

export const getFormData = (obj = {}) => {
    const formData = new FormData();
    for (const key in obj) {
      if(isMoment(obj[key])){
        formData.append(key, obj[key].format("YYYY-MM-DD"));
        continue;
      }

      if(obj[key] instanceof Array) {
        appendArray(formData, key, obj[key])
        continue;
      }

      if(obj[key]?.hasOwnProperty('buffer')) {
        // formData.append(`${key}[${index}]`, Readable.from(value.buffer.toString()), value.originalname)
        formData.append(key, obj[key].buffer, {filename: obj[key].originalname});
        continue;
      }

      if(obj[key] !== null && typeof obj[key] === typeof {}) {
        appendObject(formData, key, obj[key])
        continue;
      }

      formData.append(key, obj[key]);
    }
    return formData;
  
}

export default connection;