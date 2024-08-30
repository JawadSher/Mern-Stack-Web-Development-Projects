import React, { useContext} from "react";
import { assets } from "../../assets/assets";
import "./MainArea.css";
import { Context } from "../../context/Context";

const MainArea = () => {
  const {
    onSent,
    inputLength,
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
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card" onClick={()=> handleCardClick(cardsText[1])}>
                <p>{cardsText[1]}</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card" onClick={()=> handleCardClick(cardsText[2])}>
                <p>{cardsText[2]}</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card" onClick={()=> handleCardClick(cardsText[3])}>
                <p>{cardsText[3]}</p>
                <img src={assets.code_icon} alt="" />
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
              value={input.current}
              onKeyDown={(e) => handleEnterBtn(e)}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {inputLength > 0 && !loading ? (
                <img src={assets.send_icon} alt="" onClick={() => onSent()} />
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
