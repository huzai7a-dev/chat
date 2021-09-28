import { SET_ACTIVE_USER, SET_ACTIVE_GROUP, SET_CONTACT_USERS, SET_USER_GROUPS,SET_GROUP_MEM_INFO, SET_IS_TYPING, SET_NEW_GROUP_MESSAGE } from "../constant/chat"

export const setActiveChat = (active_user) => {
    return {
        type: SET_ACTIVE_USER,
        active_user,
    }
}

export const setActiveGroup = (active_group) => {
    return {
        type: SET_ACTIVE_GROUP,
        active_group,
    }
}

export const setContactUsers = (contacts) => {
    return {
        type: SET_CONTACT_USERS,
        contacts,
    }
}

export const setUserGroups = (groups) => {
    return {
        type: SET_USER_GROUPS,
        groups,
    }
}

export const setGroupMemInfo = (info) => {
    return {
        type: SET_GROUP_MEM_INFO,
        info,
    }
}

export const setIsTyping = (typing) => {
    return {
        type: SET_IS_TYPING,
        typing,
    }
}

export const setNewGroupMessage = (newMessage) => {
    return {
        type: SET_NEW_GROUP_MESSAGE,
        newMessage,
    }
}