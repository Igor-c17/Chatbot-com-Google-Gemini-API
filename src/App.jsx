import { useRef, useState, useEffect } from "react"
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";

const App = () => {
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: companyInfo
  }])
  const [showChatbot, setShowChatbot] = useState([false]);
  const chatBodyRef = useRef()

  const generateBotResponse = async (history) => {
    // Função utilitária para atualizar o histórico de mensagens no chat
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Digitando..."),
        { role: "model", text, isError },
      ]);
    };

    // Formata o histórico de mensagens no formato esperado pela API
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // Executa a requisição para a API e obtém a resposta gerada pelo bot
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Algo deu errado!");

      // Atualiza o histórico com a resposta do bot e limpa o estado temporário, se necessário
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  }

  useEffect(() => {
    // Faz o scroll automático para exibir a mensagem mais recente após cada atualização
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show_chatbot" : ""}`}>
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot_toggle"
      >
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="chatbot_popup">
        {/* Chatbot Header */}
        <div className="chat_header">
          <div className="header_info">
            <ChatbotIcon />
            <h2 className="logo_text">Chatbot</h2>
          </div>
          <button
            onClick={() => setShowChatbot((prev) => !prev)}
            className="material-symbols-outlined"
          >
            arrow_downward_alt
          </button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat_body">
          <div className="message bot_message">
            <ChatbotIcon />
            <p className="message_text">
              Olá 👋 <br /> Como posso ajudar você hoje?
            </p>
          </div>

          {/* Renderiza dinamicamente o histórico completo de mensagens no chat */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat_footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;