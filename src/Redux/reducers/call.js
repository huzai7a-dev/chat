import { SET_CALLING_TO_USER, SET_ACTIVE_CALLER } from "../constant/call";

const initState = {
  callingTo: null,
  activeCaller: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_CALLING_TO_USER:
      return (state = {
        ...state,
        callingTo: action.callingTo || null,
      });
    case SET_ACTIVE_CALLER:
      return (state = {
        ...state,
        activeCaller: action.activeCaller || null,
      });

    default:
      return state;
  }
};
