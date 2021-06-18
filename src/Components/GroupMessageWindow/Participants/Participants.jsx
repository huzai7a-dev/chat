import { Avatar, CircularProgress, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { participantModel } from '../../../Redux/Action';

function Participants() {
    const data = useSelector((state) => {
        return state;
    });
    const [participants, setParticipants] = useState([])
    const image = data.groupChat?.group_image;
    const dispatch = useDispatch()
    // const LetterPicture = () => {
    //     const fLetter = data.groupChat?.group_name.split(" ")[0].charAt(0);
    //     const sLetter = data.groupChat?.group_name.split(" ")[1].charAt(0);
    //     return (
    //         <div className="pictureContainer">
    //             <h2 className="picture">{fLetter + sLetter}</h2>
    //         </div>
    //     )
    // }
    useEffect(() => {
        const formData = new FormData();
        formData.append('user_id', data.Auth.data?.elsemployees_empid)
        formData.append('group_id', data.groupChat?.group_id)
        axios.post('/api/bwccrm/groupparticipants', formData)
            .then(res => setParticipants(res.data.participants))
            .catch(err => console.log(err))
    }, [])
    return (
        <div className="participants">
            <IconButton onClick={() => dispatch(participantModel(false))}>
                <CloseIcon />
            </IconButton>
            <div className="participantsHeader">
                <div className="groupLogo">
                    {/* {image ? (<Avatar src={`/api/bwccrm/storage/app/public/chat_attachments/${image}`} />) : <LetterPicture />} */}
                    <Avatar src={`/api/bwccrm/storage/app/public/chat_attachments/${image}`} />
                    <h3 style={{ fontWeight: "400" }}>{data.groupChat?.group_name}</h3>
                </div>
            </div>
            {participants.length > 0 ? (
                <div className="participantsContainer">
                    {participants.map((participant) => {
                        return (
                            <div className="participant" key={participant?.elsemployees_empid}>
                                <div className="participantsdetails">
                                    <Avatar src={`/bizzportal/public/img/${participant?.elsemployees_image}`} style={{ marginRight: "10px" }} />
                                    <h4 style={{ fontWeight: "400" }}>{participant?.elsemployees_name}</h4>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="participantsLoader"><CircularProgress /></div>
            )}
        </div>
    )
}

export default Participants
