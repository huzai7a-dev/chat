import { apiCall } from "../helper/api";
import { Notify } from "../helper/notify";

export const getSignupUsers = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/getSignupUsers";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetSignupUsers, onFailureGetSignupUsers));
  };
  
  const onSuccessGetSignupUsers = (response, params) => (dispatch) => {
    console.log('onSuccessGetSignupUsers',response)
  };
  
  const onFailureGetSignupUsers = (error, params) => (dispatch) => {
    console.log("onFailureGetSignupUsers", error);
  };

// ****************************************************************************
export const declineUser = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/approveDeclineSignupUsers";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessDeclineUser, onFailureDeclineUser));
  };
  const onSuccessDeclineUser = (response, params) => (dispatch) => {
    console.log('onSuccessDeclineUser',response)
    Notify(response.data.message,'success')

  };
  
  const onFailureDeclineUser = (error, params) => (dispatch) => {
    console.log("onFailureDeclineUser", error);
  };
  // ****************************************************************************
  export const approveUser = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/approveDeclineSignupUsers";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessApproveUser, onFailureApproveUser));
  };
  
  const onSuccessApproveUser = (response, params) => (dispatch) => {
    console.log('onSuccessApproveUser',response)
    Notify(response.data.message,'success')
  };
  
  const onFailureApproveUser = (error, params) => (dispatch) => {
    console.log("onFailureApproveUser", error);
  };
  // ****************************************************************************
  
  export const getApproveUsers = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/getApproveUsers";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetApproveUsers, onFailuregetApproveUsers));
  };
  
  const onSuccessGetApproveUsers = (response, params) => (dispatch) => {
    console.log('onSuccessGetApproveUsers',response)
  };
  
  const onFailuregetApproveUsers = (error, params) => (dispatch) => {
    console.log("onFailuregetApproveUsers", error);
  };
  // ****************************************************************************
  
  export const getDeclineUsers = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/getDeclineUsers";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetDeclineUsers, onFailureGetDeclineUsers));
  };
  
  const onSuccessGetDeclineUsers = (response, params) => (dispatch) => {
    console.log('onSuccessGetDeclineUsers',response)
  };
  
  const onFailureGetDeclineUsers = (error, params) => (dispatch) => {
    console.log("onFailureGetDeclineUsers", error);
  };
  // ****************************************************************************
  
  
