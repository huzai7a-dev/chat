import React, { createRef, useState } from "react";
import MessageTextContainer from "./MessageTextContainer/MessageTextContainer";
import MessageWindowHeader from "./MessageWindowHeader/MessageWindowHeader";
import MessageInput from "./MessageInput/MessageInput";
import "./MessageWindow.css";
import Dropzone from "react-dropzone";
import { Box } from "@material-ui/core";
import Attachments from "./Attachments/Attachments";
function MessageWindow() {
  const dropzoneRef = createRef();
  const [attachment, setAttachment] = useState([]);
  const [scrollDown, setScrollDown] = useState("");
  const [gallery, setGallery] = useState(false);
  return (
    <Dropzone
      minSize={0}
      maxSize={30000}
      onDrop={(acceptedFiles) => setAttachment(acceptedFiles)}
      onDropRejected={() => { console.log("File Rejected") }}
      noClick={true}
      noKeyboard={true}
      ref={dropzoneRef}
      isDragActive
      open
    >
      {({ getRootProps, getInputProps }) => (

        <Box display="flex" justifyContent="space-between" style={{width:"100%"}}>
          <div className="message__window" {...getRootProps()}>
            <MessageWindowHeader setGallery={setGallery} />
            <MessageTextContainer scrollDown={scrollDown} />
            <MessageInput inputProps={getInputProps} attachment={attachment} setAttachment={setAttachment} setScrollDown={setScrollDown} />
          </div>
         <Attachments setGallery={setGallery} gallery={gallery}/>
        </Box>

      )}
    </Dropzone>
  );

}

export default MessageWindow;
