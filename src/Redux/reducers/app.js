import {
  SET_USER_SEARCH_RESULT,
  SET_SEARCH_TEXT,
  SET_EDIT_GROUP_MODEL_STATE,
  SET_EDIT_GROUP_NAME_TO_MEMBER_STATE,
  SET_PARTICIPANT_MODEL_STATE,
  SET_QUOTE,
  SET_SEEN,
  SET_NIGHT_MODE
} from "../constant/app";
const initState = {
  userSearch: null,
  searchText: "",
  editGroupModelState: false,
  typedMsg: [],
  seen:false,
  mode:false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_USER_SEARCH_RESULT:
      return (state = {
        ...state,
        userSearch: action.userSearch,
      });
    case SET_SEARCH_TEXT:
      return (state = {
        ...state,
        searchText: action.searchText,
      });
    case SET_EDIT_GROUP_MODEL_STATE:
      return (state = {
        ...state,
        editGroupModelState: action.modelState,
      });
    case SET_EDIT_GROUP_NAME_TO_MEMBER_STATE:
      return (state = {
        ...state,
        editGroupNameToMemberModelState: action.modelState,
      });
    case SET_PARTICIPANT_MODEL_STATE:
      return (state = {
        ...state,
        participantModelState: action.modelState,
      });
    case SET_QUOTE:
      return (state = {
        ...state,
        quoteData: action.quoteData,
      });
      case SET_SEEN:
        return (state = {
          ...state,
          quoteData: action.quoteData,
        });

        case SET_NIGHT_MODE:
        return (state = {
          ...state,
          mode: action.mode,
        });
    default:
      return state;
  }
};
