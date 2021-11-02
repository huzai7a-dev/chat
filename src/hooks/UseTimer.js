import { useEffect, useState } from "react";

export const useTimer = (duration) => {
  const [seconds, setSeconds] = useState(duration);
    
  useEffect(() => {
      if (seconds < 60) {
          setTimeout(() => setSeconds(seconds + 1), 1000);
      }else {
          setSeconds(0)
      }
  });
  return seconds;
};

