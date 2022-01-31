import { isMoment } from "moment";

const appendArray = (formData, key, arrValue) => {
    arrValue.forEach((value, index) => {
        if (isMoment(value)) {
            return formData.append(`${key}[${index}]`, value.format("YYYY-MM-DD"));
        }

        if (value instanceof Array) {
            return appendArray(formData, `${key}[${index}]`, value)
        }

        if (value instanceof File || value instanceof Blob) {
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

        if (value instanceof File || value instanceof Blob) {
            return formData.append(`${mainKey}[${key}]`, value, value.name);
        }

        if (value !== null && typeof value === typeof {}) {
            return appendObject(formData, `${mainKey}[${key}]`, value)
        }

        formData.append(`${mainKey}[${key}]`, value);
    })
}
export const mergeArray = (arr1 = [], arr2 = [], key = "") =>  {
    const reduced = !arr1 || arr1.length === 0? arr1 : arr1.filter((aitem) => {
      return !arr2.find((bitem) => aitem[key] === bitem[key]);
    }) || [];
    return reduced.concat(arr2);
  }

  export const getFileFromBlob = async(blobUrl)=>{
    const blob = await fetch(blobUrl).then((r) => r.blob());
    const file = new File([blob], "audio.wav", { type: blob.type });
    return file;
}

export const filterList = (value, filterBy)=>{
    return value?.toLowerCase()?.indexOf(filterBy) >= 0;
}

export const placeCaretAtEnd =(el)=> {
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        const textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

export const getCSSColor = (key) => {
    try {
        return window.getComputedStyle(document.querySelector(':root'))?.getPropertyValue(key)?.trimEnd()?.trimStart();
    } catch(e) {
        return "";
    }
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

            if (obj[key] instanceof File || obj[key] instanceof Blob) {
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