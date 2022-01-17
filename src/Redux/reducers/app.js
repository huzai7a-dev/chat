import {
  SET_USER_SEARCH_RESULT,
  SET_SEARCH_TEXT,
  SET_EDIT_GROUP_MODEL_STATE,
  SET_EDIT_GROUP_NAME_TO_MEMBER_STATE,
  SET_PARTICIPANT_MODEL_STATE,
  SET_QUOTE,
  SET_SEEN,
  SET_NIGHT_MODE,
  SET_ADMIN_PANEL,
  SET_SIDE_BAR,
  SET_RECEIVING_DATA,
  SET_CALLING_DATA,
  SET_REMOTE_STREAM,
  SET_LOCAL_STREAM
} from "../constant/app";
const initState = {
  userSearch: null,
  searchText: "",
  editGroupModelState: false,
  typedMsg: [],
  seen: false,
  mode: false,
  adminPanel: false,
  sideBarCollapsed: false,
  callerInfo: {},
  callingInfo: {},
  remoteStream: null,
  localStream: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_USER_SEARCH_RESULT:
      return (state = {
        ...state,
        userSearch: action.userSearch,
      });
    case SET_RECEIVING_DATA:
      return (state = {
        ...state,
        callerInfo: action.callerInfo,
      });
    case SET_CALLING_DATA:
      return (state = {
        ...state,
        callingInfo: action.callingInfo,
      });
    case SET_REMOTE_STREAM:
      return (state = {
        ...state,
        remoteStream: action.remoteStream,
      });
    case SET_LOCAL_STREAM:
      return (state = {
        ...state,
        localStream: action.localStream,
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
    case SET_ADMIN_PANEL:
      return (state = {
        ...state,
        adminPanel: action.setAdmin,
      });
    case SET_SIDE_BAR:
      return (state = {
        ...state,
        sideBarCollapsed: action.state,
      });
    default:
      return state;
  }
};
