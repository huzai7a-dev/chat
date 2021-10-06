import React, { createRef, useState } from "react";
import MessageTextContainer from "./MessageTextContainer/MessageTextContainer";
import MessageWindowHeader from "./MessageWindowHeader/MessageWindowHeader";
import MessageInput from "./MessageInput/MessageInput";
import "./MessageWindow.css";
import Dropzone from "react-dropzone";

function MessageWindow() {
  const dropzoneRef = createRef();
  const [attachment, setAttachment] = useState([]);
  const [scrollDown,setScrollDown] = useState("");
  return (
    <Dropzone
      minSize={0}
      maxSize={30000}
      onDrop={(acceptedFiles) => setAttachment(acceptedFiles)}
      onDropRejected={()=>{console.log("File Rejected")}}
      noClick={true}
      noKeyboard={true}
      ref={dropzoneRef}
      isDragActive
      open
    >
      {({ getRootProps, getInputProps }) => (
        <div className="message__window" {...getRootProps()}>
          <MessageWindowHeader />
          <MessageTextContainer scrollDown={scrollDown}/>
          <MessageInput inputProps={getInputProps} attachment={attachment} setAttachment={setAttachment} setScrollDown={setScrollDown}/>
        </div>
      )}
    </Dropzone>
  );

}

export default MessageWindow;
