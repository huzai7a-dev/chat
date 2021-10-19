import React, { createRef, useState } from "react";
import MessageTextContainer from "./MessageTextContainer/MessageTextContainer";
import MessageWindowHeader from "./MessageWindowHeader/MessageWindowHeader";
import MessageInput from "./MessageInput/MessageInput";
import "./MessageWindow.css";
import Dropzone from "react-dropzone";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from "@material-ui/core";
import Attachments from "./Attachments/Attachments";
function MessageWindow() {
  const dropzoneRef = createRef();
  const [attachment, setAttachment] = useState([]);
  const [scrollDown, setScrollDown] = useState("");
  toast.configure()
  return (
    <Dropzone
      onDrop={(acceptedFiles) => setAttachment(acceptedFiles)}
      // onDragOver={}
      onDropAccepted={()=>toast.success('is Draging',{position:"top-right"})}
      noClick={true}
      noKeyboard={true}
      ref={dropzoneRef}
      isDragActive
      open
    >
      {({ getRootProps, getInputProps }) => (

        <Box display="flex" justifyContent="space-between" style={{width:"100%"}} {...getRootProps()}>
          <div className="message__window" >
            <MessageWindowHeader/>
            <MessageTextContainer scrollDown={scrollDown} />
            <MessageInput inputProps={getInputProps} attachment={attachment} setAttachment={setAttachment} setScrollDown={setScrollDown} />
          </div>
         <Attachments/>
        </Box>
      )}
    </Dropzone>
  );

}

export default MessageWindow;
