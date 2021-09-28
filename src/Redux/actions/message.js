import { SET_GROUP_MESSAGES, SET_USER_MESSAGES,ADD_TEMP_MESSAGES,DELETE_TYPED_MSG,SET_CONTACTS_TOTAL } from "../constant/message"
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
export const addTempMessages = (tempMessages) =>{
    return {
        type:ADD_TEMP_MESSAGES,
        tempMessages
    }
}

export const deleteTypedMsg = (msgId)=> {
    return {
      type: DELETE_TYPED_MSG,
      msgId,
    };
}

export const setContactsTotal = (contacts)=> {
    return {
      type: SET_CONTACTS_TOTAL,
      contacts,
    };
}

