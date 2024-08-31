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

  const handleNewChat = () =>{
    setShowResult(false);
    setLoading(false);
    setResultData("");
  }

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
          javascript: '#f0db4f',
          python: '#3572A5',
          java: '#b07219',
          cpp: '#f34b7d',
          html: '#e34c26',
          css: '#563d7c',
          default: 'white'
        };
        const fontColor = lang && languageColors[lang.toLowerCase()] ? languageColors[lang.toLowerCase()] : languageColors.default;
        const languageClass = lang ? `class='language-${lang}'` : "";
        const languageLabel = lang ? `<div style='position:absolute; top:5px; left:5px; background-color:#333; color:white; padding:5px 10px; border-radius:3px;'>${lang}</div>` : "";
      
        return `<div class="code-container" style='background-color:#1e1f20; width:100%; color:${fontColor}; display:flex; flex-direction:column; position:relative; padding: 10px; border-radius: 5px; overflow-x: auto;'>
          ${languageLabel}
          <pre><code ${languageClass} style='margin:0; color:${fontColor};'>${code}</code></pre>
        </div>`;
      })
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/^\s*##\s+(.*?)\s*$/gm, "<h2 style='margin-bottom: 10px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;'>$1</h2>")
      .replace(/^\s*#\s+(.*?)\s*$/gm, "<h1 style='margin-bottom: 10px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;'>$1</h1>")
      .replace(/^\s*\d+\.\s+/gm, "<li style='margin-bottom: 10px; margin-left: 20px;'>")
      .replace(/^\s*-\s+/gm, "<li style='margin-bottom: 10px; margin-left: 20px;'>")
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
    const element = document.querySelector(".main");
    const element2 = document.querySelector(".side-bar");
    const element3 = document.querySelector("#root");
    const element4 = document.querySelectorAll(".card");
    const element5 = document.querySelector(".search-box");
    const element6 = document.querySelector(".bottom-info");
    const element7 = document.querySelector(".new-chat");
  
    if (!darkTheme) {
      // Apply dark theme styles
      element.style.backgroundColor = "#131314";
      element.style.color = "#f0f4f9";
      element2.style.backgroundColor = "#131314";
      element3.style.backgroundColor = "#090909";
  
      element4.forEach(card => {
        card.style.backgroundColor = '#282828ff';
        card.firstChild.style.color = '#e3e3e3ff';
        card.lastChild.style.backgroundColor = '#c7c7c7ff';
  
        card.removeEventListener('mouseenter', card._mouseenterListener);
        card.removeEventListener('mouseleave', card._mouseleaveListener);
  
        card._mouseenterListener = () => {
          card.style.backgroundColor = '#383838ff';
          card.firstChild.style.color = '#ffffff';
          card.lastChild.style.backgroundColor = '#d7d7d7ff';
        };
        card._mouseleaveListener = () => {
          card.style.backgroundColor = '#282828ff';
          card.firstChild.style.color = '#e3e3e3ff';
          card.lastChild.style.backgroundColor = '#c7c7c7ff';
        };
  
        card.addEventListener('mouseenter', card._mouseenterListener);
        card.addEventListener('mouseleave', card._mouseleaveListener);
      });
  
      element5.style.backgroundColor = '#282828ff';
      element5.firstChild.style.color = '#c5c5c5';
      element6.style.color = '#c5c5c5';
      element7.style.backgroundColor = '#282828ff';
      element7.lastChild.style.color = '#e3e3e3ff';
  
      element7.removeEventListener('mouseenter', element7._mouseenterListener);
      element7.removeEventListener('mouseleave', element7._mouseleaveListener);
  
      element7._mouseenterListener = () => {
        element7.style.backgroundColor = '#3b3b3b';
        element7.lastChild.style.color = '#ffffff';
      };
      element7._mouseleaveListener = () => {
        element7.style.backgroundColor = '#282828ff';
        element7.lastChild.style.color = '#e3e3e3ff';
      };
  
      element7.addEventListener('mouseenter', element7._mouseenterListener);
      element7.addEventListener('mouseleave', element7._mouseleaveListener);

      input.current = "";
      setDarkTheme(true);
    } else {
      element.style.backgroundColor = "#f0f4f9";
      element.style.color = "#000000";
      element2.style.backgroundColor = "#f0f4f9";
      element3.style.backgroundColor = '#ffffff';
  
      element4.forEach(card => {
        card.style.backgroundColor = '#e0e4eb';

        card.removeEventListener('mouseenter', card._mouseenterListener);
        card.removeEventListener('mouseleave', card._mouseleaveListener);
      });
  
      element5.style.backgroundColor = '#ffffff';
      element5.firstChild.style.color = '#000000';
      element6.style.color = '#000000';
      element7.style.backgroundColor = '#ffffff';
      element7.lastChild.style.color = '#000000';

      element7.removeEventListener('mouseenter', element7._mouseenterListener);
      element7.removeEventListener('mouseleave', element7._mouseleaveListener);
      

      input.current = "";
      setDarkTheme(false);
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
