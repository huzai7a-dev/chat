import Modal from "@mui/material/Modal";
import React from "react";
import { IconButton } from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/VerticalAlignBottom";
import CloseIcon from "@material-ui/icons/Close";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { WHITE } from "../../Theme/colorConstant";
type attachmentProps = {
  src: string;
  openModel: boolean;
  handClose: (state: boolean) => void;
  name: string;
};
const modalStyle: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const imgStyle: React.CSSProperties = {
  width: "auto",
  maxWidth: "100wv",
  maxHeight: "100vh",
  display: "block",
  height: "auto",
};

const iconWrapper: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: "space-around",
  zIndex:99,
}

const ViewAttachment = ({ src, openModel, handClose, name }: attachmentProps) => {

  const downloadAttachment = (e) => {
    e.stopPropagation();
    const anchor = document.createElement("a");
    anchor.href = src;
    anchor.download = name || "Image";
    anchor.click();
  };

  return (
    <Modal
      open={openModel}
      onClose={() => handClose(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={modalStyle}
    >
      <div style={{ position: "relative" }}>
        <TransformWrapper initialScale={1}>
          <TransformComponent>
            <img src={src} style={imgStyle} />
          </TransformComponent>
        </TransformWrapper>
        <div style={iconWrapper}>
          <IconButton onClick={downloadAttachment}>
            <DownloadIcon style={{ color: WHITE }} />
          </IconButton>
          <IconButton onClick={() => handClose(false)}>
            <CloseIcon style={{ color: WHITE }} />
          </IconButton>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(ViewAttachment);
