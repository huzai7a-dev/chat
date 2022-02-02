import React, { createRef, useState } from "react";
import MessageTextContainer from "./MessageTextContainer/MessageTextContainer";
import MessageInput from "./MessageInput/MessageInput";
import "./MessageWindow.css";
import Dropzone from "react-dropzone";
import { Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { setEditGroupModelState, setParticipantModelState } from "../../Redux/actions/app";
import Modal from "react-modal";
import Participants from "./Participants/Participants";
import EditGroup from "./EditGroup/EditGroup";

function GroupMessageWindow() {
  const dropzoneRef = createRef();
  const dispatch = useDispatch();
  const [attachment, setAttachment] = useState([]);
  const [scrollDown, setScrollDown] = useState("");

  const { participantModelState, editGroupModelState } = useSelector((store) => {
    return {
      participantModelState: store.app.participantModelState || false,
      editGroupModelState: store.app.editGroupModelState || false,
      isNightMode:store.app.mode || false
    };
  });

  return (
    <Dropzone
      onDrop={(acceptedFiles) => setAttachment(acceptedFiles)}
      noClick={true}
      noKeyboard={true}
      ref={dropzoneRef}
      isDragActive
      open
    >
      {({ getRootProps, getInputProps }) => (
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: "100%" }}
        >
          <div className="message__window" {...getRootProps()}>
            {/* <MessageWindowHeader /> */}
            <MessageTextContainer scrollDown={scrollDown} />
            <MessageInput
              inputProps={getInputProps}
              attachment={attachment}
              setAttachment={setAttachment}
              setScrollDown={setScrollDown}
            />
          </div>
          <Modal
            className="groupModel"
            isOpen={participantModelState}
            onRequestClose={() => dispatch(setParticipantModelState(false))}
          >
            <Participants />
          </Modal>
          <Modal
            className="groupModel"
            isOpen={editGroupModelState}
            onRequestClose={() => dispatch(setEditGroupModelState(false))}
          >
            <EditGroup />
          </Modal>
        </Box>
      )}
    </Dropzone>
  );
}

export default GroupMessageWindow;
