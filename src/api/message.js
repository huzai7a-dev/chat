import { apiCall } from "../helper/api";
import { setAdminGroupMessages, setAdminUserMessages, setContactsTotal, setGroupMessages, setGroupSeen, setUserMessages } from "../Redux/actions/message";

export const sendMessage = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/sendMessage";
  params.method = "POST";
  return dispatch(apiCall(params));
};

/****************************************************************************************************************/

export const getUserMessages = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchMessage";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetUserMessages));
};

const onSuccessGetUserMessages = (response) => (dispatch) => {
  dispatch(setUserMessages(response.data.messages));
};

/****************************************************************************************************************/

export const sendGroupMessage = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/sendMessage";
  params.method = "POST";
  return dispatch(apiCall(params));
};


/****************************************************************************************************************/

export const getGroupMessages = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchMessageGroup";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetGroupMessages));
};

const onSuccessGetGroupMessages = (response) => (dispatch) => {
  dispatch(setGroupMessages(response.data));
};

export const getContactsTotal = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/getContactsTotal";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetContactsTotal));
};

const onSuccessGetContactsTotal = (response) => (dispatch) => {
  dispatch(setContactsTotal(response.data));
};

/****************************************************************************************************************/
export const getMoreUserMessages = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchMoreMessage";
  params.method = "POST";
  return dispatch(apiCall(params));
};

/****************************************************************************************************************/
export const getMoreGroupMessages = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchMoreMessageGroup";
  params.method = "POST";
  return dispatch(apiCall(params));
};

/****************************************************************************************************************/
export const getUserAttachments = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchAttachments";
  params.method = "POST";
  return dispatch(apiCall(params));
};


/****************************************************************************************************************/
export const getGroupAttachments = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchGroupAttachments";
  params.method = "POST";
  return dispatch(apiCall(params));
}

/****************************************************************************************************************/

export const getAdminUserMessages = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchMessage";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetAdminUserMessages));
};

const onSuccessGetAdminUserMessages = (response) => (dispatch) => {
  dispatch(setAdminUserMessages(response.data.messages));
};

/****************************************************************************************************************/

export const getAdminGroupMessages = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchMessageGroup";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetAdminGroupMessages));
};

const onSuccessGetAdminGroupMessages = (response) => (dispatch) => {
  dispatch(setAdminGroupMessages(response.data.messages));
};

/****************************************************************************************************************/

export const fetchAllSeenUsers = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/fetchAllSeenUsers";
  params.method = "POST";
  return dispatch(apiCall(params));
};
