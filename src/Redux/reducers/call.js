import { SET_CALLING_USER } from "../constant/call";

const initState = {
  callingUser: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_CALLING_USER:
      return (state = {
        ...state,
        callingUser: action.callingUser,
      });

    default:
      return state;
  }
};
