import { apiCall } from "../helper/api";

export const deleteUserSubscription = (params = {}) => (dispatch, getState) => {
    params.path = `/worker/${params.user_id || getState().auth.auth_user?.elsemployees_empid}`;
    params.method = "DELETE";
    return dispatch(apiCall(params));
};

export const remotelyNotify = (params = {}) => (dispatch, getState) => {
    params.path = `/worker/${params.user_id || getState().auth.auth_user?.elsemployees_empid}/trigger`;
    params.method = "POST";
    return dispatch(apiCall(params));
};

export const notifyMissedCall = (params = {}) => (dispatch, getState) => {
    params.data = {
        title: "Missed Call",
        text: `${getState().auth.auth_user?.elsemployees_name || getState().auth.auth_user?.elsemployees_empid || "Someone"} wants to call`,
        type: "message",
    }
    return dispatch(remotelyNotify(params));
};
