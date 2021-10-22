import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from '@material-ui/icons/Person';
import { Route, Switch,useHistory,useLocation,useRouteMatch } from "react-router-dom";
import { Button, Box } from "@material-ui/core";

import { useDispatch } from "react-redux";
import { setAdminPanel } from "../../Redux/actions/app";
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import GroupIcon from "@material-ui/icons/Group";
import ViewChat from "./ViewChat/ViewChat";
import ViewGroupChat from "./ViewGroupChat/ViewGroupChat";
import WelcomeAdmin from "./WelcomeAdmin";
import {PRIMARYMAIN} from '../../Theme/colorConstant'
import ViewUsers from "./ViewUsers/ViewUsers";
import ViewApprovedUsers from "./ApprovedUsers/ViewApprovedUser";
import ViewDeclinedUser from "./ViewDeclinedUsers/ViewDeclinedUser";
const drawerWidth = 240;
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
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    width: (props) => (props ? "100vw" : `calc(100vw - ${drawerWidth}px)`),
    width: `calc(100vw - ${drawerWidth}px)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  active:{
    background:"aliceblue"
  }
}));
const adminOptions = [
  {
    id: 1,
    title: "View Chat",
    icon: <ChatBubbleIcon />,
    path: "/admin/view_chat",
  },
  {
    id: 2,
    title: "View Group Chat",
    icon: <GroupIcon />,
    path: "/admin/view_group_chat",
  },
  {
    id: 3,
    title: "View Signed Up User",
    icon: <PersonIcon />,
    path: "/admin/view_users",
  },
  {
    id: 4,
    title: "View Approved Users",
    icon: <PersonIcon />,
    path: "/admin/view_approved_users",
  },
  {
    id: 5,
    title: "View Declined Users",
    icon: <PersonIcon />,
    path: "/admin/view_declined_users",
  },
];
export default function AdminPanel() {
  const classes = useStyles(open);
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const location = useLocation()
  const dispatch = useDispatch();
  const activePath = location.pathname;
  let {path,url} = useRouteMatch()
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  console.log(path,url)
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const backToChat = () => {
    history.push('/');
    dispatch(setAdminPanel(false));
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div>
          <Box display="flex" justifyContent="space-between" p={0.9}>
            <Button onClick={backToChat} style={{fontWeight:"600",color:PRIMARYMAIN}}>Back to Chat</Button>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </Box>
        </div>
        <Divider />
        <List>
          {adminOptions.map(({ id, icon, title, path }) => (
            <ListItem
            key={id}
            button
            style={{background: activePath == path && "aliceblue"}}
              onClick={() => {
                history.push(path);
              }}
            >
              <ListItemIcon style={{color:PRIMARYMAIN}}>{icon}</ListItemIcon>
              <ListItemText style={{color:PRIMARYMAIN}} primary={title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => <WelcomeAdmin {...props} isBarOpen={open} />}
          />
          <Route path={`${path}/view_chat`} component={ViewChat} exact />
          <Route path={`${path}/view_group_chat`} component={ViewGroupChat} exact />
          <Route path={`${path}/view_users`} component={ViewUsers} exact />
          <Route path={`${path}/view_approved_users`} component={ViewApprovedUsers} exact />
          <Route path={`${path}/view_declined_users`} component={ViewDeclinedUser} exact />
        </Switch>
      </main>
    </div>
  );
}
