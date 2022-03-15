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
  SET_ON_CALL_COMING,
  SET_MAKE_CALL,
  SET_CALL_ACCEPTED,
  SET_DATA_TO_CALL,
  SET_HEADER_DATA,
  SET_ONLINE_USERS,
} from "../constant/chat";

export const setActiveChat = (active_user) => {
  return {
    type: SET_ACTIVE_USER,
    active_user,
  };
};

export const setOnlineUsers = (onlineUsers) => {
  return {
    type: SET_ONLINE_USERS,
    onlineUsers
  }
}

export const setActiveGroup = (active_group) => {
  return {
    type: SET_ACTIVE_GROUP,
    active_group,
  };
};

export const setContactUsers = (contacts) => {
  return {
    type: SET_CONTACT_USERS,
    contacts,
  };
};

export const setUserGroups = (groups) => {
  return {
    type: SET_USER_GROUPS,
    groups,
  };
};

export const setGroupMemInfo = (info) => {
  return {
    type: SET_GROUP_MEM_INFO,
    info,
  };
};

export const setIsTyping = (typing) => {
  return {
    type: SET_IS_TYPING,
    typing,
  };
};

export const setNewGroupMessage = (newMessage) => {
  return {
    type: SET_NEW_GROUP_MESSAGE,
    newMessage,
  };
};
export const setTotalContacts = (contacts) => {
  return {
    type: SET_TOTAL_CONTACTS,
    contacts,
  };
};
export const setAllContacts = (contacts) => {
  return {
    type: SET_ALL_CONTACTS,
    contacts,
  };
};
export const setAllgroups = (allGroups) => {
  return {
    type: SET_ALL_GROUPS,
    allGroups,
  };
};
export const setMakeCall = (call) => {
  return {
    type: SET_MAKE_CALL,
    call,
  };
};

export const setCallAccepted = (call) => {
  return {
    type: SET_CALL_ACCEPTED,
    call,
  };
};

export const setOnCallComing = (calling) => {
  return {
    type: SET_ON_CALL_COMING,
    calling,
  };
};

export const setDataToCall = (data) => {
  return {
    type: SET_DATA_TO_CALL,
    data,
  };
};
export const setHeaderData = (data) => {
  return {
    type: SET_HEADER_DATA,
    data,
  };
};
