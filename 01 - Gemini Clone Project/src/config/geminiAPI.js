import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  // Access the API key from the environment variable
  const apiKey = 'AIzaSyA3P2byINxZaiiT8JQuV-kNMw_U2kkF3y8';
  
  if (!apiKey) {
    throw new Error("API key is missing. Please set REACT_APP_GEMINI_API_KEY in your .env file.");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function runChat(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  
    const result = await chatSession.sendMessage([prompt]);
    console.log(result.response.text());
    return result.response.text();
  }
  
  export default runChat;
  