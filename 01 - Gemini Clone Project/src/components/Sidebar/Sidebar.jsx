import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import "./Sidebar.css";
import { Context } from "../../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {

  const {
    prevPrompts,
    handleRecentInput,
    handleNewChat,
    darkTheme,
    handleDarkTheme,
    extend,
    setExtend,
  } = useContext(Context);

  return (
    <div className="side-bar">
      <div className="top">
        <img
          className="menu"
          src={darkTheme ? assets.menu_white : assets.menu_icon}
          alt=""
          onClick={() => setExtend((prev) => !prev)}
        />
        <div className="new-chat" onClick={handleNewChat}>
          <img src={darkTheme ? assets.add_white : assets.plus_icon} alt="" />
          {extend ? <p>New Chat</p> : null}
        </div>
        {extend ? (
          <div className="recent">
            {darkTheme ?  <p className="recent-title-light" >Recent</p>: <p className="recent-title" >Recent</p>} 
            <div className="recent-prompt-scroll">
              {prevPrompts.length > 0
                ? prevPrompts.map((prompt, index) => (
                    <div
                      className="recent-entry"
                      key={index}
                      onClick={() => handleRecentInput(prompt)}
                    >
                      <img src={assets.message_icon} alt="" />
                      <p>
                        {prompt.slice(0, 40)}
                        {prompt.length > 40 ? " ..." : null}
                      </p>
                    </div>
                  ))
                : null}
            </div>
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry" onClick={handleDarkTheme}>
          {!darkTheme ? (
            <FontAwesomeIcon icon={faMoon} className="dark-moon" />
          ) : (
            <FontAwesomeIcon icon={faSun} className="dark-moon" />
          )}
          {extend ? <p> {!darkTheme ? "Dark" : "Light"}</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extend ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extend ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extend ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
