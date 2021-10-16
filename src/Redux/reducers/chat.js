import {
  SET_ACTIVE_USER,
  SET_ACTIVE_GROUP,
  SET_CONTACT_USERS,
  SET_USER_GROUPS,
  SET_GROUP_MEM_INFO,
  SET_IS_TYPING,
  SET_NEW_GROUP_MESSAGE,
  SET_TOTAL_CONTACTS,
  SET_ALL_CONTACTS,
  SET_ALL_GROUPS,
} from "../constant/chat";

const initState = {
  active_user: null,
  active_group: null,
  contacts: [],
  groups: [],
  groupMemInfo: {},
  newMessage: [],
  allContacts: [],
  allGroups:[]
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
    case SET_NEW_GROUP_MESSAGE:
      return (state = {
        ...state,
        newMessage: action.newMessage,
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
    default:
      return state;
  }
};
