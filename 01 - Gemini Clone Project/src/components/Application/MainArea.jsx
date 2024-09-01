import React, { useContext} from "react";
import { assets } from "../../assets/assets";
import "./MainArea.css";
import { Context } from "../../context/Context";

const MainArea = () => {
  const {
    onSent,
    input,
    resultData,
    showResult,
    loading,
    handleEnterBtn,
    recentPrompts,
    container,
    handleInputChange,
    handleCardClick,
    cardsText,
    darkTheme,
    inputValue,
  } = useContext(Context);

  return (
    <div className="main">
      <div className="nav-bar">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, XYZ</span>
              </p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              <div className="card" onClick={()=> handleCardClick(cardsText[0])}>
                <p>{cardsText[0]}</p>
                <img src={darkTheme ? assets.compass_white : assets.compass_icon} alt="" />
              </div>
              <div className="card" onClick={()=> handleCardClick(cardsText[1])}>
                <p>{cardsText[1]}</p>
                <img src={darkTheme ? assets.bulb_white : assets.bulb_icon} alt="" />
              </div>
              <div className="card" onClick={()=> handleCardClick(cardsText[2])}>
                <p>{cardsText[2]}</p>
                <img src={darkTheme ? assets.mess_white : assets.message_icon} alt="" />
              </div>
              <div className="card" onClick={()=> handleCardClick(cardsText[3])}>
                <p>{cardsText[3]}</p>
                <img src={darkTheme ? assets.code_white : assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className={`result output-container`}  ref={container}>
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompts}</p>
            </div>
            <div className="result-data" >
              <img
                src={assets.gemini_icon}
                alt=""
                className={loading ? "rotation" : null}
              />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter prompt here"
              onChange={handleInputChange}
              ref={input}
              value={inputValue}
              onKeyDown={(e) => handleEnterBtn(e)}
              className="search-area"
            />
            <div>
              <img src={darkTheme ? assets.gallery_white: assets.gallery_icon} alt="" />
              <img src={darkTheme ? assets.mic_white : assets.mic_icon} alt="" />
              {inputValue.length > 0 && !loading ? (
                <img src={darkTheme ? assets.send_white :assets.send_icon} alt="" onClick={() => onSent()} />
              ) : null}
            </div>
          </div>
          <div className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its response. Your privacy and Gemini Apps
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainArea;
