import { apiCall } from "../helper/api";
import { Notify } from "../helper/notify";
import { setAdminGroupMessages, setAdminUserMessages, setContactsTotal, setGroupAttachments, setGroupMessages, setUserAttachments, setUserMessages } from "../Redux/actions/message";



export const sendMessage = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/sendMessage";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessSendMessage, onFailureSendMessage));
};

const onSuccessSendMessage = (response, params) => (dispatch) => {
  console.log("onSuccessSendMessage", response);
};

const onFailureSendMessage = (error, params) => (dispatch) => {
  console.log("onFailureSendMessage", error);
  Notify(error.response.message,'error');
};

/****************************************************************************************************************/
export const getUserMessages = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/fetchMessage";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetUserMessages, onFailureGetUserMessages));
  };
  
  const onSuccessGetUserMessages = (response, params) => (dispatch) => {
    console.log('getting user messages');
    dispatch(setUserMessages(response.data.messages));
  };
  
  const onFailureGetUserMessages = (error, params) => (dispatch) => {
    console.log("onFailureGetUserMessages", error);
  };
  /****************************************************************************************************************/

  export const sendGroupMessage = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/sendMessage";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessSendGroupMessage, onFailureSendGroupMessage));
  };
  
  const onSuccessSendGroupMessage = (response, params) => (dispatch) => {
    console.log("onSuccessSendGroupMessage", response);
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
    console.log('onSuccessGetGroupMessages')
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
    console.log(response);
  };
  
  const onFailureGetContactsTotal = (error, params) => (dispatch) => {
    console.log("onFailureGetContactsTotal", error);
  };


  /****************************************************************************************************************/
export const getMoreUserMessages = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchMoreMessage";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetMoreUserMessages, onFailureGetMoreUserMessages));
};

const onSuccessGetMoreUserMessages = (response, params) => (dispatch) => {
  console.log("onSuccessGetMoreUserMessages");
};

const onFailureGetMoreUserMessages = (error, params) => (dispatch) => {
  console.log("onFailureGetMoreUserMessages", error);
};

  /****************************************************************************************************************/
  export const getMoreGroupMessages = (params = {}) => (dispatch) => {
    params.path = "/api/bwccrm/fetchMoreMessageGroup";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessGetMoreGroupMessages, onFailureGetMoreGroupMessages));
  };
  
  const onSuccessGetMoreGroupMessages = (response, params) => (dispatch) => {
    console.log("onSuccessGetMoreGroupMessages",response);
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
    console.log("onSuccessGetUserAttachments",response);
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
      console.log('onSuccessGetAdminGroupMessages')
    };
    
    const onFailureGetAdminGroupMessages = (error, params) => (dispatch) => {
      console.log("onFailureGetAdminGroupMessages", error);
    };