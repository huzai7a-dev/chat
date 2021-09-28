import { isMoment } from "moment";

const appendArray = (formData, key, arrValue) => {
    arrValue.forEach((value, index) => {
        if (isMoment(value)) {
            return formData.append(`${key}[${index}]`, value.format("YYYY-MM-DD"));
        }

        if (value instanceof Array) {
            return appendArray(formData, `${key}[${index}]`, value)
        }

        if (value instanceof File) {
            return formData.append(`${key}[${index}]`, value, value.name);
        }

        if (value !== null && typeof value === typeof {}) {
            return appendObject(formData, `${key}[${index}]`, value)
        }

        formData.append(`${key}[${index}]`, value);
    })
}

const appendObject = (formData, mainKey, obj) => {
    Object.keys(obj).forEach((key, index) => {
        const value = obj[key];
        if (isMoment(value)) {
            return formData.append(`${mainKey}[${key}]`, value.format("YYYY-MM-DD"));
        }

        if (value instanceof Array) {
            return appendArray(formData, `${mainKey}[${key}]`, value)
        }

        if (value instanceof File) {
            return formData.append(`${mainKey}[${key}]`, value, value.name);
        }

        if (value !== null && typeof value === typeof {}) {
            return appendObject(formData, `${mainKey}[${key}]`, value)
        }

        formData.append(`${mainKey}[${key}]`, value);
    })
}

class Utils {
    static getFormData(obj = {}) {
        const formData = new FormData();
        for (const key in obj) {
            if (isMoment(obj[key])) {
                formData.append(key, obj[key].format("YYYY-MM-DD"));
                continue;
            }

            if (obj[key] instanceof Array) {
                appendArray(formData, key, obj[key])
                continue;
            }

            if (obj[key] instanceof File) {
                formData.append(key, obj[key]);
                continue;
            }

            if (obj[key] !== null && typeof obj[key] === typeof {}) {
                appendObject(formData, key, obj[key])
                continue;
            }

            formData.append(key, obj[key]);
        }
        return formData;
    }
}
export default Utils;