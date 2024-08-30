import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import "./Sidebar.css";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extend, setExtend] = useState(false);
  const { prevPrompts, handleRecentInput, handleNewChat } = useContext(Context);

  return (
    <div className="side-bar">
      <div className="top">
        <img
          className="menu"
          src={assets.menu_icon}
          alt=""
          onClick={() => setExtend((prev) => !prev)}
        />
        <div className="new-chat" onClick={handleNewChat}>
          <img src={assets.plus_icon} alt="" />
          {extend ? <p>New Chat</p> : null}
        </div>
        {extend ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            <div className="recent-prompt-scroll">
              {prevPrompts.length > 0
                ? prevPrompts.map((prompt, index) => (
                    <div
                      className="recent-entry"
                      key={index}
                      onClick={() => handleRecentInput(prompt)}
                    >
                      <img src={assets.message_icon} alt="" />
                      <p>{prompt.slice(0, 40)}{prompt.length > 40 ? " ...": null}</p>
                    </div>
                  ))
                : null}
            </div>
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extend ? <p>Dark</p> : null}
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
