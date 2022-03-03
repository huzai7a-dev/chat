import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import CallEndIcon from "@material-ui/icons/CallEnd";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { DANGER, WHITE } from "../../Theme/colorConstant";
import "./call.css";
import { useSelector } from "react-redux";
import Timer from "./Timer";
import Modal from "react-modal";

const OnCalling = React.memo((props) => {
  const [isMinimized, setMinimized] = useState(false);
  const containerRef = useRef(null);
//   const pos1  = useRef(0);
//   const pos2  = useRef(0);
//   const pos3  = useRef(0);
//   const pos4  = useRef(0);

  const { activeCaller } = useSelector((store) => {
    return {
      activeCaller: store.call.activeCaller,
    };
  });

  const minimizedStyle = {
    content: {
        padding:0,
        height: "250px",
        width: "fit-content",
    },
    overlay: {
        position: "absolute",
        inset: 0,
        height: "250px",
        width: "fit-content",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
      },
  };

//   useEffect(() => {
//     if(containerRef.current) {
//         containerRef.current?.addEventListener("mousedown", )
//     }
//   }, [])

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3.current = e.clientX;
//     pos4.current = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//   const dragElement = (elmnt) => {
//     pos1.current = 0;
//     pos2.current = 0;
//     pos3.current = 0;
//     pos4.current = 0;

//     if (document.getElementById(elmnt.id + "header")) {
//       /* if present, the header is where you move the DIV from:*/
//       document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//     } else {
//       /* otherwise, move the DIV from anywhere inside the DIV:*/
//       elmnt.onmousedown = dragMouseDown;
//     }

    

//     function elementDrag(e) {
//       e = e || window.event;
//       e.preventDefault();
//       // calculate the new cursor position:
//       pos1 = pos3 - e.clientX;
//       pos2 = pos4 - e.clientY;
//       pos3 = e.clientX;
//       pos4 = e.clientY;
//       // set the element's new position:
//       elmnt.style.top = elmnt.offsetTop - pos2 + "px";
//       elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
//     }
//   }

  return (
    <Modal
      overlayRef={node => (containerRef.current = node)}
      style={isMinimized ? minimizedStyle : { content:{ padding: 0 } }}
      isOpen={activeCaller?.elsemployees_empid}
    >
      <Box padding={0} className="onCallingContainer">
        <Box p={2}>
          <IconButton onClick={() => setMinimized((v) => !v)}>
            {isMinimized ? <OpenInFullIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Typography variant="h5" style={{ color: WHITE }}>
            {activeCaller?.elsemployees_name}
          </Typography>
        </Box>
        <Box className="userIconContainer">
          <Avatar
            src={`/bizzportal/public/img/${activeCaller?.elsemployees_image}`}
            style={{ height: "80px", width: "80px", margin: "1rem" }}
          >
            {activeCaller?.elsemployees_name?.[0] || "A"}
          </Avatar>
          <Timer />
        </Box>
        <Box className="endCalBtn">
          <Tooltip title="End Call">
            <IconButton onClick={props.onReject}>
              <CallEndIcon style={{ color: DANGER }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Modal>
  );
});

export default OnCalling;
