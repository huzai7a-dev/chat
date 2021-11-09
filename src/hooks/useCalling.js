import Peer from 'peerjs';
import { useEffect, useState } from 'react';

const peer = new Peer();

const useCalling =()=>{
  const [peerId,setPeerId] = useState('');
  useEffect(()=>{
    peer.on('open', (id) => {
      setPeerId(id)
    });
  },[])
}

export {useCalling};