import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllSeenUsers } from '../api/message';
import { Avatar } from "@material-ui/core";

const SeenUsers = React.memo((props) => {
    const dispatch = useDispatch();
    const [seenMembers, setSeenMembers] = useState();
    
    const getSeenUsers = useCallback(async () => {
        try {
            const params = {
                data: {
                    group_id: props.group?.group_id,
                    groupmember_id: props.seen?.map(s => s.userid),
                }
            }
            const response = await dispatch(fetchAllSeenUsers(params))
            setSeenMembers(response.data.seendata);
        } catch(e) {
            console.log(e)
        }
    }, [dispatch, props])

    useEffect(() => {
      getSeenUsers();
    }, [getSeenUsers])
    
    return (
        <div>
            {seenMembers?.map((seen) => {
                return (
                    <div style={{display:"flex", flexDirection: "row", alignItems:'center',}} key={seen.userid}>
                        <Avatar
                            src={`/bizzportal/public/img/${seen.userpicture}`}
                            style={{ margin: "0.4rem",width: 24, height: 24 }}
                        />
                        <h3>{seen.username}</h3>
                    </div>
                )
            })}
        </div>
    )
});

export default SeenUsers;