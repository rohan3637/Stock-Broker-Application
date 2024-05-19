"use client";
import React, { useState } from "react";

const Modal = ({ onClose, onSubmit }) => {
  const [text, setText] = useState("");

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(text);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content flex">
        <input
          className="border border-gray-400 w-3/4 ml-2 rounded"
          type="text"
          value={text}
          onChange={handleInputChange}
        />
        <button
          className="p-2 text-blue-500 hover:text-blue-700"
          onClick={handleSubmit}
        >
          +
        </button>
        <button
          className="p-2 text-red-500 hover:text-red-700"
          onClick={onClose}
        >
          &#10005;
        </button>
      </div>
    </div>
  );
};

export default Modal;
