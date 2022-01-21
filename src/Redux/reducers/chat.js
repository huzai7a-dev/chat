import {
  SET_ACTIVE_USER,
  SET_ACTIVE_GROUP,
  SET_CONTACT_USERS,
  SET_USER_GROUPS,
  SET_GROUP_MEM_INFO,
  SET_IS_TYPING,
  SET_TOTAL_CONTACTS,
  SET_ALL_CONTACTS,
  SET_ALL_GROUPS,
  SET_ON_CALL_COMING,
  SET_MAKE_CALL,
  SET_CALL_ACCEPTED,
  SET_HEADER_DATA,
} from "../constant/chat";

const initState = {
  active_user: null,
  active_group: null,
  contacts: [],
  groups: [],
  groupMemInfo: {},
  allContacts: [],
  allGroups: [],
  call: {},
  makeCall: false,
  isCallAccepted: false,
  active: {},
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      return (state = {
        ...state,
        active_user: action.active_user,
      });
    case SET_ACTIVE_GROUP:
      return (state = {
        ...state,
        active_group: action.active_group,
      });
    case SET_CONTACT_USERS:
      return (state = {
        ...state,
        contacts: action.contacts,
      });
    case SET_USER_GROUPS:
      return (state = {
        ...state,
        groups: action.groups,
      });

    case SET_GROUP_MEM_INFO:
      return (state = {
        ...state,
        groupMemInfo: action.groups,
      });
    case SET_IS_TYPING:
      return (state = {
        ...state,
        isTyping: action.typing,
      });
    case SET_TOTAL_CONTACTS:
      return (state = {
        ...state,
        contacts: action.contacts,
      });
    case SET_ALL_CONTACTS:
      return (state = {
        ...state,
        allContacts: action.contacts,
      });
    case SET_ALL_GROUPS:
      return (state = {
        ...state,
        allGroups: action.allGroups,
      });
    case SET_ON_CALL_COMING:
      return (state = {
        ...state,
        call: action.calling,
      });
    case SET_MAKE_CALL:
      return (state = {
        ...state,
        makeCall: action.call,
      });
    case SET_CALL_ACCEPTED:
      return (state = {
        ...state,
        isCallAccepted: action.call,
      });
    case SET_HEADER_DATA:
      return (state = {
        ...state,
        active: action.data,
      });
    default:
      return state;
  }
};
