import React from 'react'
import { Box, IconButton, Typography } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear';
import { SECONDARYMAIN,PRIMARYMAIN } from '../../../Theme/colorConstant';
import './record.css'
import { useTimer } from '../../../hooks/UseTimer';
function Recorder({onCancelVoice}) {
    const time = useTimer(60);
    return (
        <Box display="flex" alignItems="center" className="recorderContainer">
            <IconButton onClick={onCancelVoice}>
                <ClearIcon/>
            </IconButton>
            <Box flex="1" style={{paddingRight:"15px"}}>
                <div className="recorderTimeContainer">
                    <div className="recorderTime"/>
                </div>
            </Box>
            <Typography variant="caption">{`0:${time}`}</Typography>
        </Box>
    )
}

export default Recorder
