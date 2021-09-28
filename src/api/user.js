import { apiCall } from "../helper/api";

export const searchUser = (params = {}) => (dispatch) => {
    params.path = "/logout";
    params.method = "POST";
    return dispatch(apiCall(params, onSuccessSearchUser, onFailureSearchUser));
  };
  
  const onSuccessSearchUser = (response, params) => (dispatch) => {
    console.log("OnSuccessSearchUser", response);
  };
  
  const onFailureSearchUser = (error, params) => (dispatch) => {
    console.log("onFailureSearchUser", error);
  };
  
  /****************************************************************************************************************/
  