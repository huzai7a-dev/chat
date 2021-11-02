import { apiCall } from "../helper/api";
import { Notify } from "../helper/notify";
import { setAdminGroupMessages, setAdminUserMessages, setContactsTotal, setGroupAttachments, setGroupMessages, setUserAttachments, setUserMessages } from "../Redux/actions/message";



export const sendMessage = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/sendMessage";
  params.method = "POST";
  return dispatch(apiCall(params, onFailureSendMessage));
};

const onFailureSendMessage = (error, params) => (dispatch) => {
  console.log("onFailureSendMessage", error);
};

/****************************************************************************************************************/
export const getUserMessages = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/fetchMessage";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetUserMessages, onFailureGetUserMessages));
  };
  
  const onSuccessGetUserMessages = (response, params) => (dispatch) => {
    dispatch(setUserMessages(response.data.messages));
  };
  
  const onFailureGetUserMessages = (error, params) => (dispatch) => {
    console.log("onFailureGetUserMessages", error);
  };
  /****************************************************************************************************************/

  export const sendGroupMessage = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/sendMessage";
    params.method = "POST";
    return dispatch(apiCall(params, onFailureSendGroupMessage));
  };
  
  
  const onFailureSendGroupMessage = (error, params) => (dispatch) => {
    console.log("onFailureSendGroupMessage", error);
  };
  

  /****************************************************************************************************************/

  export const getGroupMessages = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/fetchMessageGroup";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetGroupMessages, onFailureGetGroupMessages));
  };
  
  const onSuccessGetGroupMessages = (response, params) => (dispatch) => {
    dispatch(setGroupMessages(response.data));
  };
  
  const onFailureGetGroupMessages = (error, params) => (dispatch) => {
    console.log("onFailureGetGroupMessages", error);
  };

  export const getContactsTotal = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/getContactsTotal";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetContactsTotal, onFailureGetContactsTotal));
  };
  
  const onSuccessGetContactsTotal = (response, params) => (dispatch) => {
    dispatch(setContactsTotal(response.data));
  };
  
  const onFailureGetContactsTotal = (error, params) => (dispatch) => {
    console.log("onFailureGetContactsTotal", error);
  };


  /****************************************************************************************************************/
export const getMoreUserMessages = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchMoreMessage";
  params.method = "POST";
  return dispatch(apiCall(params,onFailureGetMoreUserMessages));
};



const onFailureGetMoreUserMessages = (error, params) => (dispatch) => {
  console.log("onFailureGetMoreUserMessages", error);
};

  /****************************************************************************************************************/
  export const getMoreGroupMessages = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/fetchMoreMessageGroup";
    params.method = "POST";
    return dispatch(apiCall(params, onFailureGetMoreGroupMessages));
  };
  
  const onFailureGetMoreGroupMessages = (error, params) => (dispatch) => {
    console.log("onFailureGetMoreGroupMessages", error);
  };

  /****************************************************************************************************************/
  export const getUserAttachments = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/fetchAttachments";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetUserAttachments, onFailureGetUserAttachments));
  };
  
  const onSuccessGetUserAttachments = (response, params) => (dispatch) => {
    
    return dispatch(setUserAttachments(response.data.attachments))
  };
  
  const onFailureGetUserAttachments = (error, params) => (dispatch) => {
    console.log("onFailureGetUserAttachments", error);
  };


  /****************************************************************************************************************/
  export const getGroupAttachments = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/fetchGroupAttachments";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetGroupAttachments, onFailureGetGroupAttachments));
  };
  
  const onSuccessGetGroupAttachments = (response, params) => (dispatch) => {
    return dispatch(setGroupAttachments(response.data.messages))
  };
  
  const onFailureGetGroupAttachments = (error, params) => (dispatch) => {
    console.log("onFailureGetGroupAttachments", error);
  };
  
    /****************************************************************************************************************/

    export const getAdminUserMessages = (params = {}) => (dispatch) => {
      params.path = "/api/bwccrm/fetchMessage";
      params.method = "POST";
      return dispatch(apiCall(params, onSuccessGetAdminUserMessages, onFailureGetAdminUserMessages));
    };
    
    const onSuccessGetAdminUserMessages = (response, params) => (dispatch) => {
      dispatch(setAdminUserMessages(response.data.messages));
    };
    
    const onFailureGetAdminUserMessages = (error, params) => (dispatch) => {
      console.log("onFailureGetAdminUserMessages", error);
    };

/****************************************************************************************************************/

    export const getAdminGroupMessages = (params = {}) => (dispatch) => {
      params.path = "/api/bwccrm/fetchMessageGroup";
      params.method = "POST";
      return dispatch(apiCall(params, onSuccessGetAdminGroupMessages, onFailureGetAdminGroupMessages));
    };
    
    const onSuccessGetAdminGroupMessages = (response, params) => (dispatch) => {
      dispatch(setAdminGroupMessages(response.data.messages));
    };
    
    const onFailureGetAdminGroupMessages = (error, params) => (dispatch) => {
      console.log("onFailureGetAdminGroupMessages", error);
    };