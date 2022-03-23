import { Avatar, Box,Tooltip } from "@material-ui/core";
import React, { useCallback, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@mui/material/Modal";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import moment from "moment";
import { useOutsideAlerter } from "../../../../hooks/useOutsideClick";
import { setQuote } from "../../../../Redux/actions/app";
import ForwardMessage from "./ForwardMessage";
import RenderAttachment from "../../../../Components/Utils/RenderAttachment"
import ViewAttachment from "../../../../Components/Utils/ViewAttachment";
import { ADMIN } from '../../../../Role/index';
import { deleteGroupMessage } from "../../../../api/admin";
import { getGroupMessages } from "../../../../api/message";

function UserMessage({ chatgroup, ...props }) {
  const { auth_user, active_user, seenData } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user,
      active_user: store.auth.auth_user,
      seenData: store.message.groupMessages.seendata
    };
  });
  const dispatch = useDispatch();
  const [media, setMedia] = useState("");
  const [option, setOption] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [forwardModel, setForwardModel] = useState(false);
  const attachments = chatgroup.groupmessage_attachment;
  const menuDiv = useRef();

  const onClickOutside = useCallback(() => {
    setOption(false);
  }, []);

  useOutsideAlerter(menuDiv, onClickOutside);
  const forwardMessageParams = {
    data: {
      user_id: auth_user?.elsemployees_empid,
      loginuser_id: auth_user?.elsemployees_empid,
      message_to: "",
      message_body: chatgroup.groupmessage_body || null,
      message_quoteid: chatgroup?.groupmessage_quoteid || null,
      message_quotebody: chatgroup?.groupmessage_quotebody || null,
      message_quoteuser: chatgroup?.groupmessage_quoteuser || null,
      message_attachment: chatgroup.groupmessage_attachment,
      groupmessage_forwarded: 1,
      message_originalname: chatgroup.groupmessage_originalname || null,
    },
  };

  
  const image = chatgroup.from_userpicture;
  const loggedInUser = auth_user?.elsemployees_empid;
  const user = chatgroup.from_userid;
  const role = auth_user?.elsemployees_roleid;
  // function to open image/video
  const openImage = (e) => {
    setMedia(e.target.src);
    setOpenModel(true);
  };
 
  const quoteData = () => {
    const quoteMsg = {
      from_username: chatgroup.from_username,
      message_id: chatgroup.groupmessage_id,
      groupmessage_body:
        chatgroup.groupmessage_attachment || chatgroup.groupmessage_body,
      attachment: chatgroup.groupmessage_attachment,
    };
    dispatch(setQuote(quoteMsg));
    setOption(false);
  };

  const fetchMessages = useCallback(() => {
    const params = {
      data: {
        group_id: chatgroup.groupmessage_id,
      },
    };
    dispatch(getGroupMessages(params));
  }, [dispatch, chatgroup])

  const onDeleteMessage = useCallback(async () => {
    try {
      const params = {
        data: {
          groupmessage_id: chatgroup.groupmessage_id
        }
      };
      await dispatch(deleteGroupMessage(params));
      fetchMessages();
    } catch (e) {
      console.log(e);
    }
  }, [dispatch, chatgroup, fetchMessages])

  const downloadAttachment = (file) => {
    const attachList = file.split(",");
    attachList.forEach((attachment) => {
      const anchor = document.createElement("a");
      anchor.href = `/api/bwccrm/storage/app/public/chat_attachments/${attachment}`;
      anchor.download = attachment;
      anchor.click();
    });
  };

  return (
    <div
      id={chatgroup.groupmessage_id}
      className="senderMessage"
      style={{ flexDirection: user == loggedInUser && "row-reverse" }}
    >
      <div className="userMessage__picture">
        {user !== loggedInUser && (
          <Avatar
            src={`/bizzportal/public/img/${image}`}
            style={{
              width: "40px",
              height: "40px",
              visibility:
                props.head?.groupmessage_id == chatgroup?.groupmessage_id
                  ? "visible"
                  : "hidden",
            }}
          />
        )}
      </div>

      <div className="userMessageBox">
        <div
          className={
            user !== loggedInUser
              ? "senderMessage__details"
              : "userMessage__details"
          }
        >
          {props.tail?.groupmessage_id == chatgroup?.groupmessage_id && (
            <div className="userMessage__name">
              <p>
                {user !== loggedInUser ? chatgroup.from_username + "," : ""}
              </p>
            </div>
          )}
          {props.tail?.groupmessage_id == chatgroup?.groupmessage_id && (
            <div
              className="userMessage__time"
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf:
                  chatgroup.from_userid !== loggedInUser
                    ? "flex-start"
                    : "flex-end",
              }}
            >
              <p>{moment(props.head?.fullTime).format("LT")}</p>
            </div>
          )}
        </div>
        {chatgroup.groupmessage_attachment ? (
          <div
            className="sentAttachment"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent:
                chatgroup.from_userid === loggedInUser
                  ? "flex-end"
                  : "flex-start",
              alignItems: "center",
            }}
          >
            <RenderAttachment
              attachments={attachments}
              fileName={chatgroup.groupmessage_originalname}
              onOpenImage={(e)=> openImage(e)}
            />
          </div>
        ) : null}
        {chatgroup.groupmessage_body ? (
          <div className="recieverQoutMsg__container">
            <div>

            {chatgroup.groupmessage_quotebody &&
            chatgroup.groupmessage_quotebody !== "null" ? (
              <a
                className="sendQuotedMsg"
                href={"#" + chatgroup.groupmessage_quoteid}
              >
                <p className="qName">{chatgroup.groupmessage_quoteuser}</p>
                <p className="qMsg">{chatgroup.groupmessage_quotebody}</p>
              </a>
            ) : null}
            {chatgroup.groupmessage_body !== null &&
              chatgroup.groupmessage_body !== "null" && (
                <div
                  className={
                    user !== loggedInUser
                      ? "senderMessage__text"
                      : "recieverMessage__text"
                  }
                >
                  {chatgroup.groupmessage_body}
                </div>
              )}
            </div>
            <div
              ref={menuDiv}
              className="msgOption"
              style={option ? { display: "flex" } : null}
              onClick={() => {
                setOption(!option);
              }}
            >
              <MoreVertIcon />
              {option ? (
                <div
                  className="optionsContainer"
                  style={{
                    [chatgroup?.from_userid === loggedInUser
                      ? "right"
                      : "left"]: "100%",
                  }}
                >
                  <div className="options">
                    <p
                      onClick={() => {
                        setForwardModel(true);
                      }}
                    >
                      Forward
                    </p>
                    {role == ADMIN ? (
                      <p
                        onClick={onDeleteMessage}
                      >
                        Delete
                      </p> 
                    ) : null}
                    <p onClick={quoteData}>Quote</p>
                    {chatgroup.groupmessage_attachment ? (
                      <p
                        onClick={() =>
                          downloadAttachment(chatgroup.groupmessage_attachment)
                        }
                      >
                        Download
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <Box display="flex" style={{ float: "right" }}>
          {seenData.map((seen, id) => {
            return seen.messageid == chatgroup.groupmessage_id &&
              seen.userid != active_user?.elsemployees_empid ? (
              <Tooltip title={seen.username}>
                <Avatar
                  key={id}
                  style={{ height: "20px", width: "20px" }}
                  src={`/bizzportal/public/img/${seen.userpicture}`}
                />
              </Tooltip>
            ) : null;
          })}
        </Box>

        <ViewAttachment
          src={media}
          openModel={openModel}
          handClose={(state)=> setOpenModel(state)}
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

export default React.memo(UserMessage);
