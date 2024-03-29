import { Button, Typography } from "@material-ui/core";
import React from "react";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const RenderAttachment = ({attachments,fileName,onOpenImage,options}) => {
    const attachmentNames =  fileName?.split(",");
    return attachments.split(",").map((attachment, id) => {
      const DownloadButton = () => {
        return (
          <Button variant="outlined" size="small" color={"primary"} key={id}>
            <a
              href={`/api/bwccrm/storage/app/public/chat_attachments/${attachment}`}
              download={attachmentNames[id] || attachment}
              className="anchorText"
            >
              Download
            </a>
          </Button>
        );
      };
      const splitAttachment = attachment?.split(".");
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
                onOpenImage(e, attachmentNames[id] || attachment);
              }}
              height="auto"
              width="150px"
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
              width="150px"
              src={`/bizzportal/public/img/${attachment}`}
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
            style={{ margin: "10px 0px" }}
          />
        );
      } else {
        const name = attachmentNames[id] || attachment;
        
        return (
          <div className="attachView" key={id}>
            {options && options}
            <div className="file">
              <FileCopyIcon />
              <Typography variant="button">{name}</Typography>
              <DownloadButton />
            </div>
          </div>
        );
      }
    });
  };

  export default React.memo(RenderAttachment)