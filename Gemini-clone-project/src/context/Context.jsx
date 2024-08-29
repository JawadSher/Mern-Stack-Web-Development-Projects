import { createContext, useState, useRef, useEffect } from "react";
import runChat from "../config/geminiAPI";

export const Context = createContext();

const ContextProvider = (props) => {
  // const [input, setInput] = useState("");
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [recentPrompts, setRecentPrompts] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputLength, setInputLength] = useState(0);
  const container = useRef(null);
  const input = useRef("");

  const delayResult = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
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
      "<a href='$2' style='color: blue; background-color: #f0f8ff;'>$1</a>"
    );
    
    let formattedResponse = responseWithLinks
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(
        /##\s*(.*?)\s*##/g,
        "<h2 style='margin-top: 10px; margin-bottom: 5px;'>$1</h2>"
      )
      .replace(
        /#\s*(.*?)\s*#/g,
        "<h1 style='margin-top: 15px; margin-bottom: 10px;'>$1</h1>"
      )
      .replace(/^\s*\d+\.\s+/gm, "<li style='margin-bottom: 5px;'>")
      .replace(/^\s*-\s+/gm, "<li style='margin-bottom: 5px;'>")
      .replace(/\n\s*\n/g, "<br><br>")
      .replace(/\n/g, "<br>");

    formattedResponse = formattedResponse
      .replace(/(<li[^>]*>.*?<\/li>)(?!<\/ul>)/g, "$1</ul>")
      .replace(/<\/li>\s*(<li[^>]*>)/g, "</li></ul>$1<ul>");

    formattedResponse = formattedResponse
      .replace(
        /(?:<br>\s*)*<li[^>]*>/g,
        "<ul style='margin-left: 20px;'><li style='margin-bottom: 5px;'>"
      )
      .replace(/<\/li>\s*$/g, "</li></ul>");

    formattedResponse = formattedResponse.replace(/\*(.*?)\*/g, "<i>$1</i>");

    let responseArray = formattedResponse.split(" ");

    for (let i = 0; i < responseArray.length; i++) {
      const nextWord = responseArray[i];
      delayResult(i, nextWord + " ");
    }

    setLoading(false);
    input.current = "";
    setInputLength(0);
    // input("")
    // setInput("");
  };

  const handleEnterBtn = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSent();
    }
  };

  useEffect(()=>{
    if(container.current){
      container.current.scrollTop = container.current.scrollHeight;
    }
  }, [resultData]);

  const handleInputChange = (e) =>{
    input.current = e.target.value;
    setInputLength(e.target.value.length);
  }

  const handleRecentInput = (e) =>{
    input.current = e;
    onSent()
    console.log("calling")
  }

  const handleCardClick = (text) =>{
    input.current = text;
    onSent()
  }

  const cardsText = ["Suggest beautiful places to see on an upcomming road trip", "Briefly summarize this concept: urban planning", "Brainstrom team bonding activities for our work retreat", "Improve the readability of the following code"];

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
  };
  return (
    <Context.Provider value={ContextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
