import { apiCall } from "../helper/api";
import { setAllgroups, setContactUsers, setTotalContacts, setUserGroups, setContactUsersMeta, setUserGroupsMeta } from "../Redux/actions/chat";

export const getContactsUser = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/getContactsUser";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetContactsUser));
};

const onSuccessGetContactsUser = (response) => (dispatch, getState) => {
  const { data, ...meta } = response.data.contacts || { data: response.data.contacts };
  if (meta.current_page == 1) {
    dispatch(setContactUsers(Object.values(data)));
  } else {
    let temp = [...(getState().chat.contacts || [])];
    temp = temp.concat(Object.values(data));
    temp.filter((value, index, self) => self.findIndex(v => v.elsemployees_empid == value.elsemployees_empid) === index)
    dispatch(setContactUsers(temp))
  }
  dispatch(setContactUsersMeta(meta))
};

/****************************************************************************************************************/

export const getUserGroups = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/testgetUserGroups";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessGetUserGroups));
};

const onSuccessGetUserGroups = (response) => (dispatch, getState) => {
  const { data, ...meta } = response.data;

  if (meta.current_page == 1) {
    dispatch(setUserGroups(Object.values(data)));
  } else {
    let temp = [...(getState().chat.groups || [])];
    temp = temp.concat(Object.values(data));
    temp.filter((value, index, self) => self.findIndex(v => v.group_id == value.group_id) === index)
    dispatch(setUserGroups(temp))
  }
  
  dispatch(setUserGroupsMeta(meta));
};

/****************************************************************************************************************/
export const seenMessage = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/makeSeen";
  params.method = "POST";
  return dispatch(apiCall(params));
};

/****************************************************************************************************************/

export const seenGroupMessage = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/makegroupmessageseen";
  params.method = "POST";
  return dispatch(apiCall(params));
};
/****************************************************************************************************************/

export const getContactsTotal = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/getContactsTotal";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessgetContactsTotal));
};

const onSuccessgetContactsTotal = (response) => (dispatch) => {
  dispatch(setTotalContacts(response.data.contacts));
  console.log("OnSuccessgetContactsTotal", response);

};

/****************************************************************************************************************/

export const getAllGroups = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/getAllGroups";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessgetAllGroups));
};

const onSuccessgetAllGroups = (response) => (dispatch) => {
  dispatch(setAllgroups(response.data));
  console.log("OnSuccessgetAllGroups", response);

};
/****************************************************************************************************************/

export const getGroupParticipants = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/groupparticipants";
  params.method = "POST";
  return dispatch(apiCall(params));
};

/****************************************************************************************************************/

export const createGroup = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/createGroup";
  params.method = "POST";
  return dispatch(apiCall(params));
};

/****************************************************************************************************************/

export const getActiveUsers = (params = {}) => dispatch => {
  params.path = "/socket/active-users";
  params.method = "GET";
  return dispatch(apiCall(params));
}