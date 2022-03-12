import { useState } from "react";

export const ChatInput = () => {
  const [textArea, setTextArea] = useState(null);

  return (
    <div className="p-6">
      <textarea
        name="chat_input"
        id="chat_input"
        className="input"
        value={textArea}
        cols="30"
        rows="5"
        onChange={(e) => setTextArea(e.target.value)}
      />
      <button className="btn--tertiary w-full">Send</button>
    </div>
  );
};
