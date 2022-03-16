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
