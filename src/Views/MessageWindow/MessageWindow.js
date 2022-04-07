import React, { useRef, useState, useCallback } from "react";
import { Box } from "@material-ui/core";
import Dropzone from "react-dropzone";
import { Notify } from "../../helper/notify";
import "./MessageWindow.css";
import MessageTextContainer from "./MessageTextContainer/MessageTextContainer";
import MessageInput from "./MessageInput/MessageInput";

function MessageWindow() {
  const dropzoneRef = useRef();
  const [attachment, setAttachment] = useState([]);
  const [scrollDown, setScrollDown] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setAttachment(acceptedFiles)
  }, []);

  return (
    <Dropzone
      onDrop={onDrop}
      onDropRejected={() => {
        Notify("File Rejected", "error");
      }}
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
          style={{ width: "100%", height: "100%" }}
          {...getRootProps()}
        >
          <div className="message__window">
            <MessageTextContainer scrollDown={scrollDown} />
            <MessageInput
              inputProps={getInputProps}
              attachment={attachment}
              setAttachment={setAttachment}
              setScrollDown={setScrollDown}
            />
          </div>
        </Box>
      )}
    </Dropzone>
  );
}

export default MessageWindow;
