import { Avatar, Box, Typography,Button } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector} from 'react-redux';
import { BLACK, WHITE } from "../../../Theme/colorConstant";

const useStyles = makeStyles((theme) => ({
    user:{
        height:"50px",
        minWidth:"400px",
        margin: "8px 0px",
        cursor:"pointer",
        display:"block",
        padding:"0px 4px"
    }
}));

function User(props) {
    const classes = useStyles();
    const {isNightMode} = useSelector(store => {
        return {
            isNightMode: store.app.mode,
        }
    })
    return (
        <Button className={classes.user} onClick={()=>{props.onSelectToUser(props.user)}}>
            <Box display="flex" alignItems="center">
                <Avatar src={`/bizzportal/public/img/${props.user.elsemployees_image}`} />
                <Typography style={{marginLeft:"5px", color: isNightMode ? WHITE: BLACK}}>{props.user.elsemployees_name}</Typography>
            </Box>
        </Button>
    )
}

export default React.memo(User)
