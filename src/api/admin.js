import { apiCall } from "../helper/api";
import { Notify } from "../helper/notify";

export const getSignupUsers = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/getSignupUsers";
    params.method = "POST";
    return dispatch(apiCall(params));
  };

// ****************************************************************************
export const declineUser = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/approveDeclineSignupUsers";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessDeclineUser));
  };
  const onSuccessDeclineUser = (response) => () => {
    console.log('onSuccessDeclineUser',response)
    Notify(response.data.message,'success')

  };
  // ****************************************************************************
  export const approveUser = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/approveDeclineSignupUsers";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessApproveUser));
  };
  
  const onSuccessApproveUser = (response) => () => {
    console.log('onSuccessApproveUser',response)
    Notify(response.data.message,'success')
  };

  // ****************************************************************************
  
  export const getApproveUsers = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/getApproveUsers";
    params.method = "POST";
    return dispatch(apiCall(params));
  };
  
  // ****************************************************************************
  
  export const getDeclineUsers = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/getDeclineUsers";
    params.method = "POST";
    return dispatch(apiCall(params));
  };

  /***************************************************************************** */
  
  export const deleteMessage = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/deletemessage";
    params.method = "POST";
    return dispatch(apiCall(params));
  };
  // ****************************************************************************
  
  export const deleteGroupMessage = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/deletegroupmessage";
    params.method = "POST";
    return dispatch(apiCall(params));
  };
  // ****************************************************************************
  
  export const deleteGroup = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/deletegroup";
    params.method = "POST";
    return dispatch(apiCall(params));
  };
  // ****************************************************************************
  
  
