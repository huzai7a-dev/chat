import React, { useState, useCallback, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Typography, Box, IconButton, Button, FormControl, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getUserAttachments, getGroupAttachments } from "../../api/message";
import { BLACK, WHITE } from "../../Theme/colorConstant";
import ViewAttachment from "../Utils/ViewAttachment";
import "./gallerymodal.style.css";

const GalleryModal = () => {

  const classes = useStyle();
  const [attachmentType, setAttachmentType] = useState("all");
  const [attachSrc, setAttachSrc] = useState("");
  const [showGallery, setShowGallery] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [mediaName, setMediaName] = useState("");
  const dispatch = useDispatch();

  const { auth_user, activeId, activeType, isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user,
      activeType: store.chat?.active?.activeType,
      activeId: store.chat?.active?.activeId,
      isNightMode: store.app.mode || false,
    };
  });

  const location = useLocation();
  const history = useHistory();

  // USER
  const getUserGalleryItems = useCallback(async () => {
    try {
      const params = {
        data: {
          user_id: auth_user?.elsemployees_empid,
          from_id: auth_user?.elsemployees_empid,
          to_id: activeId,
        },
      };
      const response = await dispatch(getUserAttachments(params));
      setAttachments(response.data.attachments);
    } catch (e) {
      console.log(e);
    }
  }, [auth_user, activeId, dispatch]);

  // GROUP
  const getGroupGalleryItems = useCallback(async () => {
    try {
      const params = {
        data: {
          user_id: auth_user?.elsemployees_empid,
          group_id: activeId,
        },
      };
      const response = await dispatch(getGroupAttachments(params));
      setAttachments(response.data.attachments);
    } catch (e) {
      console.log(e);
    }
  }, [auth_user, activeId, dispatch]);

  useEffect(() => {
    const hash = location.hash.substring(1);
    setShowGallery(hash.toLowerCase() == "gallery");
  }, [location.hash]);

  useEffect(() => {
    if (showGallery) {
      if (activeType == "user") getUserGalleryItems();
      else getGroupGalleryItems();
    }
  }, [activeType, getGroupGalleryItems, getUserGalleryItems, showGallery]);

  const openImage = useCallback((e, name) => {
    setModalVisible(true);
    setMediaName(name);
    setAttachSrc(e.target.currentSrc);
  }, []);

  const renderDropdown = useMemo(() => {
    const handleChange = (e) => {
      setAttachmentType(e.target.value);
    };
    return (
      <FormControl style={{ minWidth: 80 }}>
        <Select
          value={attachmentType}
          onChange={handleChange}
          displayEmpty
          variant="filled"
          style={{ color: isNightMode ? WHITE : BLACK, backgroundColor: "transparent" }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="media">Media</MenuItem>
          <MenuItem value="files">Files</MenuItem>
        </Select>
      </FormControl>
    );
  }, [attachmentType, isNightMode]);

  const renderAttachmentsHeader = useMemo(() => {
    return (
      <Box
        display="flex"
        alignItems="center"
        className={classes.attachmentHeader}
      >
        <IconButton onClick={() => history.replace(location.pathname)}>
          <CloseIcon style={{ color: isNightMode ? WHITE : BLACK }} />
        </IconButton>
        <Typography variant="h5" style={{ flex: "1", textAlign: "center", color: isNightMode ? WHITE : BLACK }}>
          Gallery
        </Typography>
        {renderDropdown}
      </Box>
    );
  }, [classes.attachmentHeader, isNightMode, renderDropdown, history, location.pathname]);

  const filterAttachment = useCallback(
    (attachment) => {
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
    },
    [attachmentType]
  );

  const renderAttachments = useMemo(() => {
    return attachments?.filter(filterAttachment).map((attachmentObj) => {
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
                  onClick={openImage}
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
                style={{ margin: "10px 0px", width: "100%" }}
              />
            );
          } else {
            const fileName = attachmentObj.message_originalname;
            return (
              <div className="attachView" key={id}>
                <div className="file" style={{ maxWidth: "100%" }}>
                  <FileCopyIcon style={{ color: isNightMode ? WHITE : BLACK }} />
                  <Typography variant="caption" style={{ color: isNightMode ? WHITE : BLACK }}>{fileName}</Typography>
                  <DownloadButton />
                </div>
              </div>
            );
          }
        });
    });
  }, [attachments, filterAttachment, openImage, isNightMode]);

  const galleryWidth = window.innerWidth < 700 ? "100%" : "400px";
  return (
    <Box
      style={{ right: showGallery ? "0" : "-100%", width: galleryWidth, backgroundColor: isNightMode ? BLACK : WHITE }}
      className="gallery__container"
    >
      {renderAttachmentsHeader}
      <Box className={classes.attachments}>
        {attachments?.length > 0 ? (
          renderAttachments
        ) : (
          <Typography align="center" style={{ color: isNightMode ? WHITE : BLACK }}>No Attachments</Typography>
        )}
      </Box>
      <ViewAttachment
        src={attachSrc}
        openModel={modalVisible}
        name={mediaName}
        handClose={(state) => setModalVisible(state)}
      />
    </Box>
  );
};

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

export default GalleryModal;
