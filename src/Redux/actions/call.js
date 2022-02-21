import { SET_CALLING_USER } from "../constant/call"

export const setCallingUser = (callingUser) => {
    return {
        type: SET_CALLING_USER,
        callingUser
    }
}