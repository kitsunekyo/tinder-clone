import { useState } from "react";
import { CONFIG } from "../config";

export const ChatInput = ({ partnerId, onSent }) => {
  const [textArea, setTextArea] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (textArea === "" || !partnerId) return;

    const res = await fetch(`${CONFIG.apiUrl}/messages`, {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ to_userId: partnerId, message: textArea }),
    });

    if (res.status === 201) {
      setTextArea("");
      onSent();
    }
  };

  return (
    <form className="p-6" onSubmit={handleSubmit}>
      <textarea
        name="chat_input"
        id="chat_input"
        className="input"
        value={textArea}
        cols="30"
        rows="5"
        onChange={(e) => setTextArea(e.target.value)}
      />
      <input
        type="submit"
        className="btn--tertiary w-full"
        disabled={textArea === ""}
        value="submit"
      />
    </form>
  );
};
