import { Avatar, CircularProgress, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getGroupParticipants } from '../../../api/chat';
import { attachments_url } from '../../../constants/apiConstants';
import { setParticipantModelState } from '../../../Redux/actions/app';
import { BLACK, SECONDARYMAIN, WHITE } from '../../../Theme/colorConstant';
import './participants.css'

function Participants() {
    
    const { auth_user, active_group, isNightMode } = useSelector((store) => {
        return {
          auth_user: store.auth.auth_user || {},
          active_group: store.chat.active_group || {},
          isNightMode: store.app.mode || false
        }
      });
    const [participants, setParticipants] = useState([])
    const image = active_group?.group_image;
    const dispatch = useDispatch()
    const getParticipants = useCallback(async ()=>{
        const params = {
            data:{
                user_id:auth_user?.elsemployees_empid,
                group_id:active_group?.group_id
            }
        }
        const response = await dispatch(getGroupParticipants(params));
      
        setParticipants(response.data?.participants)
    },[active_group?.group_id, auth_user?.elsemployees_empid, dispatch])
    useEffect(() => {
        getParticipants();
    }, [getParticipants])
    return (
        <div className="participants">
            <IconButton onClick={() => dispatch(setParticipantModelState(false))}>
                <CloseIcon style={{color: isNightMode ? WHITE : BLACK}} />
            </IconButton>
            <div className="participantsHeader">
                <div className="groupLogo">
                    {image ? (<Avatar src={`${attachments_url}${image}`} />) : <Avatar>{active_group?.group_name.toUpperCase()[0]}</Avatar>}
                    <h3 style={{ fontWeight: "400", color: SECONDARYMAIN }}>{active_group?.group_name}</h3>
                </div>
            </div>
            {participants.length > 0 ? (
                <div className="participantsContainer">
                    {participants.map((participant) => {
                        return (
                            <div className="participant" key={participant?.elsemployees_empid}>
                                <div className="participantsdetails">
                                    <Avatar src={`/bizzportal/public/img/${participant?.elsemployees_image}`} style={{ marginRight: "10px" }} />
                                    <h4 style={{ fontWeight: "400", color: isNightMode ? WHITE : BLACK }}>{participant?.elsemployees_name}</h4>
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
