import Modal from "@mui/material/Modal";
import React from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
type attachmentProps = {
  src: string;
  openModel: boolean;
  handClose: (state: boolean) => void;
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

const ViewAttachment = ({ src, openModel, handClose }: attachmentProps) => {
  return (
    <Modal
      open={openModel}
      onClose={() => handClose(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={modalStyle}
    >
      <div>
        <TransformWrapper initialScale={1}>
          <TransformComponent>
            <img src={src} style={imgStyle} />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </Modal>
  );
};

export default React.memo(ViewAttachment);
