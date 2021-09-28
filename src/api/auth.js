import { apiCall } from "../helper/api";
import { setAuthUser } from "../Redux/actions/auth";

export const login = (params = {}) => (dispatch) => {
  params.path = "/api/bwccrm/login";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessLogin, onFailureLogin));
};

const onSuccessLogin = (response, params) => (dispatch) => {
  console.log("OnSuccessLogin", response);
  localStorage.setItem("user", JSON.stringify(response.data.data));
  dispatch(setAuthUser(response.data.data));
  window.location = "/";
};

const onFailureLogin = (error, params) => (dispatch) => {
  console.log("onFailureLogin", error);
  alert("Invalid Email or Password");
};

/****************************************************************************************************************/

export const logout = (params = {}) => (dispatch) => {
  params.path = "/logout";
  params.method = "POST";
  return dispatch(apiCall(params, onSuccessLogout, onFailureLogout));
};

const onSuccessLogout = (response, params) => (dispatch) => {
  console.log("OnSuccessLogout", response);
  dispatch(setLoggedInUser(null));
//   window.location.href = "/"
//   message.success(response.data.message, 3);
};

const onFailureLogout = (error, params) => (dispatch) => {
  console.log("onFailureLogout", error);
//   if (error.response && typeof error.response.data === typeof "") {
//     message.error(error.response.data, 3);
//   } else {
//     message.error("Server not responding", 3);
//   }
};

/****************************************************************************************************************/
