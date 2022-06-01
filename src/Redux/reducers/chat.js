import {
  SET_ACTIVE_USER,
  SET_ACTIVE_GROUP,
  SET_CONTACT_USERS,
  SET_USER_GROUPS,
  SET_GROUP_MEM_INFO,
  SET_IS_TYPING,
  SET_TOTAL_CONTACTS,
  SET_ALL_GROUPS,
  SET_ON_CALL_COMING,
  SET_MAKE_CALL,
  SET_CALL_ACCEPTED,
  SET_HEADER_DATA,
  SET_ONLINE_USERS,
  SET_CONTACT_USER_META,
  SET_USER_GROUP_META,
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
  onlineUsers: [],
  contactMeta: {},
  groupMeta: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      return {
        ...state,
        active_user: action.active_user,
        active_group: initState.active_group,
      };
    case SET_ACTIVE_GROUP:
      return {
        ...state,
        active_user: initState.active_user,
        active_group: action.active_group,
      };
    case SET_CONTACT_USERS:
      return {
        ...state,
        contacts: action.contacts,
      };
    case SET_USER_GROUPS:
      return {
        ...state,
        groups: Object.assign([], action.groups),
      };
    case SET_GROUP_MEM_INFO:
      return {
        ...state,
        groupMemInfo: action.groups,
      };
    case SET_IS_TYPING:
      return {
        ...state,
        isTyping: action.typing,
      };
    case SET_TOTAL_CONTACTS:
      return {
        ...state,
        contacts: action.contacts,
      };
    case SET_ALL_GROUPS:
      return {
        ...state,
        allGroups: action.allGroups,
      };
    case SET_ON_CALL_COMING:
      return {
        ...state,
        call: action.calling,
      };
    case SET_MAKE_CALL:
      return {
        ...state,
        makeCall: action.call,
      };
    case SET_CALL_ACCEPTED:
      return {
        ...state,
        isCallAccepted: action.call,
      };
    case SET_HEADER_DATA:
      return {
        ...state,
        active: action.data,
      };
    case SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    case SET_CONTACT_USER_META:
      return {
        ...state,
        contactMeta: action.meta,
      }
    case SET_USER_GROUP_META:
      return {
        ...state,
        groupMeta: action.groupMeta,
      }
    default:
      return state;
  }
};
