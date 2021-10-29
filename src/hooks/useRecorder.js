import {useState} from 'react'
export const useRecorder = ()=>{
    const [audio,setAudio] = useState()
    const mediaConstraints = {
        audio: true
    };
    let item = [];
    const device = navigator.mediaDevices.getUserMedia(mediaConstraints);
    device.then(stream =>{
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            console.log('blob');
            item.push(e.data)
            if (recorder.state == 'inactive') {
                const blob = new Blob(item,{type:'audio/webm'})
                setAudio(blob);
            }
        }
        return recorder
    }).catch(err => {
        console.log(err)        
    })
}