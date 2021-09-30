import { SET_GROUP_MESSAGES, SET_USER_MESSAGES, SET_CONTACTS_TOTAL } from "../constant/message";

const initState = {
    userMessages: [],
    groupMessages: [],
    
};

export default (state = initState, action) => {
    switch (action.type) {
        case SET_USER_MESSAGES:
            return state = {
                ...state,
                userMessages: action.userMessages
            }
        case SET_GROUP_MESSAGES:
            return state = {
                ...state,
                groupMessages: action.groupMessages
            }

            case SET_CONTACTS_TOTAL:
                return state = {
                    ...state,
                    contacts: action.contacts
                }
        default:
            return state
    }
}