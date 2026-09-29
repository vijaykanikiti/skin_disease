import React, { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Trash2,
  Loader2
} from "lucide-react";

import "../styles/chatbot.css";

function SkinChatbot() {

  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 I'm your SkinCare AI Assistant. How can I help you today?"
    }
  ]);


  // ==========================================
  // SEND MESSAGE TO SPRING BOOT
  // ==========================================

  const sendMessage = async () => {

    const userText = message.trim();

    if (!userText || isLoading) {
      return;
    }


    // Add user message to chat

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: userText
    };

    setMessages((previous) => [
      ...previous,
      userMessage
    ]);

    setMessage("");

    setIsLoading(true);


    try {

      // ======================================
      // CALL SPRING BOOT API
      // ======================================

      const response = await fetch(
        "http://localhost:8080/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: userText
          })
        }
      );


      // Check API response

      if (!response.ok) {

        throw new Error(
          `Server error: ${response.status}`
        );

      }


      // Convert response to JSON

      const data = await response.json();


      // ======================================
      // ADD AI RESPONSE
      // ======================================

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          data.reply ||
          "Sorry, I couldn't generate a response."
      };


      setMessages((previous) => [
        ...previous,
        botMessage
      ]);


    } catch (error) {

      console.error(
        "Chatbot API error:",
        error
      );


      // Show error inside chatbot

      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          "Sorry, I'm unable to connect to the AI service right now. Please make sure the Spring Boot server is running."
      };


      setMessages((previous) => [
        ...previous,
        errorMessage
      ]);

    } finally {

      setIsLoading(false);

    }

  };


  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  };


  // ==========================================
  // CLEAR CHAT
  // ==========================================

  const clearChat = () => {

    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text:
          "Chat cleared. How can I help you?"
      }
    ]);

  };


  // ==========================================
  // OPEN / CLOSE
  // ==========================================

  return (
    <>

      {/* =====================================
          FLOATING BUTTON
      ====================================== */}

      {!isOpen && (

        <button
          className="chatbot-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chatbot"
        >

          <MessageCircle size={28} />

        </button>

      )}


      {/* =====================================
          CHAT WINDOW
      ====================================== */}

      {isOpen && (

        <div className="chatbot-container">


          {/* =================================
              HEADER
          ================================= */}

          <div className="chatbot-header">

            <div className="chatbot-header-left">

              <div className="chatbot-icon">

                <Bot size={24} />

              </div>


              <div>

                <h3>
                  SkinCare AI
                </h3>

                <span>

                  <span className="online-dot">
                  </span>

                  AI Assistant

                </span>

              </div>

            </div>


            <div className="chatbot-header-actions">

              <button
                className="chatbot-header-button"
                onClick={clearChat}
                title="Clear chat"
              >

                <Trash2 size={18} />

              </button>


              <button
                className="chatbot-header-button"
                onClick={() => setIsOpen(false)}
                title="Close chatbot"
              >

                <X size={20} />

              </button>

            </div>

          </div>


          {/* =================================
              MESSAGES
          ================================= */}

          <div className="chatbot-messages">

            {messages.map((msg) => (

              <div
                key={msg.id}
                className={`chat-message ${
                  msg.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >

                {msg.sender === "bot" && (

                  <div className="message-avatar bot-avatar">

                    <Bot size={16} />

                  </div>

                )}


                <div className="message-content">

                  {msg.text}

                </div>


                {msg.sender === "user" && (

                  <div className="message-avatar user-avatar">

                    <User size={16} />

                  </div>

                )}

              </div>

            ))}


            {/* =================================
                LOADING MESSAGE
            ================================= */}

            {isLoading && (

              <div className="chat-message bot-message">

                <div className="message-avatar bot-avatar">

                  <Bot size={16} />

                </div>


                <div className="message-content chatbot-loading-message">

                  <Loader2
                    size={16}
                    className="chatbot-loader"
                  />

                  Thinking...

                </div>

              </div>

            )}

          </div>


          {/* =================================
              INPUT
          ================================= */}

          <div className="chatbot-input-area">

            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about skin care..."
              disabled={isLoading}
            />


            <button
              className="send-message-button"
              onClick={sendMessage}
              disabled={
                !message.trim() ||
                isLoading
              }
              aria-label="Send message"
            >

              {isLoading ? (

                <Loader2
                  size={19}
                  className="chatbot-loader"
                />

              ) : (

                <Send size={19} />

              )}

            </button>

          </div>


          {/* =================================
              DISCLAIMER
          ================================= */}

          <div className="chatbot-disclaimer">

            AI provides general information and
            does not replace a dermatologist.

          </div>

        </div>

      )}

    </>
  );
}

export default SkinChatbot;