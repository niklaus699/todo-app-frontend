import React from "react";
import { X } from "lucide-react";

export const DeleteButton = ({ handleRemove }) => {
  return (
    <button
      onClick={() => {
        handleRemove();
      }}
      className="cursor-pointer pointer-events-auto"
      aria-label="remove"
    >
      <X className="text-[#494C6B] hover:text-black" />
    </button>
  );
};
