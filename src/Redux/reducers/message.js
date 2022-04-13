import { SET_ACTIVE_GROUP, SET_ACTIVE_USER } from "../constant/chat";
import {
  SET_GROUP_MESSAGES,
  SET_USER_MESSAGES,
  SET_CONTACTS_TOTAL,
  SET_USER_ATTACHMENTS,
  SET_GALLERY,
  SET_GROUP_ATTACHMENTS,
  SET_ADMIN_USER_MESSAGES,
  SET_ADMIN_GROUP_MESSAGES,
  SET_GROUP_SEEN,
} from "../constant/message";

const initState = {
  userMessages: null,
  adminUserMessages: [],
  adminGroupMessages: [],
  groupMessages: [],
  attachments: [],
  groupAttachments: [],
  gallery: true,
  contacts: [],
  seen: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_USER_MESSAGES:
      return (state = {
        ...state,
        userMessages: action.userMessages,
      });
    case SET_GROUP_MESSAGES:
      return (state = {
        ...state,
        groupMessages: action.groupMessages,
      });
    case SET_GROUP_SEEN:
      return (state = {
        ...state,
        seen: action.seen
      })
    case SET_ACTIVE_USER:
      return (state = {
        ...state,
        userMessages: initState.userMessages,
      })
    case SET_ACTIVE_GROUP:
      return (state = {
        ...state,
        groupMessages: initState.groupMessages,
      })
    case SET_CONTACTS_TOTAL:
      return (state = {
        ...state,
        contacts: action.contacts,
      });
    case SET_USER_ATTACHMENTS:
      return (state = {
        ...state,
        attachments: action.attachments,
      });
    case SET_GROUP_ATTACHMENTS:
      return (state = {
        ...state,
        groupAttachments: action.attachments,
      });
    case SET_GALLERY:
      return (state = {
        ...state,
        gallery: action.gallery,
      });
    case SET_ADMIN_USER_MESSAGES:
      return (state = {
        ...state,
        adminUserMessages: action.messages,
      });
    case SET_ADMIN_GROUP_MESSAGES:
      return (state = {
        ...state,
        adminGroupMessages: action.messages,
      });
    default:
      return state;
  }
};
