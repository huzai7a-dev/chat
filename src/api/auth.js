import { apiCall } from "../helper/api";
import { Notify } from "../helper/notify";
import { setAuthUser } from "../Redux/actions/auth";
export const login = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/login";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessLogin, onFailureLogin));
};

const onSuccessLogin = (response, params) => (dispatch) => {
  Notify(response.data.message,'success');
  localStorage.setItem("user", JSON.stringify(response.data.data));
  dispatch(setAuthUser(response.data.data));
};

const onFailureLogin = (error, params) => (dispatch) => {
  Notify(error.response.data,'error');
};

/****************************************************************************************************************/
export const signUp = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/signup";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessSignUp, onFailureSignUp));
};

const onSuccessSignUp = (response, params) => (dispatch) => {
  Notify(response.data.message,'success');
  localStorage.setItem("user", JSON.stringify(response.data.data));
};

const onFailureSignUp = (error, params) => (dispatch) => {
  Notify(error.response.data,'error');
};

/****************************************************************************************************************/

export const logout = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/logout";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessLogout, onFailureLogout));
};

const onSuccessLogout = (response, params) => (dispatch) => {
  console.log("OnSuccessLogout", response.data);
  Notify(response.data,'success');
  dispatch(setAuthUser(null));
  localStorage.removeItem("user");
};

const onFailureLogout = (error, params) => (dispatch) => {
  console.log("onFailureLogout", error);
};

/****************************************************************************************************************/
