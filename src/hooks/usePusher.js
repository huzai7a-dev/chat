import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const usePusher = (id,event)=>{
    const [pusherData, setpusherData] = useState("")
    const data = useSelector((state) => {
        return state;
    });
    useEffect(() => {
        Pusher.logToConsole = true;
        
        const pusher = new Pusher("f30ce11a6ce537110adc", {
          cluster: "ap2",
          encrypted: true,
        });
        const channel = pusher.subscribe(`bwccrm-chat${data.Auth.data?.elsemployees_empid}`);
        channel.bind(event, (data)=>{
            setpusherData(data);
        })
        return () => {
            pusher.unsubscribe(`bwccrm-chat${data.Auth.data?.elsemployees_empid}`);
        };
      }, [id])
    return {pusherData}
}

export default usePusher
