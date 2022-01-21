import React, { createRef, useState } from "react";
import MessageTextContainer from "./MessageTextContainer/MessageTextContainer";
import MessageWindowHeader from "./MessageWindowHeader/MessageWindowHeader";
import MessageInput from "./MessageInput/MessageInput";
import "./MessageWindow.css";
import Dropzone from "react-dropzone";
import { Box } from "@material-ui/core";
import GalleryModal from "../../Components/GalleryModal/GalleryModal";

function GroupMessageWindow() {
  const dropzoneRef = createRef();
  const [attachment, setAttachment] = useState([]);
  const [scrollDown, setScrollDown] = useState("");
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
          <GalleryModal />
        </Box>
      )}
    </Dropzone>
  );
}

export default GroupMessageWindow;
