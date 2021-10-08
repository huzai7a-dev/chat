import React, { useEffect, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Select from '@mui/material/Select';
import { Typography,Box,IconButton,Button } from '@material-ui/core';
import { makeStyles } from '@mui/styles';
import { getUserAttachments } from '../../../api/message';
import { useSelector } from 'react-redux';
const useStyle = makeStyles({
    attachmentHeader:{
        height:"10vh",
        padding:"0px 5px"
    },
    attachments:{
        height:"90vh",
        overflowY:"scroll",
        padding:"0px 5px"
    }
})
function Attachments({gallery,setGallery}) {
    const classes = useStyle();
    const [attachmentType, setAttachmentType] = useState("all");

    const { auth_user, active_user,attachments} = useSelector((store) => {
        return {
          auth_user: store.auth?.auth_user || {},
          active_user: store.chat?.active_user || {},
          attachments:store.message?.attachments || ""
        };
      });

    const DropDown = () => {
        const handleChange =(e)=>{
            setAttachmentType(e.target.value);
        }
        return (
            <FormControl sx={{ minWidth: 80 }}>
                <Select
                    value={attachmentType}
                    onChange={handleChange}
                    displayEmpty
                    variant="filled"
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="media">Media</MenuItem>
                    <MenuItem value="files">Files</MenuItem>
                </Select>
            </FormControl>
        )
    }
    const AttachmentsHeader = () => {
        return (
            <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.attachmentHeader}>
               <IconButton onClick={()=>{setGallery(false)}}>
               <CloseIcon />
               </IconButton>
                <Typography variant="h5">Gallery</Typography>
                <DropDown />
            </Box>
        )
    }

    const Attachments = () => {
        return attachments.split(",").map((attachment, id) => {
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
          const splitAttachment = attachment.split(".");
          const attachmentType = splitAttachment[splitAttachment.length - 1];
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
          }
          if (
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
          } 
          else {
            const fileName = "File Name";
            return (
              <div className="attachView" key={id}>
                <div className="file" style={{width:"100%"}}>
                  <FileCopyIcon />
                  <Typography variant="caption">{fileName}</Typography>
                  <DownloadButton />
                </div>
              </div>
            );
          }
        });
      };
    return (
            <Box style={{width: gallery ? "400px": "0px",transition:"0.2s"}}>
                <AttachmentsHeader />
                <Box className={classes.attachments}>
                    <Attachments/>
                </Box>
            </Box>
    )
}

export default Attachments
