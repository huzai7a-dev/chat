import { SET_AUTH_USER } from "../constant/auth"

export const setAuthUser = (auth_user) => {
    return {
        type: SET_AUTH_USER,
        auth_user,
    }
}