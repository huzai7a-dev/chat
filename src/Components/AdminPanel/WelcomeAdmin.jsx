import { Avatar, Box, Typography } from '@material-ui/core'
import React from 'react'
import { WHITE } from '../../Theme/colorConstant'

function WelcomeAdmin({isBarOpen}) {
    const divStyle = {height: 'calc(100vh - 64px)',width:isBarOpen ? "calc(100vw - 320px)": "100vw", transition:".2s"}
    return (
        <Box display="flex" justifyContent="center" alignItems="center" style={divStyle}>
            <Box display="flex" alignItems="center" flexDirection="column">
                <Avatar/>
                <Typography variant="h6" style={{color: WHITE}}>Welcome to admin panel</Typography>
            </Box>
        </Box>
    )
}

export default WelcomeAdmin
