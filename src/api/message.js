import { apiCall } from "../helper/api";
import { setContactsTotal, setGroupMessages, setUserMessages } from "../Redux/actions/message";



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