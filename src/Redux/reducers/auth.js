import { SET_AUTH_USER } from "../constant/auth";

const initState = {
  auth_user: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_AUTH_USER:
      return state = {
        ...state,
        auth_user: action.auth_user
      }
    default:
      return state;
  }
};
