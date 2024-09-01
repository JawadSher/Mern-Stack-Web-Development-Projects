import { createContext, useState, useRef, useEffect } from "react";
import runChat from "../config/geminiAPI";

export const Context = createContext();

const ContextProvider = (props) => {
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [recentPrompts, setRecentPrompts] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputLength, setInputLength] = useState(0);
  const container = useRef(null);
  const input = useRef("");
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [extend, setExtend] = useState(false);

  const delayResult = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const handleNewChat = () => {
    setShowResult(false);
    setLoading(false);
    setResultData("");
  };

  const onSent = async (prompt) => {
    if (!input.current) return;

    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response = "";
    if (prompt) {
      response = await runChat(prompt);
      setRecentPrompts(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input.current]);
      setRecentPrompts(input.current);
      response = await runChat(input.current);
    }

    let responseWithLinks = response.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      "<a href='$2' target='_blank' rel='noopener noreferrer' style='color: blue; background-color: #f0f8ff;'>$1</a>"
    );

    let formattedResponse = responseWithLinks
      .replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const languageColors = {
          javascript: "#f0db4f",
          python: "#3572A5",
          java: "#b07219",
          cpp: "#f34b7d",
          html: "#e34c26",
          css: "#563d7c",
          default: "white",
        };
        const fontColor =
          lang && languageColors[lang.toLowerCase()]
            ? languageColors[lang.toLowerCase()]
            : languageColors.default;
        const languageClass = lang ? `class='language-${lang}'` : "";
        const languageLabel = lang
          ? `<div style='position:absolute; top:5px; left:5px; background-color:#333; color:white; padding:5px 10px; border-radius:3px;'>${lang}</div>`
          : "";

        return `<div class="code-container" style='background-color:#1e1f20; width:100%; color:${fontColor}; display:flex; flex-direction:column; position:relative; padding: 10px; border-radius: 5px; overflow-x: auto;'>
          ${languageLabel}
          <pre><code ${languageClass} style='margin:0; color:${fontColor};'>${code}</code></pre>
        </div>`;
      })
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(
        /^\s*##\s+(.*?)\s*$/gm,
        "<h2 style='margin-bottom: 10px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;'>$1</h2>"
      )
      .replace(
        /^\s*#\s+(.*?)\s*$/gm,
        "<h1 style='margin-bottom: 10px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;'>$1</h1>"
      )
      .replace(
        /^\s*\d+\.\s+/gm,
        "<li style='margin-bottom: 10px; margin-left: 20px;'>"
      )
      .replace(
        /^\s*-\s+/gm,
        "<li style='margin-bottom: 10px; margin-left: 20px;'>"
      )
      .replace(/^\*\s+/gm, "")
      .replace(/\n\s*\n/g, "<br><br>")
      .replace(/\n/g, "<br>");

    formattedResponse = formattedResponse
      .replace(/(<li[^>]*>.*?<\/li>)(?!<\/ul>)/g, "<ul>$1</ul>")
      .replace(/<\/li>\s*(<li[^>]*>)/g, "</li><li>$1</ul><ul>")
      .replace(/(?:<br>\s*)*<li[^>]*>/g, "<li style='margin-bottom: 10px;'>")
      .replace(/<\/li>\s*$/g, "</li>");

    let responseArray = formattedResponse.split(" ");

    for (let i = 0; i < responseArray.length; i++) {
      const nextWord = responseArray[i];
      delayResult(i, nextWord + " ");
    }

    setLoading(false);
    input.current = "";
    setInputLength(0);
  };

  const handleEnterBtn = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSent();
    }
  };

  useEffect(() => {
    if (container.current) {
      const isUserAtBottom =
        container.current.scrollHeight - container.current.scrollTop <=
        container.current.clientHeight + 10;

      if (!isUserAtBottom) {
        setIsUserScrolling(true);
      } else {
        setIsUserScrolling(false);
      }
    }
  }, [null]);

  const handleInputChange = (e) => {
    input.current = e.target.value;
    setInputLength(e.target.value.length);
  };

  const handleRecentInput = (e) => {
    input.current = e;
    onSent();
  };

  const handleCardClick = (text) => {
    input.current = text;
    onSent();
  };

  const cardsText = [
    "Suggest beautiful places to see on an upcomming road trip",
    "Briefly summarize this concept: urban planning",
    "Brainstrom team bonding activities for our work retreat",
    "Improve the readability of the following code",
  ];

  const handleDarkTheme = () => {
    const element1 = document.querySelector(".main");
    const element2 = document.querySelector(".side-bar");
    const element3 = document.querySelector("#root");
    const element4 = document.querySelectorAll(".card");
    const element5 = document.querySelector(".search-box");
    const element6 = document.querySelector(".bottom-info");
    const element7 = document.querySelector(".new-chat");
    const element8 = document.querySelector(".search-area");
    const element9 = document.querySelector(".recent-prompt-scroll");
    const element10 = document.querySelector(".sun-light");
    const element11 = document.querySelector(".help-icon");
    const element12 = document.querySelector(".activity-icon");
    const element13 = document.querySelector(".settings-icon");

    console.log(element9);

    if (!darkTheme) {
      setDarkTheme(true);
      element1.style.backgroundColor = "#0e1117";
      element1.style.color = "#c3c3c3";
      element1.firstChild.firstChild.style.color = "#c6c8cb";
      element2.style.backgroundColor = "#0e1117";
      element3.style.backgroundColor = "#010409";
      element4.forEach((card) => {
        card.style.backgroundColor = "#161a23";
        card.firstChild.style.color = "#c3c3c3";
        card.lastElementChild.style.backgroundColor = "transparent";
        card.addEventListener("mouseenter", () => {
          card.style.backgroundColor = "#1e222c";
        });
        card.addEventListener("mouseleave", () => {
          card.style.backgroundColor = "#161a23";
        });
      });
      element5.style.backgroundColor = "#1a1e28";
      element8.style.color = "#c6c8cb";
      element6.style.color = "#c6c8cb";
      element7.style.backgroundColor = "#272d3c";
      element7.addEventListener("mouseenter", () => {
        element7.style.backgroundColor = "#3d4557";
        element7.lastElementChild.style.color = "#c3c3c3";
      });
      element7.addEventListener("mouseleave", () => {
        element7.style.backgroundColor = "#272d3c";
        element7.lastElementChild.style.color = "";
      });

      if (element9 != null && element9.contains(element9.firstChild)) {
        element9.firstChild.addEventListener("mouseenter", () => {
          element9.firstChild.style.backgroundColor = "#363e4f";
        });
        element9.firstChild.addEventListener("mouseleave", () => {
          element9.firstChild.style.backgroundColor = "";
          element9.firstChild.style.color = "";
        });
      }
    } else {
      setDarkTheme(false);
      element1.style.backgroundColor = "";
      element1.style.color = "";
      element1.firstChild.firstChild.style.color = "";
      element2.style.backgroundColor = "";
      element3.style.backgroundColor = "";
      element4.forEach((card) => {
        card.style.backgroundColor = "";
        card.firstChild.style.color = "";
        card.lastElementChild.style.backgroundColor = "";

        card.addEventListener("mouseenter", () => {
          card.style.backgroundColor = "";
        });
        card.addEventListener("mouseleave", () => {
          card.style.backgroundColor = "";
        });
      });
      element5.style.backgroundColor = "";
      element8.style.color = "";
      element6.style.color = "";
      element7.style.backgroundColor = "";
      element7.addEventListener("mouseenter", () => {
        element7.style.backgroundColor = "";
        element7.lastElementChild.style.color = "";
      });
      element7.addEventListener("mouseleave", () => {
        element7.style.backgroundColor = "";
        element7.lastElementChild.style.color = "";
      });

      if (element9 != null && element9.contains(element9.firstChild)) {
        element9.firstChild.style.backgroundColor = "";
        element9.firstChild.addEventListener("mouseenter", () => {
          element9.firstChild.style.backgroundColor = "";
        });
        element9.firstChild.addEventListener("mouseleave", () => {
          element9.firstChild.style.backgroundColor = "";
          element9.firstChild.style.color = "";
        });
      }
    }
  };

  const ContextValue = {
    input,
    resultData,
    showResult,
    recentPrompts,
    loading,
    onSent,
    handleEnterBtn,
    container,
    prevPrompts,
    handleInputChange,
    inputLength,
    handleRecentInput,
    handleCardClick,
    cardsText,
    handleNewChat,
    darkTheme,
    handleDarkTheme,
    extend,
    setExtend,
  };
  return (
    <Context.Provider value={ContextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
