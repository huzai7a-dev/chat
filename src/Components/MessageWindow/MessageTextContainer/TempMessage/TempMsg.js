import {  useMemo } from "react";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import "./tempmsg.css";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";

function TempMsg(props) {
  
  const time = moment().format('Y-MM-D, h:mm:ss')
  const attach = props.msg.tempAttachment;
  const AttachmentPreview = useMemo(() => {
    return attach.map((item, id) => {
      const type = item.type.split("/")[0];
      if (type === "image") {
        const url = URL.createObjectURL(item);
        return (
          <div className="attachMedia" key={id}>
            <img key={item.path} src={url} height="auto" width="150px" />
          </div>
        );
      }
      if (type === "video") {
        const url = URL.createObjectURL(item);
        return (
          <div className="attachMedia" key={id}>
            <video key={item.path} src={url} height="auto" width="150px" />
          </div>
        );
      } else {
        return (
          <div className="attachDocument" key={id}>
            <FileCopyIcon />
            <p>{item.name}</p>
            <p>{`${item.size}KB`}</p>
          </div>
        );
      }
      return null;
    });
  }, [attach]);
  return (
    <div className="userMessage">
      <div>
        <div className="userMessage__tempTime">
          <p>{time}</p>
        </div>
        <div className="attachment" style={{ display: "flex", flexWrap: "wrap" }}>
          {attach ? AttachmentPreview : ""}
        </div>
        {props.msg.tempText ? (
          <div className="recieverMessage__text">{props.msg.tempText}</div>
        ) : (
          ""
        )}
      </div>
      <div className="loading" style={{ float: "right" }}>
        <CircularProgress style={{ width: "20px", height: "20px" }} />
      </div>
    </div>
  );
}

export default TempMsg;
