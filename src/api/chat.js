import { apiCall } from "../helper/api";
import { setContactUsers, setUserGroups} from "../Redux/actions/chat";

export const getContactsUser = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/getContactsUser";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetContactsUser, onFailureGetContactsUser));
};

const onSuccessGetContactsUser = (response, params) => (dispatch) => {
  dispatch(setContactUsers(response.data.contacts));
};

const onFailureGetContactsUser = (error, params) => (dispatch) => {
  console.log("onFailureGetContactsUser", error);
};

/****************************************************************************************************************/

export const getUserGroups = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/getUserGroups";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetUserGroups, onFailureGetUserGroups));
};

const onSuccessGetUserGroups = (response, params) => (dispatch) => {
  console.log("OnSuccessGetUserGroups", response);
  dispatch(setUserGroups(response.data));
};

const onFailureGetUserGroups = (error, params) => (dispatch) => {
  console.log("onFailureGetUserGroups", error);
};


/****************************************************************************************************************/
export const seenMessage = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/makeSeen";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessSeenMessage, onFailureSeenMessage));
};

const onSuccessSeenMessage = (response, params) => (dispatch) => {
  console.log("OnSuccessSeenMessage", response);
  // dispatch(setUserGroups(response.data));
};

const onFailureSeenMessage = (error, params) => (dispatch) => {
  console.log("onFailureSeenMessage", error);
};


/****************************************************************************************************************/

export const seenGroupMessage = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/makegroupmessageseen";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessSeenGroupMessage, onFailureSeenGroupMessage));
};

const onSuccessSeenGroupMessage = (response, params) => (dispatch) => {
  console.log("OnSuccessSeenGroupMessage", response);
  
};

const onFailureSeenGroupMessage = (error, params) => (dispatch) => {
  console.log("onFailureSeenGroupMessage", error);
};