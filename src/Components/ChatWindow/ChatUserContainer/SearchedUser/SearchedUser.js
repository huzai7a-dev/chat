import React, { useCallback } from 'react';
import { Avatar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { setSearchText, setSideBar } from "../../../../Redux/actions/app";
import { setActiveChat, setHeaderData } from "../../../../Redux/actions/chat";
import { DARKMAIN, WHITE } from "../../../../Theme/colorConstant";
import './chatUser.css'

const SearchedUser = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isNightMode = useSelector(state => state.app?.mode)
  const background = isNightMode && DARKMAIN;
  const heading = isNightMode ? WHITE : "#252423";

  const onItemClick = useCallback((e) => {
    e.preventDefault();
    history.push(`/user/${props.users?.elsemployees_empid}`);
    dispatch(setActiveChat(props.users));
    dispatch(setSearchText(""));
    if (window.innerWidth < 700) {
      dispatch(setSideBar(true));
    }
    dispatch(setHeaderData({
      activeType: "user",
      activeName: props.users?.elsemployees_name,
      activeId: props.users?.elsemployees_empid,
    }))
  }, [dispatch, history, props])

  return (
    <div className="chatUser" style={{ background }} onClick={onItemClick} >
      <div className="chatUser__picture">
        <Avatar src={`/bizzportal/public/img/${props.users?.elsemployees_image}`} />
      </div>
      <div className="chatUser__details">
        <h3 style={{ color: heading }}>{props.users?.elsemployees_name}</h3>
      </div>
    </div>
  );
}

export default SearchedUser;
