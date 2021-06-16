import React, { createRef, useState } from "react";
import MessageTextContainer from "./MessageTextContainer/MessageTextContainer";
import MessageWindowHeader from "./MessageWindowHeader/MessageWindowHeader";
import MessageInput from "./MessageInput/MessageInput";
import "./MessageWindow.css";
import Dropzone from "react-dropzone";

function MessageWindow() {
  const dropzoneRef = createRef();
  const [attachment, setAttachment] = useState([]);
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
        <div className="message__window" {...getRootProps()}>
          <MessageWindowHeader />
          <MessageTextContainer />
          <MessageInput inputProps={getInputProps} attachment={attachment} setAttachment={setAttachment}/>
        </div>
      )}
    </Dropzone>
  );
}

export default MessageWindow;
