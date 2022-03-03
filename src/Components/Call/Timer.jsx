import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const Timer = React.memo((props) => {
  const [duration, setDuration] = useState(0);
  const interval = useRef(0);

  const tick = () => {
    setDuration((d) => d + 1);
  };
  useEffect(() => {
    interval.current = setInterval(tick, 1000);
    return () => {
      clearInterval(interval.current);
    };
  }, []);
  const time = moment.duration(duration, 'seconds');
  return (
    <span className={props.className || ""} style={props.style}>
      {`${time.minutes().toString().padStart(2,'0')}:${time.seconds().toString().padStart(2,'0')}`}
    </span>
  );
});

export default Timer;
