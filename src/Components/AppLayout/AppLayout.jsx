import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import User from "../ChatWindow/User/User";
import ChatWindow from "../ChatWindow/ChatWindow";
import MessageHeader from "../Utils/MessageHeader/MessageHeader";
import { useDispatch, useSelector } from "react-redux";
import "./appLayout.css";
import { setSideBar } from "../../Redux/actions/app";
import { DARKMAIN, PRIMARYMAIN } from "../../Theme/colorConstant";

const drawerWidth = 350;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${window.innerWidth < 700 ? "100%" : drawerWidth}px)`,
    marginLeft: drawerWidth,
    //  marginTop:'64px',
    // backgroundColor: "#000 !important",
    height:"64px !important",
    overflow:"hidden",
    boxShadow: "none",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: PRIMARYMAIN,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: window.innerWidth < 700 ? "100%" : drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
    justifyContent: "flex-end",

  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),s
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function AppLayout({ children }) {
  const dispatch = useDispatch();
  const { header, sideBarCollapsed,isNightMode } = useSelector((store) => {
    return {
      header: store.chat.active || {},
      sideBarCollapsed: store.app.sideBarCollapsed || false,
      isNightMode: store.app.mode || false,
    };
  });
  const classes = useStyles();
  const theme = useTheme();


  const handleDrawerOpen = () => {
    dispatch(setSideBar(false));
  };

  const handleDrawerClose = () => {
    dispatch(setSideBar(true));
  };

  return (
    <div className={classes.root}>
      {/* <CssBaseline /> */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: !sideBarCollapsed,
        })}
        style={{backgroundColor: isNightMode ? DARKMAIN : "#fff"}}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(
              classes.menuButton,
              !sideBarCollapsed && classes.hide
            )}
          >
            <MenuIcon />
          </IconButton>
          {Object.keys(header).length > 0 && <MessageHeader />}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={!sideBarCollapsed}
        // style={{borderWidth: 0}}
        PaperProps={{style:{ borderWidth:0 }}}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader} style={{backgroundColor: isNightMode ? DARKMAIN : "#fff",}}>
          <User />
          <IconButton onClick={handleDrawerClose} color="primary">
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>

        <ChatWindow />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: !sideBarCollapsed,
        })}
      >
        <div className={classes.drawerHeader} />
        <div
          className="appLayout__container"
          style={{
            width: !sideBarCollapsed ? `calc(100vw - ${350}px)` : "100vw",
            transition: ".2s",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
