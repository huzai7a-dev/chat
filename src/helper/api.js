import axios from "axios";

export const apiCall = (params, onSuccess, onFailure) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const requestingObject = {
      url: `${params.path}`,
      headers: dispatch(getHeaders(params)),
      method: params.method ? params.method : "GET",
      data:
        params.data instanceof FormData
          ? params.data
          : Object.assign(
              {},
              {
                user_id: parseInt(getState().auth.auth_user?.elsemployees_empid),
                role_id: parseInt(getState().auth.auth_user?.elsemployees_roleid),
              },
              params.data
            ),
      params: params.params ? params.params : {},
      onUploadProgress: params.onUploadProgress,
      responseType: params.responseType || "json",
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };
    return axios(requestingObject)
      .then((response) => {
        // OnSuccess common validations
        if(onSuccess) dispatch(onSuccess(response, params));
        else console.log("onSuccess", response)
        resolve(response);
      })
      .catch((err) => {
        // onFailure common validations
        if(onFailure) dispatch(onFailure(err, params));
        else console.log("onFailure", err)
        reject(err);
      });
  });

const getHeaders = (params = {}) => () => {
  const a = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...params?.headers,
  };
  return a;
};
