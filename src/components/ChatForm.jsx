import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    // Atualiza o histórico do chat com a nova mensagem enviada pelo usuário
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    // Aguarda 600ms antes de exibir o indicador "Digitando..." para melhorar a experiência do usuário
    setTimeout(
      // Insere um placeholder temporário no DOM para a futura resposta do bot
      () => {
        setChatHistory((history) => [
          ...history,
          { role: "model", text: "Digitando..." },
        ]);
      },

      // Executa a função responsável por gerar e renderizar a resposta do bot
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Usando os detalhes fornecidos anteriormente, por favor responda a essa pergunta ${userMessage}`,
        },
      ])
    ),
      600;
  };

  return (
    <form action="#" className="chat_form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Mensagem..."
        className="message_input"
        required
      />
      <button className="material-symbols-outlined">arrow_upward_alt</button>
    </form>
  );
};

export default ChatForm;
