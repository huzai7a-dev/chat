import axios from "axios";

export function LoginNow({ Email, Password }) {
  return function (dispatch) {
    return axios
      .post(
        "/api/bwccrm/login",
        {
          email: Email,
          password: Password,
        },
        { headers: {} }
      )
      .then((res) => {
        alert("Login successful");
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch({
          type: "Login",
          payload: res.data,
        });
        window.location = "/";
      }).catch(err=>{
        alert(err.response.data);
      });
  };
}
export function Userid(user_id) {
  return function (dispatch) {
    dispatch({
      type: "chatting",
      payload: user_id,
    });
  };
}
export function Auth(auth) {
  return function (dispatch) {
    dispatch({
      type: "Auth",
      payload: auth,
    });
  };
}
export function groupChat(group) {
  return function (dispatch) {
    dispatch({
      type: "groupChat",
      payload: group,
    });
  };
}
export function UserSearch(UserSearch) {
  return function (dispatch) {
    dispatch({
      type: "UserSearch",
      payload: UserSearch,
    });
  };
}

export function searchData(searchData) {
  return function (dispatch) {
    dispatch({
      type: "searchData",
      payload: searchData,
    });
  };
}

export function upDateUser(setContactData) {
  return function (dispatch) {
    dispatch({
      type: "upDateUser",
      payload: setContactData,
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
