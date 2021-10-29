import {useState} from 'react'
export const recorder = (startRecording)=>{
    const [audio,setAudio] = useState()
    const mediaConstraints = {
        audio: true
    };
    let item = [];
    const device = navigator.mediaDevices.getUserMedia(mediaConstraints);
    device.then(stream =>{
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            item.push(e.data)
            if (recorder.state == 'inactive') {
                const blob = new Blob(item,{type:'audio/webm'})
                setAudio(blob);
            }
        }
        return [audio,recorder];
    }).catch(err => {
        console.log(err)        
    })
}