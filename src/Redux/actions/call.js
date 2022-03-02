import { SET_CALLING_TO_USER, SET_ACTIVE_CALLER } from "../constant/call"

export const setCallingToUser = (callingTo) => {
    return {
        type: SET_CALLING_TO_USER,
        callingTo
    }
}

export const setActiveCaller = (activeCaller) => {
    return {
        type: SET_ACTIVE_CALLER,
        activeCaller
    }
}