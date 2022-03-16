import { apiCall } from "../helper/api";

export const deleteUserSubscription = (params = {}) => (dispatch, getState) => {
    params.path = `/worker/${params.user_id || getState().auth?.elsemployees_empid}`;
    params.method = "DELETE";
    return dispatch(apiCall(params));
};

export const remotelyNotify = (params = {}) => (dispatch, getState) => {
    params.path = `/worker/${params.user_id || getState().auth?.elsemployees_empid}`;
    params.method = "POST";
    return dispatch(apiCall(params));
};

export const notifyMissedCall = (params = {}) => (dispatch, getState) => {
    params.path = `/worker/${params.user_id}`;
    params.method = "POST";
    params.data = {
        title: "Missed Call",
        text: `${getState().auth?.elsemployees_name || getState().auth?.elsemployees_empid} wants to call`,
        type: "message",
    }
    return dispatch(apiCall(params));
};
