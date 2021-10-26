import React, { createRef, useState,useCallback } from "react";
import { Box } from "@material-ui/core";
import Dropzone from "react-dropzone";
import {Notify} from '../../helper/notify'
import "./MessageWindow.css";
import MessageTextContainer from "./MessageTextContainer/MessageTextContainer";
import MessageWindowHeader from "./MessageWindowHeader/MessageWindowHeader";
import MessageInput from "./MessageInput/MessageInput";
import Attachments from "./Attachments/Attachments";
function MessageWindow() {
  const dropzoneRef = createRef();
  const [attachment, setAttachment] = useState([]);
  const [scrollDown, setScrollDown] = useState("");
  return (
    <Dropzone
      onDrop={useCallback((acceptedFiles) => setAttachment(acceptedFiles))}
      onDropRejected={()=>{Notify('File Rejected','error')}}
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
          {...getRootProps()}
        >
          <div className="message__window">
            <MessageWindowHeader />
            <MessageTextContainer scrollDown={scrollDown} />
            <MessageInput
              inputProps={getInputProps}
              attachment={attachment}
              setAttachment={setAttachment}
              setScrollDown={setScrollDown}
            />
          </div>
          <Attachments />
        </Box>
      )}
    </Dropzone>
  );
}

export default MessageWindow;
