import { SET_GROUP_MESSAGES, SET_USER_MESSAGES, ADD_TEMP_MESSAGES, DELETE_TYPED_MSG, SET_CONTACTS_TOTAL } from "../constant/message";

const initState = {
    userMessages: [],
    groupMessages: [],
    tempMessages: [],
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
        case ADD_TEMP_MESSAGES:
            return state = {
                ...state,
                tempMessages: action.tempMessages
            }
        case DELETE_TYPED_MSG:
            const i = state.tempMessages?.findIndex(m => m.id == action.messageId);
            if (i >= 0) {
                state.tempMessages.splice(state.tempMessages, 1)
            }
            return state = {
                ...state,
                tempMessages: Object.assign([], state.tempMessages),
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