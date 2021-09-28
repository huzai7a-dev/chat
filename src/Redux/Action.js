export function Userid(user_id) {
  return function (dispatch) {
    dispatch({
      type: "chatting",
      payload: user_id,
    });
  };
}

export function upDateMessage(setchattingdata) {
  return function (dispatch) {
    dispatch({
      type: "upDateMessage",
      payload: setchattingdata,
    });
  };
}

export function updateGroup(updateGroup) {
  return function (dispatch) {
    dispatch({
      type: "updateGroup",
      payload: updateGroup,
    });
  };
}

export function sendMsg(sendMsg) {
  return function (dispatch) {
    dispatch({
      type: "sendMsg",
      payload: sendMsg,
    });
  };
}

export function userMsgs(userMsgs) {
  return function (dispatch) {
    dispatch({
      type: "userMsgs",
      payload: userMsgs,
    });
  };
}

export function groupMsgs(groupMsgs) {
  return function (dispatch) {
    dispatch({
      type: "groupMsgs",
      payload: groupMsgs,
    });
  };
}
export function typedMsg(message) {
  return function (dispatch) {
    dispatch({
      type: "typedMsg",
      payload: message,
    });
  };
}

export const addTypedMsg = (message) => {
  return  {
    type: "ADD_TYPED_MESSAGE",
    message
  };
}

export const removeFromTypedMessage = (messageId) => {
  return {
    type: "DELETE_TYPED_MESSAGE",
    messageId
  }
}

export function pending(PendingMessage) {
  return function (dispatch) {
    dispatch({
      type: "pending",
      payload: PendingMessage,
    });
  };
}

export function quote(quoteMessage) {
  return function (dispatch) {
    dispatch({
      type: "quote",
      payload: quoteMessage,
    });
  };
}

export function modelState(modelState) {
  return function (dispatch) {
    dispatch({
      type: "modelState",
      payload: modelState,
    });
  };
}

export function participantModel(participantModel) {
  return function (dispatch) {
    dispatch({
      type: "participantModel",
      payload: participantModel,
    });
  };
}

export function nameToMember(nameToMember) {
  return function (dispatch) {
    dispatch({
      type: "nameToMember",
      payload: nameToMember,
    });
  };
}

export function seen(seen) {
  return function (dispatch) {
    dispatch({
      type: "seen",
      payload: seen,
    });
  };
}

export function groupMemberInfo(groupMemberInfo) {
  return function (dispatch) {
    dispatch({
      type: "groupMemberInfo",
      payload: groupMemberInfo,
    });
  };
}
