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
                user_id: parseInt(getState().auth.user?.user_id),
                role_id: parseInt(getState().auth.user?.role_id),
              },
              params.data
            ),
      params: params.params ? params.params : {},
      responseType: params.responseType || "json"
    };
    return axios(requestingObject)
      .then((response) => {
        // OnSuccess common validations
        if(onSuccess) dispatch(onSuccess(response, params));
        resolve(response);
      })
      .catch((err) => {
        // onFailure common validations
        if(onFailure) dispatch(onFailure(err, params));
        reject(err);
      });
  });

const getHeaders = (params = {}) => (dispatch) => {
  const a = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...params?.headers,
  };
  return a;
};
