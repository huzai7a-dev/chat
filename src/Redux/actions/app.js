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
} from "../constant/app";

export const setUserSearchResult = (userSearch) => {
  return {
    type: SET_USER_SEARCH_RESULT,
    userSearch,
  };
};

export const setSearchText = (searchText) => {
  return {
    type: SET_SEARCH_TEXT,
    searchText,
  };
};

export const setEditGroupModelState = (modelState) => {
  return {
    type: SET_EDIT_GROUP_MODEL_STATE,
    modelState,
  };
};

export const setParticipantModelState = (modelState) => {
  return {
    type: SET_PARTICIPANT_MODEL_STATE,
    modelState,
  };
};

export const setEditGroupNameToMemberModelState = (modelState) => {
  return {
    type: SET_EDIT_GROUP_NAME_TO_MEMBER_STATE,
    modelState,
  };
};

export const setQuote = (quoteData) => {
  return {
    type: SET_QUOTE,
    quoteData,
  };
};

export const setSeen = (seen) => {
  return {
    type: SET_SEEN,
    seen,
  };
};

export const setNightMode = (mode) => {
  return {
    type: SET_NIGHT_MODE,
    mode,
  };
};
export const setAdminPanel = (setAdmin) => {
  return {
    type: SET_ADMIN_PANEL,
    setAdmin,
  };
};
export const setSideBar = (state) => {
  return {
    type: SET_SIDE_BAR,
    state,
  };
};
