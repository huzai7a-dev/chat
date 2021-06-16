import React, { useEffect, useState } from "react";
import { Input } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import "./searchBar.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { searchData, UserSearch } from "../../../Redux/Action";

function SearchBar() {
  const data = useSelector((state) => {
    return state;
  });
  const [users, setUsers] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .post("/api/bwccrm/searchUser", {
        loginuser_name: data.Auth.data?.elsemployees_empid,
        input: users,
        user_id: data.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        dispatch(UserSearch(res.data.records));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [users]);
  return (
    <div className="searchBar">
      <input
        className="searchBarInput"
        placeholder="Search People"
        value={users}
        onChange={(e) => {
          setUsers(e.target.value);
          dispatch(searchData(e.target.value));
        }}
      />
      {users ? (
        <ClearIcon
          onClick={() => {
            setUsers("");
            dispatch(searchData(""));
          }}
        />
      ) : (
        <SearchIcon />
      )}
    </div>
  );
}

export default SearchBar;
