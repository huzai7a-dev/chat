import { Avatar, Typography } from "@material-ui/core";
import React, { useState, useRef, useCallback } from "react";
import "./userMessage.css";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Modal from "react-modal";
import { useOutsideAlerter } from "../../../../hooks/useOutsideClick";
import { setQuote } from "../../../../Redux/actions/app";
import moment from "moment";
import ForwardMessage from "../ForwardMessage";
import {
  DARKLIGHT,
  SECONDARYLIGHT,
  WHITE,
} from "../../../../Theme/colorConstant";
import ViewAttachment from "../../../../Components/Utils/ViewAttachment";
import RenderAttachment from "../../../../Components/Utils/RenderAttachment";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CheckIcon from "@mui/icons-material/Check";
import { deleteMessage } from "../../../../api/admin";
import { ADMIN } from "../../../../Role";
import { getUserMessages } from "../../../../api/message";
import { getContactsUser } from "../../../../api/chat";
import { copyTextToClipboard } from "../../../../helper/util";

function UserMessage(props) {
  const { auth_user, active_user, isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_user: store.chat.active_user || {},
      isNightMode: store.app.mode || false,
    };
  });
  const [forwardModel, setForwardModel] = useState(false);
  const loggedInUser = auth_user?.elsemployees_empid;
  const image = props.sender.from_userpicture;
  const attachments = props.sender.message_attachment;
  const [openModel, setOpenModel] = useState(false);
  const [media, setMedia] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [option, setOption] = useState(false);
  const menuDiv = useRef();
  const onClickOutside = useCallback(() => {
    setOption(false);
  }, []);

  useOutsideAlerter(menuDiv, onClickOutside);
  const forwardMessageParams = {
    data: {
      user_id: auth_user?.elsemployees_empid,
      loginuser_id: auth_user?.elsemployees_empid,
      message_body: props.sender.message_body || null,
      message_to: active_user?.elsemployees_empid,
      message_quoteid: props.sender?.message_quoteid || null,
      message_quotebody: props.sender?.message_quotebody || null,
      message_quoteuser: props.sender?.message_quoteuser || null,
      message_attachment: props.sender.message_attachment,
      message_forwarded: 1,
      message_originalname: props.sender.message_originalname || null,
    },
  };

  // function to open image/video
  const openImage = useCallback((e, name) => {
    setMedia(e.target.src);
    setMediaName(name);
    setOpenModel(true);
  }, []);
  // function to collect data for quote messages

  const attachmentStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:
      props.sender.message_from === loggedInUser ? "flex-end" : "flex-start",
    alignItems: "center",
  };

  const messageToBackground = isNightMode ? DARKLIGHT : "#f0f4f8";

  return (
    <div
      id={props.sender.message_id}
      className="senderMessage"
      style={{
        flexDirection:
          props.sender?.message_from == loggedInUser && "row-reverse",
      }}
    >
      <div className="userMessage__picture">
        {props.sender?.message_from !== loggedInUser ? (
          <Avatar
            src={`/bizzportal/public/img/${image}`}
            style={{
              width: "40px",
              height: "40px",
              visibility:
                props.tail.message_id == props.sender.message_id
                  ? "visible"
                  : "hidden",
            }}
          />
        ) : null}
      </div>

      <div className="userMessageBox">
        <div
          className={
            props.sender?.message_from !== loggedInUser
              ? "senderMessage__details"
              : "userMessage__details"
          }
        >
          {props.tail?.message_id == props.sender.message_id && (
            <div className="userMessage__name" style={{ marginRight: "5px" }}>
              <p>
                {props.sender.message_from !== loggedInUser
                  ? props.sender.from_username + ","
                  : ""}
              </p>
            </div>
          )}
          {props.tail?.message_id == props.sender.message_id && (
            <div
              className="userMessage__time"
              style={{ display: "flex", alignItems: "center" }}
            >
              <p>{moment(props.head?.fullTime).format("LT")}</p>
            </div>
          )}
        </div>
        {parseInt(props.sender.message_forwarded) == 1 ? (
          <Typography
            variant="caption"
            color={isNightMode ? "primary" : "textSecondary"}
          >
            Forwarded
          </Typography>
        ) : null}

        {props.sender?.message_attachment !== null ? (
          <div
            className="sentAttachment"
            style={{
              ...attachmentStyle,
              flexDirection:
                props.sender?.message_from !== loggedInUser
                  ? "row"
                  : "row-reverse",
            }}
          >
            <RenderAttachment
              attachments={attachments}
              fileName={props.sender.message_originalname}
              onOpenImage={openImage}
            />
            {!props.sender.message_body ? (
              <div
                className="msgOption"
                ref={menuDiv}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "4%",
                  display: option ? "flex" : "initial",
                }}
                onClick={() => setOption(!option)}
              >
                <MoreVertIcon />
                {option ? (
                  <MessageOptions
                    setForwardModel={setForwardModel}
                    sender={props.sender}
                    setOption={setOption}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* {props.sender.message_body && props.sender.message_body !== "null" ? ( */}
        <div
          className="recieverQoutMsg__container"
          style={{
            flexDirection:
              props.sender?.message_from !== loggedInUser
                ? "row"
                : "row-reverse",
          }}
        >
          <div >
            {props.sender.message_quotebody ? (
              <QuotedMessage sender={props.sender} />
            ) : null}
            {props.sender.message_body && props.sender.message_body !== "null" && (
              <>
                <div
                  style={{
                    background:
                      props.sender?.message_from !== loggedInUser
                        ? SECONDARYLIGHT
                        : messageToBackground,
                    color:
                      isNightMode && props.sender?.message_from == loggedInUser
                        ? WHITE
                        : "rgb(37, 36, 35)",
                  }}
                  className={
                    props.sender?.message_from !== loggedInUser
                      ? "senderMessage__text"
                      : "recieverMessage__text"
                  }
                >
                  {props.sender.message_body}
                </div>

              </>
            )}
                
          </div>
          {/* {props.sender.message_body && props.sender.message_body !== "null" &&  */}
                  <div
                    className="msgOption"
                    ref={menuDiv}
                    style={option ? { display: "flex" } : null}
                    onClick={() => {
                      setOption(!option);
                    }}
                  >
                    <MoreVertIcon />
                    {option ? (
                      <MessageOptions
                        setForwardModel={setForwardModel}
                        sender={props.sender}
                        setOption={setOption}
                      />
                    ) : null}
                  </div>
                {/* } */}
        </div>
        {/* ) : null} */}
        <div style={{ textAlign: "right" }}>
          <ReadStatus sender={props.sender} active_user={active_user} />
        </div>
        <ViewAttachment
          src={media}
          openModel={openModel}
          name={mediaName}
          handClose={(state) => setOpenModel(state)}
        />
        <Modal
          isOpen={forwardModel}
          onRequestClose={() => {
            setForwardModel(false);
          }}
          className="forwardModel"
        >
          <ForwardMessage
            setForwardModel={setForwardModel}
            params={forwardMessageParams}
          />
        </Modal>
      </div>
    </div>
  );
}

const MessageOptions = React.memo((props) => {
  const { auth_user, active_user } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user,
      active_user: store.chat.active_user || {},
    };
  });

  const loggedInUser = auth_user?.elsemployees_empid;
  const role = auth_user?.elsemployees_roleid;
  const dispatch = useDispatch();

  const fetchMessages = useCallback(async () => {
    const params = {
      data: {
        from_id: auth_user?.elsemployees_empid,
        to_id: active_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getUserMessages(params));
  }, [dispatch, auth_user, active_user]);

  const onDeleteMessage = useCallback(async () => {
    try {
      const params = {
        data: {
          message_id: props.sender.message_id,
        },
      };
      await dispatch(deleteMessage(params));
      fetchMessages();
      dispatch(
        getContactsUser({
          data: { loginuser_id: auth_user?.elsemployees_empid },
        })
      );
    } catch (e) {
      console.log(e);
    }
  }, [fetchMessages, dispatch, props, auth_user]);

  const quoteData = useCallback(() => {
    const quoteMsg = {
      from_username: props.sender.from_username,
      message_body:
        props.sender.message_body || props.sender.message_attachment,
      message_id: props.sender.message_id,
      attachment: props.sender.message_attachment,
    };
    dispatch(setQuote(quoteMsg));
    props.setOption(false);
  }, [dispatch, props]);

  const downloadAttachment = useCallback(
    (file) => {
      const attachList = file.split(",");
      const attachmentNames = props.sender?.message_originalname?.split(",");
      attachList.forEach((attachment, index) => {
        console.log(attachmentNames, index);
        const anchor = document.createElement("a");
        anchor.href = `/api/bwccrm/storage/app/public/chat_attachments/${attachment}`;
        anchor.download = attachmentNames[index] || attachment;
        anchor.click();
      });
    },
    [props.sender]
  );

  return (
    <div
      className="optionsContainer"
      style={{
        [props.sender?.message_from === loggedInUser ? "right" : "left"]:
          "100%",
      }}
    >
      <div className="options">
        <p
          onClick={() => {
            props.setForwardModel(true);
          }}
        >
          Forward
        </p>
        <p onClick={() => copyTextToClipboard(props.sender.message_body)}>
          Copy
        </p>
        {role == ADMIN ? <p onClick={onDeleteMessage}>Delete</p> : null}
        <p onClick={quoteData}>Quote</p>
        {props.sender?.message_attachment ? (
          <p
            onClick={() => downloadAttachment(props.sender?.message_attachment)}
          >
            Download
          </p>
        ) : null}
      </div>
    </div>
  );
});

const QuotedMessage = React.memo((props) => {
  const { auth_user } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
    };
  });

  const loggedInUser = auth_user?.elsemployees_empid;

  return (
    <>
      {props.sender.message_quotebody !== "null" ? (
        <a
          className="sendQuotedMsg"
          href={"#" + props.sender.message_quoteid}
          style={{
            borderBottom:
              props.sender.message_from === loggedInUser
                ? "1px solid #000"
                : "none",
          }}
        >
          <p className="qName">{props.sender.message_quoteuser}</p>
          <p className="qMsg">{props.sender.message_quotebody}</p>
        </a>
      ) : null}
    </>
  );
});

const ReadStatus = (props) => {
  if (
    parseInt(props.sender?.seen) === 1 &&
    parseInt(props.sender?.message_to) ==
      parseInt(props.active_user?.elsemployees_empid)
  ) {
    return <DoneAllIcon color="primary" fontSize="small" />;
  } else if (
    parseInt(props.sender?.seen) !== 1 &&
    parseInt(props.sender?.message_to) ==
      parseInt(props.active_user?.elsemployees_empid)
  ) {
    return <CheckIcon fontSize="small" />;
  } else {
    return null;
  }
};

export default UserMessage;
