import { removeSocket } from "../config/socket";
import { apiCall } from "../helper/api";
import { Notify } from "../helper/notify";
import { setAuthUser } from "../Redux/actions/auth";
import { deleteUserSubscription } from "./app";

export const login = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/login";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessLogin, onFailureLogin));
};

const onSuccessLogin = (response) => (dispatch) => {
  Notify(response.data.message,'success');
  localStorage.setItem("user", JSON.stringify(response.data.data));
  dispatch(setAuthUser(response.data.data));
};

const onFailureLogin = (error) => () => {
  Notify(error.response.data,'error');
};

/****************************************************************************************************************/
export const signUp = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/signup";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessSignUp, onFailureSignUp));
};

const onSuccessSignUp = (response) => () => {
  Notify(response.data.message,'success');
};

const onFailureSignUp = (error) => () => {
  Notify(error.response.data,'error');
};

/****************************************************************************************************************/

export const logout = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/logout";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessLogout, onFailureLogout));
};

const onSuccessLogout = (response) => (dispatch) => {
  console.log("OnSuccessLogout", response.data);
  Notify(response.data,'success');
  removeSocket();
  dispatch(deleteUserSubscription());
  dispatch(setAuthUser(null));
  localStorage.removeItem("user");
};

const onFailureLogout = (error) => () => {
  console.log("onFailureLogout", error);
};

/****************************************************************************************************************/
