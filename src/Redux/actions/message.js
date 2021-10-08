import { SET_GROUP_MESSAGES, SET_USER_MESSAGES,SET_CONTACTS_TOTAL, SET_USER_ATTACHMENTS } from "../constant/message"
export const setUserMessages = (userMessages) => {
    return {
        type:SET_USER_MESSAGES,
        userMessages
    }
}
export const setGroupMessages = (groupMessages) => {
    return {
        type:SET_GROUP_MESSAGES,
        groupMessages
    }
}

export const setContactsTotal = (contacts)=> {
    return {
      type: SET_CONTACTS_TOTAL,
      contacts,
    };
}
export const setUserAttachments = (attachments)=> {
    return {
      type: SET_USER_ATTACHMENTS,
      attachments,
    };
}

