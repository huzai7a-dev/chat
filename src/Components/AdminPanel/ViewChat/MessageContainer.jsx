import { Box, makeStyles } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux';
import Message from './Message'
import {
    List,
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    InfiniteLoader
  } from "react-virtualized";
const useStyles = makeStyles(() => ({
    messageContainer: {
        height: "100%",
        overflowY: "auto",
        width: "100%",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        padding: "0px 20px"
    }
}));

function MessageContainer(props) {
    const classes = useStyles();
    const cache = React.useRef(
        new CellMeasurerCache({
          fixedWidth: true,
          defaultHeight: 100,
        })
    );
    const { messages } = useSelector((store) => {
        return {
            messages: store.message.userMessages || []
        }
    });
    const loadMoreRows =()=>{
        console.log('loading more messages');
    }
    return (
        <Box className={classes.messageContainer}>
            {messages.map((message)=>{
               return <Message key={message.message_id} message={message} toId={props.toId}/>
            })}
        </Box>
        // <div style={{width:"100%",height:"100%"}}>
        // <AutoSizer>
        //   {({ width, height }) => (
        //     <List
        //       width={width}
        //       height={height}
        //       rowHeight={cache.current.rowHeight}
        //       deferredMeasurementCache={cache.current}
        //       rowCount={messages.length}
              
        //       rowRenderer={({ key, index, style, parent }) => {
        //         const message = messages[index];

        //         return (
        //           <CellMeasurer
        //             key={key}
        //             cache={cache.current}
        //             parent={parent}
        //             columnIndex={0}
        //             rowIndex={index}
        //           >
        //               <div style={style}>
        //                 <Message key={message.message_id} message={message} toId={props.toId}/>
        //               </div>
        //           </CellMeasurer>
        //         );
        //       }}
        //     />
        //   )}
        // </AutoSizer>
        // </div>
    )
}

export default MessageContainer
