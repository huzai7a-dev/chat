import React, { useState,useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Select from "@mui/material/Select";
import { Typography, Box, IconButton, Button } from "@material-ui/core";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import { setGallery } from "../../../Redux/actions/message";
const useStyle = makeStyles({
  attachmentHeader: {
    height: "10vh",
    padding: "0px 5px",
  },
  attachments: {
    height: "90vh",
    overflowY: "scroll",
    padding: "0px 5px",
  },
});
function Attachments() {
  const classes = useStyle();
  const [attachmentType, setAttachmentType] = useState("all");
  const [attachSrc, setAttachSrc] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const {  attachments, gallery } = useSelector(
    (store) => {
      return {
        attachments: store.message?.attachments || "",
        gallery: store.message?.gallery || false,
      };
    }
  );

  const openImage = useCallback((e) => {
    setOpen(true);
    setAttachSrc(e.target.currentSrc);
  },[]);

  const DropDown = React.memo(() => {
    const handleChange = (e) => {
      setAttachmentType(e.target.value);
    };
    return (
      <FormControl sx={{ minWidth: 80 }}>
        <Select
          value={attachmentType}
          onChange={handleChange}
          displayEmpty
          variant="filled"
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="media">Media</MenuItem>
          <MenuItem value="files">Files</MenuItem>
        </Select>
      </FormControl>
    );
  });
  const AttachmentsHeader = React.memo(() => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={classes.attachmentHeader}
      >
        <IconButton
          onClick={() => {
            dispatch(setGallery(false));
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5">Gallery</Typography>
        <DropDown />
      </Box>
    );
  });


  const filterAttachment = useCallback((attachment) => {
    const media = [
      "jpg",
      "jpeg",
      "gif",
      "jpeg",
      "mp4",
      "mkv",
      "wmv",
      "flv",
      "png",
      "wav",
    ];
    const files = [
      "DOC",
      "DOCX",
      "HTML",
      "HTM",
      "ODT",
      "PDF",
      "XLS",
      "XLSX",
      "ODS",
      "PPT",
      "PPTX",
      "TXT",
      "ZIP",
      "GITIGNORE",
    ];
    const extension = attachment.message_originalname?.split(".").pop();
    if (attachmentType == "media") {
      return media.includes(extension.toLowerCase());
    } else if (attachmentType == "files") {
      return files.includes(extension.toUpperCase());
    } else {
      return true;
    }
  },[attachmentType]);

  const Attachments = React.memo(() => {
    return attachments.filter(filterAttachment).map((attachmentObj) => {
      return attachmentObj.message_attachment
        .split(",")
        .map((attachment, id) => {
          const DownloadButton = () => {
            return (
              <Button variant="outlined" size="small" color={"primary"}>
                <a
                  href={`/api/bwccrm/storage/app/public/chat_attachments/${attachment}`}
                  download={attachment}
                  className="anchorText"
                >
                  Download
                </a>
              </Button>
            );
          };
          const attachmentType = attachment.split(".").pop();

          if (
            attachmentType.toLowerCase() === "jpg" ||
            attachmentType.toLowerCase() === "gif" ||
            attachmentType.toLowerCase() === "png" ||
            attachmentType.toLowerCase() === "jpeg"
          ) {
            return (
              <div className="attachView" key={id}>
                <img
                  onClick={(e) => {
                    openImage(e);
                  }}
                  height="auto"
                  width="100%"
                  src={`/api/bwccrm/storage/app/public/chat_attachments/${attachment}`}
                  alt="attachment"
                />
              </div>
            );
          } else if (
            attachmentType.toLowerCase() === "mp4" ||
            attachmentType.toLowerCase() === "mkv" ||
            attachmentType.toLowerCase() === "wmv" ||
            attachmentType.toLowerCase() === "flv"
          ) {
            return (
              <div className="attachView" key={id}>
                <video
                  height="auto"
                  width="100%"
                  src={`/api/bwccrm/storage/app/public/chat_attachments/${attachment}`}
                  alt="attachments"
                  controls
                />
              </div>
            );
          } else if (attachmentType.toLowerCase() === "wav") {
            return (
              <audio
                src={`/api/bwccrm/storage/app/public/chat_attachments/${attachment}`}
                controls
                style={{ margin: "10px 0px", width:"100%" }}
              />
            );
          } else {
            const fileName = attachmentObj.message_originalname;
            return (
              <div className="attachView" key={id}>
                <div className="file" style={{ maxWidth: "100%" }}>
                  <FileCopyIcon />
                  <Typography variant="caption">{fileName}</Typography>
                  <DownloadButton />
                </div>
              </div>
            );
          }
        });
    });
  });
  const modalStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const imgStyle = {
    width: "auto",
    maxWidth: "100wv",
    maxHeight: "100vh",
    display: "block",
    height: "auto",
  };
  return (
    <Box style={{ width: gallery ? "400px" : "0px", transition: "0.2s" }}>
      <AttachmentsHeader />
      <Box className={classes.attachments}>
        {attachments.length > 0 && <Attachments />}
      </Box>
      <Modal
        open={open}
        onClose={()=>{setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={modalStyle}
      >
        <div>
          <img src={attachSrc} style={imgStyle} />
        </div>
      </Modal>
    </Box>
  );
}

export default React.memo(Attachments);